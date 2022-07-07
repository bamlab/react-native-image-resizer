/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { createdResizedImage } from 'react-native-image-resizer';
import { Picker } from '@react-native-picker/picker';
import type { ResizeMode } from 'src/types';
import { Asset, launchImageLibrary } from 'react-native-image-picker';

interface Response {
  path: string;
  uri: string;
  size: number;
  name: string;
  width: number;
  height: number;
}

const modeOptions = ['contain', 'cover', 'stretch'].map((mode) => ({
  label: mode,
  value: mode,
}));

const onlyScaleDownOptions = [false, true].map((onlyScaleDown) => ({
  label: onlyScaleDown.toString(),
  value: onlyScaleDown,
}));

const targetSizeOptions = [
  { label: '80x80', value: 80 },
  { label: '5000x5000', value: 5000 },
];

const App = () => {
  const [mode, setMode] = useState<ResizeMode>('contain');
  const [onlyScaleDown, setOnlyScaleDown] = useState(false);
  const [image, setImage] = useState<null | Asset>();
  const [sizeTarget, setSizeTarget] = useState(5000);
  const [resizedImage, setResizedImage] = useState<null | Response>();

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const resize = async () => {
    if (!image || !image.uri) return;

    setResizedImage(null);

    const start = new Date().getTime();

    try {
      let result;
      for (let index = 0; index < 30; index++) {
        const startLoop = new Date().getTime();
        result = await createdResizedImage(
          image.uri,
          sizeTarget,
          sizeTarget,
          'JPEG',
          100,
          0,
          undefined,
          false,
          {
            mode,
            onlyScaleDown,
          }
        );
        const endLoop = new Date().getTime();
        console.log(`Call ${index} finished : ${endLoop - startLoop} ms`);
      }

      const end = new Date().getTime();
      const totalSeconds = (end - start) / 1000;
      console.warn('Number of seconds = ', totalSeconds);

      setResizedImage(result);
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Unable to resize the photo',
        'Check the console for full the error message'
      );
    }
  };

  useEffect(() => {
    const chechPermission = async () => {
      let isAllowedToAccessPhotosOnAndroid = false;
      if (Platform.OS === 'android') {
        isAllowedToAccessPhotosOnAndroid = await hasAndroidPermission();
      }
      if (Platform.OS === 'ios' || isAllowedToAccessPhotosOnAndroid) {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
          if (!response || !response.assets) return;
          const asset = response.assets[0];
          if (asset) {
            console.log('URI = ', asset.uri);
            setImage(asset);
          }
        });
      }
    };

    chechPermission();
  }, []);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.welcome}>Image Resizer example</Text>
      <Text style={styles.instructions}>This is the original image:</Text>
      {image ? (
        <Image
          style={styles.image}
          source={{ uri: image.uri }}
          resizeMode="contain"
        />
      ) : null}
      <Text style={styles.instructions}>Resized image:</Text>
      <View style={styles.row}>
        <Text>Mode: </Text>

        {/* <Picker
          selectedValue={mode}
          onValueChange={(mode) => setMode(mode)}
          style={{ alignSelf: 'stretch' }}
        >
          {modeOptions.map((option) => (
            <Picker.Item
              label={option.label}
              value={option.value}
              key={option.value}
            />
          ))}
        </Picker> */}
      </View>
      <View style={styles.row}>
        <Text>Only scale down? </Text>

        {/* <Picker
          selectedValue={onlyScaleDown}
          onValueChange={(onlyScaleDown) => setOnlyScaleDown(onlyScaleDown)}
        >
          {onlyScaleDownOptions.map((option) => (
            <Picker.Item
              label={option.label}
              value={option.value}
              key={option.label}
            />
          ))}
        </Picker> */}
      </View>
      <View style={styles.row}>
        <Text>Target size: </Text>

        {/* <Picker
          selectedValue={sizeTarget}
          onValueChange={(resizeTargetSize) => setSizeTarget(resizeTargetSize)}
        >
          {targetSizeOptions.map((option) => (
            <Picker.Item
              label={option.label}
              value={option.value}
              key={option.value}
            />
          ))}
        </Picker> */}
      </View>
      <TouchableOpacity onPress={resize}>
        <Text style={styles.resizeButton}>Click me to resize the image</Text>
      </TouchableOpacity>
      <ActivityIndicator size={20} />
      {resizedImage ? (
        <>
          <Image
            style={styles.image}
            source={{ uri: resizedImage.uri }}
            resizeMode="contain"
          />
          <Text>Width: {resizedImage.width}</Text>
          <Text>Height: {resizedImage.height}</Text>
        </>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#F5FCFF',
  },
  container: {
    paddingVertical: 100,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  image: {
    width: 250,
    height: 250,
  },
  resizeButton: {
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  row: {
    marginBottom: 5,
  },
  pickerView: {
    backgroundColor: 'white',
    padding: 5,
    width: '50%',
    borderColor: 'gray',
    borderWidth: 1,
  },
});

export default App;
