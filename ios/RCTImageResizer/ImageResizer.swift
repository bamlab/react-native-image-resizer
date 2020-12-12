import Foundation

@objc(ImageResizer)
public class ImageResizer: NSObject {
    
    @objc
    public func createResizedImage(_ path:NSString, width:Float, height:Float, format:NSString, quality:Float, rotation: Float, outputPath: NSString, keepMeta: Bool, options: NSDictionary, callback: RCTResponseSenderBlock) {
        print(path)
    }
}
