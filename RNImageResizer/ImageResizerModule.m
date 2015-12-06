//
//  ImageResize.m
//  ChoozItApp
//
//  Created by Florian Rival on 19/11/15.
//

#import <AssetsLibrary/AssetsLibrary.h>
#import "RCTBridgeModule.h"
#include "ImageHelpers.h"

@interface ImageResizerModule : NSObject <RCTBridgeModule>
@end

@implementation ImageResizerModule

RCT_EXPORT_MODULE();

void saveImage(NSString * fullPath, UIImage * image, float quality)
{
  NSData* data = UIImageJPEGRepresentation(image, quality / 100.0);
  NSFileManager* fileManager = [NSFileManager defaultManager];
  [fileManager createFileAtPath:fullPath contents:data attributes:nil];
}

NSString * generateCacheFilePath(NSString * ext)
{
  NSArray* paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
  NSString* cacheDirectory = [paths firstObject];
  NSString* name = [[NSUUID UUID] UUIDString];
  NSString* fullName = [NSString stringWithFormat:@"%@.%@", name, ext];
  NSString* fullPath = [cacheDirectory stringByAppendingPathComponent:fullName];

  return fullPath;
}

RCT_EXPORT_METHOD(createResizedImage:(NSString *)path width:(float)width height:(float)height quality:(float)quality callback:(RCTResponseSenderBlock)callback)
{
  CGSize newSize = CGSizeMake(width, height);
  NSString* fullPath = generateCacheFilePath(@".jpg");

  NSURL* url = [NSURL URLWithString:path];
  if ([[url scheme] isEqualToString:@"assets-library"]) {
    ALAssetsLibrary* library = [[ALAssetsLibrary alloc] init];

    // Ask for the "Asset" for the URL. An asset is a representation of an image in the Photo application.
    [library assetForURL:url resultBlock:^(ALAsset *asset) {
        ALAssetRepresentation* representation = [asset defaultRepresentation];
        
        // Retrieve the image orientation from the ALAsset
        UIImageOrientation orientation = UIImageOrientationUp;
        NSNumber* orientationValue = [asset valueForProperty:@"ALAssetPropertyOrientation"];
        if (orientationValue != nil) {
            orientation = [orientationValue intValue];
        }
        
        CGFloat scale  = 1;
        UIImage* image = [UIImage imageWithCGImage:[representation fullResolutionImage]
                                             scale:scale orientation:orientation];

        //Do the resizing
        UIImage * scaledImage = [image scaleToSize:newSize];
        if (scaledImage == nil) {
          callback(@[@"Can't resize the image.", @""]);
          return;
        }

        saveImage(fullPath, scaledImage, quality);
        callback(@[[NSNull null], fullPath]);
      } failureBlock:^(NSError *error) {
        callback(@[@"Can't retrieve the file from assets library.", @""]);
      }];
  } else {
    //Get the image from its path
    UIImage* image = [[UIImage alloc] initWithContentsOfFile:path];
    if (image == nil) {
      callback(@[@"Can't retrieve the file from the path.", @""]);
      return;
    }

    //Do the resizing
    UIImage * scaledImage = [image scaleToSize:newSize];
    if (scaledImage == nil) {
      callback(@[@"Can't resize the image.", @""]);
      return;
    }

    saveImage(fullPath, scaledImage, quality);
    callback(@[[NSNull null], fullPath]);
  }
}
@end
