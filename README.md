# React Native Image Resizer

A React Native module that can create scaled versions of local images (also supports the assets library on iOS).

## Setup

Install the package:

* 😻 React Native >= 0.40
```
npm install --save react-native-image-resizer
react-native link react-native-image-resizer
```

* 👨 React Native >= 0.29.2 and < 0.40
```
npm install --save react-native-image-resizer@0.0.12
react-native link react-native-image-resizer
```

* 👴 React Native >= 0.28 and < 0.29.2
```
npm install rnpm -g
rnpm install react-native-image-resizer@0.0.12
```

### Android

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

The promise resolves with a string containing the URI of the new file. This URI can be used directly as the `source` of an [`<Image>`](https://facebook.github.io/react-native/docs/image.html) component.

> :warning: On Android, `file:` will be prepended to the returned string. This allows it to be displayed as an image, but it also means you [won't be able to access the file directly](https://github.com/bamlab/react-native-image-resizer/issues/50) when using a utility like `fs`. To do so, you can simply use `rawPath = originalPath.replace('file:', '')` to get the raw path.

Option | Description
------ | -----------
path | Path of image file, or a base64 encoded image string prefixed with 'data:image/imagetype' where `imagetype` is jpeg or png.
maxWidth | Image max width (ratio is preserved)
maxHeight | Image max height (ratio is preserved)
compressFormat | Can be either JPEG, PNG or WEBP (android only).
quality | A number between 0 and 100. Used for the JPEG compression.
rotation | Rotation to apply to the image, in degrees, for android. On iOS, rotation is limited (and rounded) to multiples of 90 degrees.
outputPath | The resized image path. If null, resized image will be stored in cache folder. To set outputPath make sure to add option for rotation too (if no rotation is needed, just set it to 0).

## Other open-source modules by the folks at [BAM](http://github.com/bamlab)

 * [rn-camera-roll](https://github.com/bamlab/rn-camera-roll)
 * [react-native-numberpicker-dialog](https://github.com/bamlab/react-native-numberpicker-dialog)
 * [react-native-animated-picker](https://github.com/bamlab/react-native-animated-picker)
 * [cordova-plugin-native-routing](https://github.com/bamlab/cordova-plugin-native-routing)
