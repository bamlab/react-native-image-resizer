import React from 'react-native';

const ImageResizerAndroid = React.NativeModules.ImageResizerAndroid;

export default {
  createResizedImage: (imagePath, outputPath, newWidth, newHeight, compressFormat, quality, rotation = 0) => {
    return new Promise((resolve, reject) => {
      ImageResizerAndroid.createResizedImage(imagePath, outputPath, newWidth, newHeight,
        compressFormat, quality, rotation, resolve, reject);
    });
  },
};
