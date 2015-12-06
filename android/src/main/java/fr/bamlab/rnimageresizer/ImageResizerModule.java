package fr.bamlab.rnimageresizer;

import android.content.Context;
import android.graphics.Bitmap;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.IOException;

/**
 * Created by almouro on 19/11/15.
 */
class ImageResizerModule extends ReactContextBaseJavaModule {
    private Context context;

    public ImageResizerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
    }

    /**
     * @return the name of this module. This will be the name used to {@code require()} this module
     * from javascript.
     */
    @Override
    public String getName() {
        return "ImageResizerAndroid";
    }

    @ReactMethod
    public void createResizedImage(String imagePath, int newWidth, int newHeight, String compressFormat,
                            int quality, int rotation, final Callback successCb, final Callback failureCb) {
        try {
            createResizedImageWithExceptions(imagePath, newWidth, newHeight, compressFormat, quality,
                    rotation, successCb, failureCb);
        } catch (IOException e) {
            failureCb.invoke(e.getMessage());
        }
    }

    private void createResizedImageWithExceptions(String imagePath, int newWidth, int newHeight,
                                           String compressFormatString, int quality, int rotation,
                                           final Callback successCb, final Callback failureCb) throws IOException {
        Bitmap.CompressFormat compressFormat = Bitmap.CompressFormat.valueOf(compressFormatString);
        imagePath = imagePath.replace("file:", "");
        String resizedImagePath = ImageResizer.createResizedImage(this.context, imagePath, newWidth,
                newHeight, compressFormat, quality, rotation);

        successCb.invoke("file:" + resizedImagePath);
    }
}
