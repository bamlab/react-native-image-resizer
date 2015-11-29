package fr.bamlab.rnimageresizer;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
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
        return ThumbnailUtils.extractThumbnail(
                BitmapFactory.decodeFile(imagePath),
                newWidth,
                newHeight
        );
    }

    private static String saveImage(Bitmap bitmap, File saveDirectory, String fileName,
                                    Bitmap.CompressFormat compressFormat, int quality)
            throws IOException {

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
                                            int quality) throws IOException {
        Bitmap resizedImage = ImageResizer.resizeImage(imagePath, newWidth, newHeight);
        return ImageResizer.saveImage(resizedImage, context.getCacheDir(),
                Long.toString(new Date().getTime()), compressFormat, quality);
    }
}
