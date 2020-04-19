/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {Component} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import CameraRoll from '@react-native-community/cameraroll';
import ImageResizer from 'react-native-image-resizer';

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#F5FCFF',
  },
  container: {
    paddingVertical: 100,
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  pickerView: {
    backgroundColor: 'white',
    padding: 5,
    width: '50%',
    borderColor: 'gray',
    borderWidth: 1 ,
  },
});

const modeOptions = ['contain', 'cover', 'stretch'].map(
  mode => ({ label: mode, value: mode })
);

const onlyScaleDownOptions = [false, true].map(
  onlyScaleDown => ({ label: onlyScaleDown.toString(), value: onlyScaleDown })
);

const targetSizeOptions = [
  { label: '80x80', value: 80 },
  { label: '5000x5000', value: 5000 },
];

export default class ResizerExample extends Component {
  constructor() {
    super();

    this.state = {
      mode: 'contain',
      onlyScaleDown: false,

      image: null,

      resizeTargetSize: 80,
      resizedImage: null,
    };
  }

  async componentDidMount() {
    if (Platform.OS === 'android') {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      await PermissionsAndroid.request(permission);
    }

    CameraRoll.getPhotos({first: 1})
      .then(photos => {
        if (!photos.edges || photos.edges.length === 0) {
          return Alert.alert(
            'Unable to load camera roll',
            'Check that you authorized the access to the camera roll photos and that there is at least one photo in it',
          );
        }

        this.setState({
          image: photos.edges[0].node.image,
        });
      })
      .catch(() => {
        return Alert.alert(
          'Unable to load camera roll',
          'Check that you authorized the access to the camera roll photos',
        );
      });
  }

  resize = () => {
    const { mode, onlyScaleDown, resizeTargetSize } = this.state;

    this.setState({ resizedImage: null });

    ImageResizer.createResizedImage(this.state.image.uri, resizeTargetSize, resizeTargetSize, 'JPEG', 100, 0, undefined, false, { mode, onlyScaleDown })
      .then(resizedImage => {
        this.setState({ resizedImage });
      })
      .catch(err => {
        console.log(err);
        return Alert.alert(
          'Unable to resize the photo',
          'Check the console for full the error message',
        );
      });
  }

  render() {
    const { resizedImage } = this.state;

    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <Text style={styles.welcome}>Image Resizer example</Text>
        <Text style={styles.instructions}>This is the original image:</Text>
        {this.state.image ? (
          <Image style={styles.image} source={{uri: this.state.image.uri}} resizeMode="contain" />
        ) : null}
        <Text style={styles.instructions}>Resized image:</Text>

        <View style={styles.row}>
          <Text>Mode: </Text>

          <RNPickerSelect
            value={this.state.mode}
            onValueChange={(mode) => this.setState({ mode })}
            items={modeOptions}
            style={{ viewContainer: styles.pickerView }}
          />
        </View>

        <View style={styles.row}>
          <Text>Only scale down? </Text>

          <RNPickerSelect
            value={this.state.onlyScaleDown}
            onValueChange={(onlyScaleDown) => this.setState({ onlyScaleDown })}
            items={onlyScaleDownOptions}
            style={{ viewContainer: styles.pickerView }}
          />
        </View>

        <View style={styles.row}>
          <Text>Target size: </Text>

          <RNPickerSelect
            value={this.state.resizeTargetSize}
            onValueChange={(resizeTargetSize) => this.setState({ resizeTargetSize })}
            items={targetSizeOptions}
            style={{ viewContainer: styles.pickerView }}
          />
        </View>

        <TouchableOpacity onPress={this.resize}>
          <Text style={styles.resizeButton}>Click me to resize the image</Text>
        </TouchableOpacity>

        {resizedImage ? (
          <>
            <Image
              style={styles.image}
              source={{uri: resizedImage.uri}}
              resizeMode="contain"
            />
            <Text>Width: {resizedImage.width}</Text>
            <Text>Height: {resizedImage.height}</Text>
          </>
        ) : null}
      </ScrollView>
    );
  }
}
