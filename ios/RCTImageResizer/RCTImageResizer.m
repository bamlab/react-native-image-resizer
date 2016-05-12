//
//  ImageResize.m
//  ChoozItApp
//
//  Created by Florian Rival on 19/11/15.
//

#include "RCTImageResizer.h"
#include "ImageHelpers.h"
#import "RCTImageLoader.h"

@implementation ImageResizer

@synthesize bridge = _bridge;

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

RCT_EXPORT_METHOD(createResizedImage:(NSString *)path
                  width:(float)width
                  height:(float)height
                  quality:(float)quality
                  callback:(RCTResponseSenderBlock)callback)
{
    CGSize newSize = CGSizeMake(width, height);
    NSString* fullPath = generateCacheFilePath(@"jpg");

    [_bridge.imageLoader loadImageWithTag:path callback:^(NSError *error, UIImage *image) {
        if (error || image == nil) {
            UIImage* image;
            if ([path hasPrefix:@"data:"] || [path hasPrefix:@"file:"]) {
                NSURL *imageUrl = [[NSURL alloc] initWithString:path];
                image = [UIImage imageWithData:[NSData dataWithContentsOfURL:imageUrl]];
            } else {
                image = [[UIImage alloc] initWithContentsOfFile:path];
            }
            if (image == nil) {
                callback(@[@"Can't retrieve the file from the path.", @""]);
                return;
            }
        }

        // Do the resizing
        UIImage * scaledImage = [image scaleToSize:newSize];
        if (scaledImage == nil) {
            callback(@[@"Can't resize the image.", @""]);
            return;
        }

        saveImage(fullPath, scaledImage, quality);
        callback(@[[NSNull null], fullPath]);
    }];
}

@end
