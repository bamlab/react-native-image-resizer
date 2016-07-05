package fr.bamlab.rnimageresizer;

import android.content.Context;
import android.content.ContentResolver;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.net.Uri;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.IOException;
import java.util.Date;

/**
 * Created by almouro on 11/19/15.
 */
class ImageResizer {

    private static Bitmap resizeImage(String imagePath, int maxWidth, int maxHeight, Context context) {
        try {
            Bitmap image;
            if (!imagePath.startsWith("content://") && !imagePath.startsWith("file://")) {
                image = BitmapFactory.decodeFile(imagePath);
            } else {
                ContentResolver cr = context.getContentResolver();
                Uri url = Uri.parse(imagePath);
                InputStream input = cr.openInputStream(url);
                image = BitmapFactory.decodeStream(input);
                input.close();
            }

            if (image == null) {
                return null; // Can't load the image from the given path.
            }

            if (maxHeight > 0 && maxWidth > 0) {
                float width = image.getWidth();
                float height = image.getHeight();

                float ratio = Math.min((float)maxWidth / width, (float)maxHeight / height);

                int finalWidth = (int) (width * ratio);
                int finalHeight = (int) (height * ratio);
                image = Bitmap.createScaledBitmap(image, finalWidth, finalHeight, true);
            }

            return image;
        }catch (IOException ex) {
             // No memory available for resizing.
        }

        return null;
    }

    public static Bitmap rotateImage(Bitmap source, float angle)
    {
        Bitmap retVal;

        Matrix matrix = new Matrix();
        matrix.postRotate(angle);
        retVal = Bitmap.createBitmap(source, 0, 0, source.getWidth(), source.getHeight(), matrix, true);
        //for memory purposes
        source.recycle();

        return retVal;
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
                                            int quality, int rotation, String outputPath) throws IOException  {

        Bitmap resizedImage = ImageResizer.rotateImage(ImageResizer.resizeImage(imagePath, newWidth, newHeight, context), rotation);

        File path = context.getCacheDir();
        if (outputPath != null ) {
          path = new File(outputPath);
        }

        return ImageResizer.saveImage(resizedImage, path,
                Long.toString(new Date().getTime()), compressFormat, quality);
    }
}
