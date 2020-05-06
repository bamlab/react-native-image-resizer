import { NativeModules, Platform } from 'react-native';

const ImageResizerAndroid = NativeModules.ImageResizerAndroid;

let exportObject = {};

if (Platform.OS === 'android') {
  exportObject = {
    createResizedImage: (
      imagePath,
      newWidth,
      newHeight,
      compressFormat,
      quality,
      rotation = 0,
      outputPath,
      keepMeta = false
    ) => {
      return new Promise((resolve, reject) => {
        ImageResizerAndroid.createResizedImage(
          imagePath,
          newWidth,
          newHeight,
          compressFormat,
          quality,
          rotation,
          outputPath,
          keepMeta,
          resolve,
          reject
        );
      });
    },
  };
} else {
  exportObject = {
    createResizedImage: (path, width, height, format, quality, rotation = 0, outputPath, keepMeta = false) => {
      if (format !== 'JPEG' && format !== 'PNG') {
        throw new Error('Only JPEG and PNG format are supported by createResizedImage');
      }

      return new Promise((resolve, reject) => {
        NativeModules.ImageResizer.createResizedImage(
          path,
          width,
          height,
          format,
          quality,
          rotation,
          outputPath,
          keepMeta,
          (err, response) => {
            if (err) {
              return reject(err);
            }

            resolve(response);
          }
        );
      });
    },
  };
}

export default exportObject;
