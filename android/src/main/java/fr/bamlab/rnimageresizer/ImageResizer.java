package fr.bamlab.rnimageresizer;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.media.ThumbnailUtils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;

/**
 * Created by almouro on 11/19/15.
 */
class ImageResizer {
    private static Bitmap resizeImage(String imagePath, int newWidth, int newHeight) {
        try {
            return ThumbnailUtils.extractThumbnail(
                    BitmapFactory.decodeFile(imagePath),
                    newWidth,
                    newHeight
            );
        } catch (OutOfMemoryError ex) {
            // We have no memory to rotate. Return the original bitmap.
        }

        return null;
    }

    public static Bitmap rotateImage(Bitmap b, float degrees)
    {
        if (degrees != 0 && b != null) {
            Matrix m = new Matrix();
            m.setRotate(degrees,
                    (float) b.getWidth() / 2, (float) b.getHeight() / 2);
            try {
                Bitmap b2 = Bitmap.createBitmap(
                        b, 0, 0, b.getWidth(), b.getHeight(), m, true);
                if (b != b2) {
                    b.recycle();
                    b = b2;
                }
            } catch (OutOfMemoryError ex) {
                // We have no memory to rotate. Return the original bitmap.
            }
        }
        return b;
    }

    private static String saveImage(Bitmap bitmap, File saveDirectory, String fileName,
                                    Bitmap.CompressFormat compressFormat, int quality)
            throws IOException {
        if (bitmap == null) {
            throw new IOException("The bitmap couldn't be resized");
        }

        File newFile = new File(saveDirectory, fileName + "." + compressFormat.name());
        if(!newFile.createNewFile()) {
            throw new IOException("The file already exists");
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        bitmap.compress(compressFormat, quality, outputStream);
        byte[] bitmapData = outputStream.toByteArray();

        outputStream.flush();
        outputStream.close();

        FileOutputStream fos = new FileOutputStream(newFile);
        fos.write(bitmapData);
        fos.flush();
        fos.close();

        return newFile.getAbsolutePath();
    }

    public static String createResizedImage(Context context, String imagePath, int newWidth,
                                            int newHeight, Bitmap.CompressFormat compressFormat,
                                            int quality, int rotation) throws IOException {

        Bitmap resizedImage = ImageResizer.rotateImage(ImageResizer.resizeImage(imagePath, newWidth, newHeight), rotation);
        return ImageResizer.saveImage(resizedImage, context.getCacheDir(),
                Long.toString(new Date().getTime()), compressFormat, quality);
    }
}
