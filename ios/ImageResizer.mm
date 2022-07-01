#import "ImageResizer.h"
#import <React/RCTLog.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNImageResizerSpec.h"
#endif

@implementation ImageResizer
RCT_EXPORT_MODULE()

// Example method
// See // https://reactnative.dev/docs/native-modules-ios
RCT_REMAP_BLOCKING_SYNCHRONOUS_METHOD(multiply,
                                      NSNumber *,
                                      multiplyWithA:(double)a  withB:(double)b)
{
    NSNumber *result = @(a * b);

    return result;
}

RCT_REMAP_BLOCKING_SYNCHRONOUS_METHOD(addition,
                                      NSNumber *,
                                      additionWithA:(double)a  withB:(double)b)
{
    NSNumber *result = @(a + b);

    return result;
}


// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    RCTLogInfo(@"Turbo module called !");
    return std::make_shared<facebook::react::NativeImageResizerSpecJSI>(params);
}
#endif

- (NSNumber *)addition:(double)a b:(double)b {
    return [NSNumber numberWithDouble:(a+b)];
}

- (NSNumber *)multiply:(double)a b:(double)b {
   return [NSNumber numberWithDouble:(a*b)];
}

@end
