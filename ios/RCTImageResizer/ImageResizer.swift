import Foundation

@objc(ImageResizer)
public class ImageResizer: NSObject {
    
    @objc
    open var bridge: RCTBridge?
    
    @objc
    public func createResizedImage(_ path:NSString, width:Float, height:Float, format:NSString, quality:CGFloat, rotation: Float, outputPath: NSString, keepMeta: Bool, options: Dictionary<String, Any>, callback: @escaping RCTResponseSenderBlock) {
        let main = DispatchQueue.global()
        main.async {
            let newSize = CGSize(width: CGFloat(width), height: CGFloat(height))
            let fileExtension = format == "PNG" ? "png" : "jpg"
            let fullPath = self.generateFilePath(fileExtension: fileExtension, outputPath: outputPath as String)
            
            let loader = self.bridge?.module(forName: "ImageLoader", lazilyLoadIfNecessary: true) as! RCTImageLoader
            loader.loadImage(with: RCTConvert.nsurlRequest(path),
                             size: newSize,
                             scale: 1,
                             clipped: false,
                             resizeMode: RCTResizeMode.contain,
                             progressBlock: nil,
                             partialLoad: nil,
                             completionBlock: { (error, image) in
                                if (error != nil) {
                                    callback(["Can't retrieve the file from the path when loading the image."])
                                    return
                                }
                                
                                guard let image = image else {
                                    callback(["Can't retrieve the file from the path when loading the image."])
                                    return
                                }
                                
                                self.transformImage(image: image, originalPath: path as String, callback: callback, rotation: Int(rotation), newSize: newSize, fullPath: fullPath, format: format as String, quality: Int(quality), keepMeta: keepMeta, options: options)
                             })
            
        }
    }
    
    func saveImage(fullPath: String, image: UIImage, format: String, quality: CGFloat, metadata: [String: Any]) -> Bool {
        var metaDataCopy = metadata
        var maybeData: Data? = nil
        
        if metadata.isEmpty {
            if format == "JPEG" {
                maybeData = image.jpegData(compressionQuality: quality / 100.0)
            }
            else if format == "PNG" {
                maybeData = image.pngData()
            }
            guard let data = maybeData else {
                return false
            }
            
            do {
                try data.write(to: URL(fileURLWithPath: fullPath))
            }
            catch let error {
                print(error)
                return false
            }
            
            return true
        }
        else {
            var imageType: CFString = kUTTypeJPEG
            
            if format == "JPEG" {
                metaDataCopy["kCGImageDestinationLossyCompressionQuality"] = quality / 100.0
            } else if format == "PNG" {
                imageType = kUTTypePNG
            } else {
                return false
            }
            
            let destData = NSMutableData()
            guard let dest = CGImageDestinationCreateWithData(destData as CFMutableData, imageType, 1, nil) else { return false }
            CGImageDestinationAddImage(dest, image.cgImage!, nil)
            
            if CGImageDestinationFinalize(dest) {
                try! destData.write(to: URL(fileURLWithPath: fullPath))
                return true
            }
        }
        return false
    }
    
    func generateFilePath(fileExtension: String, outputPath: String) -> String {
        var directory: String?
        
        
        if outputPath.count == 0 {
            let paths = NSSearchPathForDirectoriesInDomains(.cachesDirectory, .userDomainMask, true)
            directory = paths.first
        }
        else {
            let paths = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)
            // TODO remove casting
            let documentsDirectory = paths.first!
            
            if outputPath.hasPrefix(documentsDirectory) {
                directory = outputPath
            }
            else {
                directory =  URL(string: documentsDirectory)?.appendingPathComponent(outputPath).absoluteString
            }
            
            do {
                // TODO remove casting
                try FileManager.default.createDirectory(atPath: directory!, withIntermediateDirectories: true, attributes: nil)
            }
            catch let error {
                // TODO: callback ?
                print(error)
            }
        }
        let fileName = UUID().uuidString
        let fullName = "\(fileName).\(fileExtension)"
        
