# React Native Image Resizer

A React Native module that can create scaled versions of local images (also supports the assets library on iOS).

## Setup

Install the package:

* 😻 React Native >= 0.40
```
npm install --save react-native-image-resizer
react-native link react-native-image-resizer
```

> ⚠️ **Heads up, breaking change!** If you're upgrading *react-native-image-resizer* to version 1.0.0, please note that the response of `createResizedImage` changed. You must now read the image uri from property `uri` of the returned object. [Here is an example](https://github.com/bamlab/react-native-image-resizer/commit/15ea06d7651faf316b946170427efa90ea48dc4e). Easy, huh?

## Older versions:

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

ImageResizer.createResizedImage(imageUri, newWidth, newHeight, compressFormat, quality, rotation, outputPath).then((response) => {
  // response.uri is the URI of the new image that can now be displayed, uploaded...
  // response.path is the path of the new image
  // response.name is the name of the new image with the extension
  // response.size is the size of the new image
}).catch((err) => {
  // Oops, something went wrong. Check that the filename is correct and
  // inspect err to get more details.
});
```

### Sample app

A basic, sample app is available in [the `example` folder](https://github.com/bamlab/react-native-image-resizer/tree/master/example). It uses the module to resize a photo from the Camera Roll.

## API

### `promise createResizedImage(path, maxWidth, maxHeight, compressFormat, quality, rotation = 0, outputPath)`

The promise resolves with an object containing: `path`, `uri`, `name` and `size` of the new file. The URI can be used directly as the `source` of an [`<Image>`](https://facebook.github.io/react-native/docs/image.html) component.

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
