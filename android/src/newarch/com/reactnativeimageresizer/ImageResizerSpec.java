package com.reactnativeimageresizer;

import com.facebook.react.bridge.ReactApplicationContext;

abstract class ImageResizerSpec extends NativeImageResizerSpec {
  ImageResizerSpec(ReactApplicationContext context) {
    super(context);
  }
}
