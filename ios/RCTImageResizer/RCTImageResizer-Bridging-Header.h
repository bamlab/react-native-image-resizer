//
//  Use this file to import your target's public headers that you would like to expose to Swift.
//  Allows Swift code to import and use React-Native Objective-C code
//

#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>
#import <React/RCTImageLoader.h>

#elif __has_include(“RCTBridgeModule.h”)
#import “RCTBridgeModule.h”
#import “RCTBridge.h”
#import “RCTImageLoader.h”

#else // Required when used as a Pod in a Swift project
#import “React/RCTBridgeModule.h”
#import <React/RCTBridge.h>
#import <React/RCTImageLoader.h>
#endif

#import <AssetsLibrary/AssetsLibrary.h>
#import <MobileCoreServices/MobileCoreServices.h>
