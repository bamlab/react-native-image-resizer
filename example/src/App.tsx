/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useRef, useState } from 'react';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import type {
  ResizeMode,
  Response,
} from '@bam.tech/react-native-image-resizer';
import { launchImageLibrary } from 'react-native-image-picker';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

const modeOptions: { label: string; value: ResizeMode }[] = [
  {
    label: 'contain',
    value: 'contain',
  },
  {
    label: 'cover',
    value: 'cover',
  },
  {
    label: 'stretch',
    value: 'stretch',
  },
];

const onlyScaleDownOptions: { label: string; value: boolean }[] = [
  {
    label: 'true',
    value: true,
  },
  {
    label: 'false',
    value: false,
  },
];

async function hasCameraRollPermissions() {
  const getCheckPermissionPromise = () => {
    if (Platform.OS === 'ios') {
      return true;
    }

    if (Number(Platform.Version) >= 33) {
      return Promise.all([
        PermissionsAndroid.check('android.permission.READ_MEDIA_IMAGES'),
      ]).then(([hasReadMediaImagesPermission]) => hasReadMediaImagesPermission);
    } else {
      return PermissionsAndroid.check(
        'android.permission.READ_EXTERNAL_STORAGE'
      );
    }
  };

  const hasPermission = await getCheckPermissionPromise();
  if (hasPermission) {
    return true;
  }
  const getRequestPermissionPromise = () => {
    if (Number(Platform.Version) >= 33) {
      return PermissionsAndroid.requestMultiple([
        'android.permission.READ_MEDIA_IMAGES',
      ]).then(
        (statuses) =>
          statuses['android.permission.READ_MEDIA_IMAGES'] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      return PermissionsAndroid.request(
        'android.permission.READ_EXTERNAL_STORAGE'
      ).then((status) => status === PermissionsAndroid.RESULTS.GRANTED);
    }
  };

  return await getRequestPermissionPromise();
}

const App = () => {
  const [selectedMode, setMode] = useState<ResizeMode>('contain');
  const [onlyScaleDown, setOnlyScaleDown] = useState(false);
  const [imageUri, setImageUri] = useState<null | string>();
  const [sizeTarget, setSizeTarget] = useState(80);
  const [resizedImage, setResizedImage] = useState<null | Response>();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [inputImageUrl, setInputImageUrl] = useState('');
  const devices = useCameraDevices();
  const device = devices.back;
  const camera = useRef<Camera>(null);

  const resize = async () => {
    if (!imageUri) return;

    setResizedImage(null);

    try {
      let result = await ImageResizer.createResizedImage(
        imageUri,
        sizeTarget,
        sizeTarget,
        'JPEG',
        100,
        0,
        undefined,
        false,
        {
          mode: selectedMode,
          onlyScaleDown,
        }
      );

      setResizedImage(result);
    } catch (error) {
      Alert.alert('Unable to resize the photo');
    }
  };

  const selectImageFromPicker = async () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response || !response.assets) return;
      const asset = response.assets[0];
      if (asset) {
        setImageUri(asset.uri);
      }
    });
  };

  const selectFirstImageFromCameraRoll = async () => {
    const hasPermission = await hasCameraRollPermissions();
    if (!hasPermission) {
      Alert.prompt('No permission to access photo library');
      return;
    }

    const result = await CameraRoll.getPhotos({ first: 1 });
    if (result.edges.length === 0) {
      Alert.prompt('Can not load first image from camera roll');
    }

    setImageUri(result.edges[0]?.node.image.uri);
  };

  const hasCameraPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();

    switch (cameraPermission) {
      case 'authorized':
        return true;
      case 'not-determined':
      case 'denied':
        const newCameraPermission = await Camera.requestCameraPermission();
        return newCameraPermission === 'authorized';
      default:
        Alert.alert('Go in app settings to allow camera usage');
        return false;
    }
  };

  const openCamera = async () => {
    setIsCameraActive(await hasCameraPermission());
  };

  const takePhoto = async () => {
    if (camera.current === null) {
      return;
    }

    const photo = await camera.current.takePhoto();
    // Adding file:// is mandatory in Android in order to display the image properly with <Image>
    setImageUri((Platform.OS === 'android' ? 'file://' : '') + photo.path);
    closeCamera();
  };

  const loadImageFromUrl = () => setImageUri(inputImageUrl);

  const closeCamera = () => setIsCameraActive(false);

  if (isCameraActive && device !== undefined) {
    return (
      <View style={styles.cameraContainer}>
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isCameraActive}
          photo={true}
          preset="medium"
        />
        <View style={styles.cameraButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text>Capture</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cameraButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={closeCamera}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.welcome}>Image Resizer example</Text>
      <View style={styles.imageSourceButtonContainer}>
        <TouchableOpacity style={styles.button} onPress={selectImageFromPicker}>
          <Text>{'Select an image (react-native-image-picker)'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imageSourceButtonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={selectFirstImageFromCameraRoll}
        >
          <Text>
            {
              'Load first image of camera roll (@react-native-camera-roll/camera-roll)'
            }
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imageSourceButtonContainer}>
        <TouchableOpacity style={styles.button} onPress={openCamera}>
          <Text>Take a photo</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => setInputImageUrl(text)}
        placeholder="url"
        placeholderTextColor={'grey'}
      />
      <View style={styles.imageSourceButtonContainer}>
        <TouchableOpacity style={styles.button} onPress={loadImageFromUrl}>
          <Text>Load image from url</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.instructions}>This is the original image:</Text>
      {imageUri ? (
        <Image
          style={styles.image}
          source={{ uri: imageUri }}
          resizeMode="contain"
        />
      ) : null}

      <Text style={styles.instructions}>Resized image:</Text>
      <Text>Mode: </Text>
      <View style={styles.optionContainer}>
        {modeOptions.map((mode) => (
          <TouchableOpacity
            style={styles.buttonOption}
            onPress={() => setMode(mode.value)}
            key={mode.label}
          >
            <Text>{`${mode.label} ${
              selectedMode === mode.value ? '✅' : ''
            }`}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text>Only scale down? </Text>
      <View style={styles.optionContainer}>
        {onlyScaleDownOptions.map((scaleDownOption) => (
          <TouchableOpacity
            style={styles.buttonOption}
            onPress={() => setOnlyScaleDown(scaleDownOption.value)}
            key={scaleDownOption.label}
          >
            <Text>{`${scaleDownOption.label} ${
              onlyScaleDown === scaleDownOption.value ? '✅' : ''
            }`}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text>Target size: </Text>
      <TextInput
        style={styles.textInput}
        placeholder={sizeTarget.toString()}
        keyboardType="decimal-pad"
        onChangeText={(text) => {
          setSizeTarget(Number(text));
        }}
      />

      <TouchableOpacity style={styles.button} onPress={resize}>
        <Text>Click me to resize the image</Text>
      </TouchableOpacity>
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
    paddingHorizontal: 10,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageSourceButtonContainer: {
    marginBottom: 10,
  },
  welcome: {
    fontSize: 20,
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  image: {
    height: 250,
    marginBottom: 10,
  },
  resizeButton: {
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#2596be',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  optionContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  cameraButtonContainer: {
    marginBottom: 40,
    marginHorizontal: 20,
  },
  buttonOption: {
    backgroundColor: '#2596be',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  textInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 2,
    margin: 10,
    alignSelf: 'stretch',
    textAlign: 'center',
    overflow: 'hidden',
  },
});

export default App;