        // Remove casting
        let fullPath = URL(string: directory!)!.appendingPathComponent(fullName).relativeString
        return fullPath
    }
    
    func rotateImage(inputImage: UIImage, rotationDegrees: CGFloat) -> UIImage {
        
        guard let inputCGImage = inputImage.cgImage else {
            // TODO: add log
            return inputImage
        }
        
        let rotDiv90 = (rotationDegrees / 90).rounded(.toNearestOrEven)
        let rotQuadrant = rotDiv90.truncatingRemainder(dividingBy: 4)
        let rotQuadrantAbs = (rotQuadrant < 0) ? rotQuadrant + 4 : rotQuadrant
        
        switch rotQuadrantAbs {
        case 1: // 90 deg CW
            return UIImage(cgImage: inputCGImage, scale: 1.0, orientation: .right)
        case 2: // 180 deg
            return UIImage(cgImage: inputCGImage, scale: 1.0, orientation: .down)
        case 3: // 270 deg CW
            return UIImage(cgImage: inputCGImage, scale: 1.0, orientation: .left)
        default:
            return inputImage
        }
    }
    
    func getScaleForProportionalResize(originSize: CGSize, intoSize: CGSize, onlyScaleDown: Bool, maximize: Bool) -> CGFloat {
        let sizeX = originSize.width
        let sizeY = originSize.height
        var deltaX = intoSize.width
        var deltaY = intoSize.height
        var scale: CGFloat = 1
        
        if sizeX != 0 && sizeY != 0 {
            deltaX = deltaX / sizeX
            deltaY = deltaY / sizeY
            
            // if maximize is true, take LARGER of the scales, else smaller
            if (maximize) {
                scale = CGFloat.maximum(deltaX, deltaY)
            } else {
                scale = CGFloat.minimum(deltaX, deltaY)
            }
            
            if onlyScaleDown {
                scale = CGFloat.minimum(scale, 1);
            }
            
        } else {
            scale = 0
        }
        return scale
    }
    
    // returns a resized image keeping aspect ratio and considering
    // any :image scale factor.
    // The returned image is an unscaled image (scale = 1.0)
    // so no additional scaling math needs to be done to get its pixel dimensions
    func scaleImage(inputImage: UIImage, toSize: CGSize, mode: String, onlyScaleDown: Bool) -> UIImage {
        // Need to do scaling corrections
        // based on scale, since UIImage width/height gives us
        // a possibly scaled image (dimensions in points)
        // Idea taken from RNCamera resize code
        let inputImageSize = CGSize(width: inputImage.size.width * inputImage.scale, height: inputImage.size.height * inputImage.scale);
        
        var newSize: CGSize
        
        if mode == "stretch" {
            // Distort aspect ratio
            var width = toSize.width;
            var height = toSize.height;
            
            if (onlyScaleDown) {
                width = CGFloat.minimum(width, inputImageSize.width);
                height =  CGFloat.minimum(height, inputImageSize.height);
            }
            
            newSize = CGSize(width: width, height: height);
        } else {
            // Either "contain" (default) or "cover": preserve aspect ratio
            let maximize = mode == "cover"
            let scale = getScaleForProportionalResize(originSize: inputImageSize, intoSize: toSize, onlyScaleDown: onlyScaleDown, maximize: maximize)
            
            newSize = CGSize(
                width: (inputImageSize.width * scale).rounded(.toNearestOrEven),
                height: (inputImageSize.height * scale).rounded(.toNearestOrEven)
            )
        }
        
        UIGraphicsBeginImageContextWithOptions(newSize, false, 1.0)
        inputImage.draw(in: CGRect(x: 0, y: 0, width: newSize.width, height: newSize.height))
        let maybeNewImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        
        guard let newImage = maybeNewImage else {
            print("Unable to scale the image. Falling back to the original image")
            return inputImage
        }
        return newImage
    }
    
    func getImageMetaData(path: String) -> [String: Any]? {
        var res: [String: Any]? = nil
        
        if path.hasPrefix("assets-library") {
            res = nil
            
            let resultsBlock: ALAssetsLibraryAssetForURLResultBlock  = { asset in
                // TODO: remove casting
                let representation = asset!.defaultRepresentation()
                var exif = representation!.metadata()
            }
            let assetsLibrary = ALAssetsLibrary()
            // TODO: casting
            let url = URL(string: path.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)!)
            assetsLibrary.asset(for: url, resultBlock: resultsBlock, failureBlock: { error in
                print(["error couldn't image from assets library"])
            })
            
            return res
        }
        else {
            var imageData: Data? = nil
            do {
                imageData = try NSData(contentsOfFile: path) as Data
            }
            catch {
                print("Could not get image file data to extract metadata.")
                return nil
            }
            // TODO casting
            let source = CGImageSourceCreateWithData(imageData! as CFData, nil)
            
            if let source = source {
                let metaRef = CGImageSourceCopyPropertiesAtIndex(source, 0, nil)
                let metaRefMutable = CFDictionaryCreateMutableCopy(nil, 0, metaRef)
                
                // TODO: casting
                return metaRefMutable as? [String : Any]
            }
            else {
                return nil
            }
            
        }
    }
    
    func transformImage(image: UIImage,
                        originalPath: String,
                        callback: @escaping RCTResponseSenderBlock,
                        rotation: Int,
                        newSize: CGSize,
                        fullPath: String,
                        format: String,
                        quality: Int,
                        keepMeta: Bool,
                        options: Dictionary<String, Any>) {
        
        var mutableImage = image
        
        // Rotate image if rotation is specified.
        if (rotation != 0) {
            mutableImage = rotateImage(inputImage: mutableImage, rotationDegrees: CGFloat(rotation))
        }
        
        // Do the resizing
        // TODO: remove casting
        mutableImage = scaleImage(
            inputImage: mutableImage,
            toSize: newSize,
            mode: options["mode"] as! String,
            onlyScaleDown: options["onlyScaleDown"] as! Bool
        )
        
        var metaData: [String:Any] = [:]
        // to be consistent with Android, we will only allow JPEG
        // to do this.
        if(keepMeta && format  == "JPEG"){
            
            metaData = getImageMetaData(path: originalPath) ?? [:]
            
            // remove orientation (since we fix it)
            // width/height meta is adjusted automatically
            // NOTE: This might still leave some stale values due to resize
            // TODO : is this the right translation ?
            metaData["kCGImagePropertyOrientation"] = 1
            
        }
        
        // Compress and save the image
        let hasSavedImage = saveImage(fullPath: fullPath, image: mutableImage, format: format, quality: CGFloat(quality), metadata: metaData)
        if !hasSavedImage {
            callback(["Can't save the image. Check your compression format and your output path"]);
            return
        }
        
        let fileUrl = URL(fileURLWithPath: fullPath)
        let fileName = fileUrl.lastPathComponent
        var fileAttributes: [FileAttributeKey : Any] = [:]
        do {
            fileAttributes = try FileManager.default.attributesOfItem(atPath: fullPath)
        }
        catch let error {
            //TODO
            print(error)
            print("Unable to fetch attributes of image")
        }
        let fileSize = fileAttributes[FileAttributeKey.size] ?? 0
        // TODO: investigate why uri: fileUrl in previous implementation
        let response: [String: Any] = [
            "path": fullPath,
            "uri": fileUrl.absoluteString,
            "name": fileName,
            "size": fileSize,
            "width": mutableImage.size.width,
            "height": mutableImage.size.height
        ]
        
        callback([nil, response]);
    }
    
}
