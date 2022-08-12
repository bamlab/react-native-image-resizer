#ifdef RCT_NEW_ARCH_ENABLED
#import "RNImageResizerSpec.h"
#else
#import <React/RCTBridgeModule.h>
#endif

#ifdef RCT_NEW_ARCH_ENABLED
@interface ImageResizer : NSObject <NativeImageResizerSpec>
#else
@interface ImageResizer : NSObject <RCTBridgeModule>
#endif

@end
