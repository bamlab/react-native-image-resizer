package com.reactnativeimageresizer;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.AsyncTask;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.GuardedAsyncTask;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

public class ImageResizerModuleImpl {
  public static final String NAME = "ImageResizer";

  public static void createResizedImage(String uri, double width, double height, String format, double quality, Double rotation, @Nullable String outputPath, Boolean keepMeta, @Nullable String mode, Boolean onlyScaleDown, Promise promise, Context context, ReactApplicationContext reactContext) {
    WritableMap options = Arguments.createMap();
    options.putString("mode", mode);
    options.putBoolean("onlyScaleDown", onlyScaleDown);

    // Run in guarded async task to prevent blocking the React bridge
    new GuardedAsyncTask<Void, Void>(reactContext) {
      @Override
      protected void doInBackgroundGuarded(Void... params) {
        try {
          Object response = createResizedImageWithExceptions(uri, (int) width, (int) height, format, (int) quality, rotation.intValue(), outputPath, keepMeta, options, context);
          promise.resolve(response);
        }
        catch (IOException e) {
          promise.reject(e);
        }
      }
    }.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
  }

  @SuppressLint("LongLogTag")
  private static Object createResizedImageWithExceptions(String imagePath, int newWidth, int newHeight,
                                                  String compressFormatString, int quality, int rotation, String outputPath,
                                                  final boolean keepMeta,
                                                  final ReadableMap options, Context context) throws IOException {

    Bitmap.CompressFormat compressFormat = Bitmap.CompressFormat.valueOf(compressFormatString);
    Uri imageUri = Uri.parse(imagePath);

    Bitmap scaledImage = ImageResizer.createResizedImage(context, imageUri, newWidth, newHeight, quality, rotation,
      options.getString("mode"), options.getBoolean("onlyScaleDown"));

    if (scaledImage == null) {
      throw new IOException("The image failed to be resized; invalid Bitmap result.");
    }

    // Save the resulting image
    File path = context.getCacheDir();
    if (outputPath != null) {
      path = new File(outputPath);
    }

    File resizedImage = ImageResizer.saveImage(scaledImage, path, UUID.randomUUID().toString(), compressFormat, quality);
    WritableMap response = Arguments.createMap();

    // If resizedImagePath is empty and this wasn't caught earlier, throw.
    if (resizedImage.isFile()) {
      response.putString("path", resizedImage.getAbsolutePath());
      response.putString("uri", Uri.fromFile(resizedImage).toString());
      response.putString("name", resizedImage.getName());
      response.putDouble("size", resizedImage.length());
      response.putDouble("width", scaledImage.getWidth());
      response.putDouble("height", scaledImage.getHeight());

      // Copy file's metadata/exif info if required
      if(keepMeta){
        try{
          ImageResizer.copyExif(context, imageUri, resizedImage.getAbsolutePath());
        }
        catch(Exception ignored){
          Log.e("ImageResizer::createResizedImageWithExceptions", "EXIF copy failed", ignored);
        };
      }
    } else {
      throw new IOException("Error getting resized image path");
    }


    // Clean up bitmap
    scaledImage.recycle();
    return response;
  }
}
