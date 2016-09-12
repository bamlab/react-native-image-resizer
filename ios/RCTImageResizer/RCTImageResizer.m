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

bool saveImage(NSString * fullPath, UIImage * image, NSString * format, float quality)
{
    NSData* data = nil;
    if ([format isEqualToString:@"JPEG"]) {
        data = UIImageJPEGRepresentation(image, quality / 100.0);
    } else if ([format isEqualToString:@"PNG"]) {
        data = UIImagePNGRepresentation(image);
    }
    
    if (data == nil) {
        return NO;
    }
    
    NSFileManager* fileManager = [NSFileManager defaultManager];
    [fileManager createFileAtPath:fullPath contents:data attributes:nil];
    return YES;
}

NSString * generateFilePath(NSString * ext, NSString * outputPath)
{
    NSString* directory;

    if ([outputPath length] == 0) {
        NSArray* paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
        directory = [paths firstObject];
    } else {
        directory = outputPath;
    }

    NSString* name = [[NSUUID UUID] UUIDString];
    NSString* fullName = [NSString stringWithFormat:@"%@.%@", name, ext];
    NSString* fullPath = [directory stringByAppendingPathComponent:fullName];

    return fullPath;
}

RCT_EXPORT_METHOD(createResizedImage:(NSString *)path
                  width:(float)width
                  height:(float)height
                  format:(NSString *)format
                  quality:(float)quality
                  outputPath:(NSString *)outputPath
                  callback:(RCTResponseSenderBlock)callback)
{
    CGSize newSize = CGSizeMake(width, height);
    NSString* fullPath = generateFilePath(@"jpg", outputPath);

    [_bridge.imageLoader loadImageWithURLRequest:[RCTConvert NSURLRequest:path] callback:^(NSError *error, UIImage *image) {
        if (error || image == nil) {
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

        // Compress and save the image
        if (!saveImage(fullPath, scaledImage, format, quality)) {
            callback(@[@"Can't save the image. Check your compression format.", @""]);
            return;
        }
        
        callback(@[[NSNull null], fullPath]);
    }];
}

@end
