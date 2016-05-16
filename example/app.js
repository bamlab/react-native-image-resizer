/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  CameraRoll,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity
} from 'react-native';
import Spinner from 'react-native-gifted-spinner';
import ImageResizer from 'react-native-image-resizer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
  }
});

export default class ResizerExample extends Component {
  constructor() {
    super();

    this.state = {
      resizedImageUri: '',
      loading: true,
    };
  }

  componentDidMount() {
    CameraRoll.getPhotos({first: 1}).then((photos) => {
      if (!photos.edges || photos.edges.length === 0) {
        return Alert.alert('Unable to load camera roll',
          'Check that you authorized the access to the camera roll photos and that there is at least one photo in it');
      }

      this.setState({
        image: photos.edges[0].node.image,
      })
    }).catch(() => {
      return Alert.alert('Unable to load camera roll',
        'Check that you authorized the access to the camera roll photos');
    });
  }

  resize() {
    ImageResizer.createResizedImage(this.state.image.uri, 800, 600, 'JPEG', 80)
    .then((resizedImageUri) => {
      this.setState({
        resizedImageUri,
      });
    }).catch((err) => {
      console.log(err);
      return Alert.alert('Unable to resize the photo',
        'Check the console for full the error message');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Image Resizer example
        </Text>
        <Text style={styles.instructions}>
          This is the original image:
        </Text>
        {
          this.state.image ?
            <Image style={styles.image} source={{uri: this.state.image.uri}} /> :
            <Spinner />
        }
        <Text style={styles.instructions}>
          Resized image:
        </Text>
        <TouchableOpacity onPress={() => this.resize()}>
          <Text style={styles.resizeButton}>
            Click me to resize the image
          </Text>
        </TouchableOpacity>
        {
          this.state.resizedImageUri ?
          <Image style={styles.image} source={{uri: this.state.resizedImageUri}} /> : null
        }
      </View>
    );
  }
}
