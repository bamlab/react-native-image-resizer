package com.reactnativeimageresizer;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Handler;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.GuardedAsyncTask;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

@ReactModule(name = ImageResizerModule.NAME)
public class ImageResizerModule extends NativeImageResizerSpec {
    public static final String NAME = "ImageResizer";
    private Context context;

    public ImageResizerModule(ReactApplicationContext reactContext) {
      super(reactContext);
      this.context = reactContext;
    }

  @Override
  @NonNull
  public String getName() {
      return NAME;
  }

  @Override
  public void createdResizedImage(String uri, double width, double height, String format, double quality, Double rotation, @Nullable String outputPath, Boolean keepMeta, @Nullable String mode, Boolean onlyScaleDown, Promise promise) {
    WritableMap options = Arguments.createMap();
    options.putString("mode", mode);
    options.putBoolean("onlyScaleDown", onlyScaleDown);

    // Run in guarded async task to prevent blocking the React bridge
    new GuardedAsyncTask<Void, Void>(getReactApplicationContext()) {
      @Override
      protected void doInBackgroundGuarded(Void... params) {
        try {
          Object response = createResizedImageWithExceptions(uri, (int) width, (int) height, format, (int) quality, rotation.intValue(), outputPath, keepMeta, options);
          promise.resolve(response);
        }
        catch (IOException e) {
          promise.reject(e);
        }
      }
    }.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
  }

  @SuppressLint("LongLogTag")
  private Object createResizedImageWithExceptions(String imagePath, int newWidth, int newHeight,
                                                  String compressFormatString, int quality, int rotation, String outputPath,
                                                  final boolean keepMeta,
                                                  final ReadableMap options) throws IOException {

    Bitmap.CompressFormat compressFormat = Bitmap.CompressFormat.valueOf(compressFormatString);
    Uri imageUri = Uri.parse(imagePath);

    Bitmap scaledImage = ImageResizer.createResizedImage(this.context, imageUri, newWidth, newHeight, quality, rotation,
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
      ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
      scaledImage.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
      byte[] byteArray = byteArrayOutputStream .toByteArray();
      String base64 = Base64.encodeToString(byteArray, Base64.DEFAULT);

      response.putString("path", resizedImage.getAbsolutePath());
      response.putString("uri", Uri.fromFile(resizedImage).toString());
      response.putString("name", resizedImage.getName());
      response.putDouble("size", resizedImage.length());
      response.putDouble("width", scaledImage.getWidth());
      response.putDouble("height", scaledImage.getHeight());
      response.putString("base64", base64);

      // Copy file's metadata/exif info if required
      if(keepMeta){
        try{
          ImageResizer.copyExif(this.context, imageUri, resizedImage.getAbsolutePath());
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
