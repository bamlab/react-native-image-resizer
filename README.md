# React Native Image Resizer

> **⚠ Warning**
> Since version 3.0.0 this library has been moved from `react-native-image-resizer` to `@bam.tech/react-native-image-resizer`

## Setup

### React Native >= 0.61

Since the version version `3.0.0` this package support the new architecture out of the box (Turbo Module).
It also has retrocompatibility with the old one.

```
yarn add @bam.tech/react-native-image-resizer
cd ios && pod install
```

### React Native <= 0.60

```
yarn add react-native-image-resizer@1.1.0
cd ios && pod install
```

### Android

Note: on latest versions of React Native, you may have an error during the Gradle build on Android (`com.android.dex.DexException: Multiple dex files define Landroid/support/v7/appcompat/R$anim`). Run `cd android && ./gradlew clean` to fix this.

#### Manual linking

Manual link information for Android: [Link](docs/android_manual_config.md)

## Usage example

```javascript
import ImageResizer from '@bam.tech/react-native-image-resizer';

ImageResizer.createResizedImage(
  path,
  maxWidth,
  maxHeight,
  compressFormat,
  quality,
  rotation,
  outputPath
)
  .then((response) => {
    // response.uri is the URI of the new image that can now be displayed, uploaded...
    // response.path is the path of the new image
    // response.name is the name of the new image with the extension
    // response.size is the size of the new image
  })
  .catch((err) => {
    // Oops, something went wrong. Check that the filename is correct and
    // inspect err to get more details.
  });
```

### Sample app

A basic, sample app is available in [the `example` folder](https://github.com/bamlab/react-native-image-resizer/tree/master/example). It uses the module to resize a photo from the Camera Roll.

## API

```javascript
createResizedImage(
  /**
   * uri parameter accepts`path` or `uri`.
   * This property has been tested with the output of @bam.tech/react-native-image-picker,
   * react-native-vision-camera, @react-native-camera-roll/camera-roll and http link
   **/
  uri,
  maxWidth,
  maxHeight,
  compressFormat,
  quality,
  (rotation = 0),
  outputPath,
  (keepMeta = false),
  (options = {})
); // Returns a Promise
```

The promise resolves with an object containing: `path`, `uri`, `name`, `size` (bytes), `width` (pixels), and `height` of the new file. The URI can be used directly as the `source` of an [`<Image>`](https://facebook.github.io/react-native/docs/image.html) component.

| Option                | Description                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| path                  | Path of image file, or a base64 encoded image string prefixed with 'data:image/imagetype' where `imagetype` is jpeg or png.                                                                                                                                                                                                                                                                                  |
| width                 | Width to resize to (see `mode` for more details)                                                                                                                                                                                                                                                                                                                                                             |
| height                | Height to resize to (see `mode` for more details)                                                                                                                                                                                                                                                                                                                                                            |
| compressFormat        | Can be either JPEG, PNG or WEBP (android only).                                                                                                                                                                                                                                                                                                                                                              |
| quality               | A number between 0 and 100. Used for the JPEG compression.                                                                                                                                                                                                                                                                                                                                                   |
| rotation              | Rotation to apply to the image, in degrees, for android. On iOS, rotation is limited (and rounded) to multiples of 90 degrees.                                                                                                                                                                                                                                                                               |
| outputPath            | The resized image path. If null, resized image will be stored in cache folder. To set outputPath make sure to add option for rotation too (if no rotation is needed, just set it to 0).                                                                                                                                                                                                                      |
| keepMeta              | If `true`, will attempt to preserve all file metadata/exif info, except the orientation value since the resizing also does rotation correction to the original image. Defaults to `false`, which means all metadata is lost. Note: This can only be `true` for `JPEG` images which are loaded from the file system (not Web).                                                                                |
| options.mode          | Similar to [react-native Image's resizeMode](https://reactnative.dev/docs/image#resizemode): either `contain` (the default), `cover`, or `stretch`. `contain` will fit the image within `width` and `height`, preserving its ratio. `cover` preserves the aspect ratio, and makes sure the image is at least `width` wide or `height` tall. `stretch` will resize the image to exactly `width` and `height`. |
| options.onlyScaleDown | If `true`, will never enlarge the image, and will only make it smaller.                                                                                                                                                                                                                                                                                                                                      |

# Limitations

- If you are using `@react-native-camera-roll/camera-roll` **with new architecture enabled this library is not going to work**. If you try to display an image with the `uri` of the library using `<Image />` you are going to have the following error: `No suitable image URL loader found for ph://...`. This error come from the ReactNative `ImageLoader`, which is the one we are currently using. Help/PR for solving this are welcome. Until then, we recommend using `react-native-image-picker`.
- Image EXIF orientation are correctly handled on Android only, But not yet on IOS [#402](https://github.com/bamlab/react-native-image-resizer/issues/402).

## 👉 About Bam

We are a 100 people company developing and designing multiplatform applications with [React Native](https://www.bam.tech/agence-react-native-paris) using the Lean & Agile methodology. To get more information on the solutions that would suit your needs, feel free to get in touch by [email](mailto://contact@bam.tech) or through or [contact form](https://www.bam.tech/en/contact)!

We will always answer you with pleasure 😁
