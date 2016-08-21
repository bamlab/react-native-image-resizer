package fr.bamlab.rnimageresizer;

import android.content.Context;
import android.content.ContentResolver;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.BitmapRegionDecoder;
import android.graphics.Matrix;
import android.media.ExifInterface;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Pair;

import java.io.Closeable;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.IOException;
import java.util.Date;

/**
 * Created by almouro on 11/19/15.
 */
class ImageResizer {

    private static Bitmap resizeImage(Bitmap image, int maxWidth, int maxHeight) {
        Bitmap newImage = null;
        if (image == null) {
            return null; // Can't load the image from the given path.
        }

        if (maxHeight > 0 && maxWidth > 0) {
            float width = image.getWidth();
            float height = image.getHeight();

            float ratio = Math.min((float)maxWidth / width, (float)maxHeight / height);

            int finalWidth = (int) (width * ratio);
            int finalHeight = (int) (height * ratio);
            newImage = Bitmap.createScaledBitmap(image, finalWidth, finalHeight, true);
        }

        return newImage;
    }

    public static Bitmap rotateImage(Bitmap source, float angle)
    {
        Bitmap retVal;

        Matrix matrix = new Matrix();
        matrix.postRotate(angle);
        retVal = Bitmap.createBitmap(source, 0, 0, source.getWidth(), source.getHeight(), matrix, true);
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

    /**
     * Get {@link File} object for the given Android URI.<br>
     * Use content resolver to get real path if direct path doesn't return valid file.
     */
    private static File getFileFromUri(Context context, Uri uri) {

        // first try by direct path
        File file = new File(uri.getPath());
        if (file.exists()) {
            return file;
        }

        // try reading real path from content resolver (gallery images)
        Cursor cursor = null;
        try {
            String[] proj = {MediaStore.Images.Media.DATA};
            cursor = context.getContentResolver().query(uri, proj, null, null, null);
            int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
            cursor.moveToFirst();
            String realPath = cursor.getString(column_index);
            file = new File(realPath);
        } catch (Exception ignored) {
        } finally {
            if (cursor != null) {
                cursor.close();
            }
        }

        return file;
    }


    /**
     * Get orientation by reading Image metadata
     */
    public static int getOrientation(Context context, Uri uri) {
        try {
            File file = getFileFromUri(context, uri);
            if (file.exists()) {
                ExifInterface ei = new ExifInterface(file.getAbsolutePath());
                return getOrientation(ei);
            }
        } catch (Exception ignored) { }

        return 0;
    }

    /**
     * Convert metadata to degrees
     */
    public static int getOrientation(ExifInterface exif) {
        int orientation = exif.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);
        switch (orientation) {
            case ExifInterface.ORIENTATION_ROTATE_90:
                return 90;
            case ExifInterface.ORIENTATION_ROTATE_180:
                return 180;
            case ExifInterface.ORIENTATION_ROTATE_270:
                return 270;
            default:
                return 0;
        }
    }

    public static String createResizedImage(Context context, String imagePath, int newWidth,
                                            int newHeight, Bitmap.CompressFormat compressFormat,
                                            int quality, int rotation, String outputPath) throws IOException  {
        Bitmap sourceImage;
        if (!imagePath.startsWith("content://") && !imagePath.startsWith("file://")) {
            sourceImage = BitmapFactory.decodeFile(imagePath);
        } else {
            ContentResolver cr = context.getContentResolver();
            Uri url = Uri.parse(imagePath);
            InputStream input = cr.openInputStream(url);
            sourceImage = BitmapFactory.decodeStream(input);
            input.close();
        }

        // Start transformations:

        // Scale it first so there are fewer pixels to transform in the rotation
        Bitmap scaledImage = ImageResizer.resizeImage(sourceImage, newWidth, newHeight);
        if (sourceImage != scaledImage) {
            sourceImage.recycle();
        }

        // Rotate if necessary
        Bitmap rotatedImage = scaledImage;
        if (rotation > 0) {
            int orientation = getOrientation(context, Uri.parse(imagePath));
            rotation = orientation + rotation;
            rotatedImage = ImageResizer.rotateImage(scaledImage, rotation);
        }

        if (scaledImage != rotatedImage) {
            scaledImage.recycle();
        }

        // Save the resulting image
        File path = context.getCacheDir();
        if (outputPath != null) {
            path = new File(outputPath);
        }

        String resizedImagePath = ImageResizer.saveImage(rotatedImage, path,
                Long.toString(new Date().getTime()), compressFormat, quality);

        // Clean up remaining image
        rotatedImage.recycle();

        return resizedImagePath;
    }
}
