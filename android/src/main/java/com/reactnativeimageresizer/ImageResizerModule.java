package com.reactnativeimageresizer;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = ImageResizerModule.NAME)
public class ImageResizerModule extends NativeImageResizerSpec {
    public static final String NAME = "ImageResizer";

    public ImageResizerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    @Override
    public double multiply(double a, double b) {
        return a * b;
    }
}
