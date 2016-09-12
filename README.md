# React Native Image Resizer

A React Native module that can create scaled versions of local images (also supports the assets library on iOS).

## Setup

Install the package with [rnpm](https://github.com/rnpm/rnpm):
```
npm install rnpm -g
rnpm install react-native-image-resizer
```

Note: on latest versions of React Native, you may have an error during the Gradle build on Android (`com.android.dex.DexException: Multiple dex files define Landroid/support/v7/appcompat/R$anim`). Run `cd android && ./gradlew clean` to fix this.

## Usage example

```javascript
import ImageResizer from 'react-native-image-resizer';

ImageResizer.createResizedImage(imageUri, newWidth, newHeight, compressFormat, quality, rotation, outputPath).then((resizedImageUri) => {
  // resizeImageUri is the URI of the new image that can now be displayed, uploaded...
}).catch((err) => {
  // Oops, something went wrong. Check that the filename is correct and
  // inspect err to get more details.
});
```

### Sample app

A basic, sample app is available in [the `example` folder](https://github.com/bamlab/react-native-image-resizer/tree/master/example). It uses the module to resize a photo from the Camera Roll.

## API

### `promise createResizedImage(path, maxWidth, maxHeight, compressFormat, quality, rotation = 0, outputPath)`

The promise resolves with a string containing the uri of the new file.

Option | Description
------ | -----------
path | Path of image
maxWidth | Image max width (ratio is preserved)
maxHeight | Image max height (ratio is preserved)
compressFormat | Can be either JPEG, PNG or WEBP (android only).
quality | A number between 0 and 100. Used for the JPEG compression.
rotation | Rotation to apply to the image, in degrees, for android only. On iOS, the resizing is done such that the orientation is always up.
outputPath | The resized image path. If null, resized image will be stored in cache folder. To set outputPath make sure to add option for rotation too (if no rotation is needed, just set it to 0).

## Other open-source modules by the folks at [BAM](http://github.com/bamlab)

 * [rn-camera-roll](https://github.com/bamlab/rn-camera-roll)
 * [react-native-numberpicker-dialog](https://github.com/bamlab/react-native-numberpicker-dialog)
 * [react-native-animated-picker](https://github.com/bamlab/react-native-animated-picker)
 * [cordova-plugin-native-routing](https://github.com/bamlab/cordova-plugin-native-routing)
