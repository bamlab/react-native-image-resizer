package com.reactnativeimageresizer;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

abstract class ImageResizerSpec extends ReactContextBaseJavaModule {

  ImageResizerSpec(ReactApplicationContext context) {
    super(context);
  }

  public abstract void createResizedImage(String uri, double width, double height, String format, double quality, String mode, boolean onlyScaleDown, Double rotation, @Nullable String outputPath, Boolean keepMeta, Promise promise);
}
