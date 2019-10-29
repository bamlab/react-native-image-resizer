/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import ImageResizer from 'react-native-image-resizer';
import random from 'lodash/random';
import range from 'lodash/range';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 30,
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
    width: 200,
    height: 200,
  },
  resizeButton: {
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default class ResizerExample extends Component {
  constructor(p) {
    super(p);

    this.state = {
      resizedImageUri: null,
      loading: false,
      image: {uri: './assets/image1.png'},
    };
  }

  // componentDidMount() {
  //   CameraRoll.getPhotos({first: 1})
  //     .then(photos => {
  //       if (!photos.edges || photos.edges.length === 0) {
  //         return Alert.alert(
  //           'Unable to load camera roll',
  //           'Check that you authorized the access to the camera roll photos and that there is at least one photo in it',
  //         );
  //       }
  //
  //       this.setState({
  //         image: photos.edges[0].node.image,
  //       });
  //     })
  //     .catch(() => {
  //       return Alert.alert(
  //         'Unable to load camera roll',
  //         'Check that you authorized the access to the camera roll photos',
  //       );
  //     });
  // }

  resize(width = 80, height = 80, setLoadingState = true) {
    if (setLoadingState)
      this.setState({loading: true});

    ImageResizer.createResizedImage(this.state.image.uri, width, height, 'PNG', 100)
        .then(({uri}) => {

          return;

          this.setState(state => {

            return (setLoadingState) ? {
              ...state,
              resizedImageUri: uri,
              loading: false,
            } : {
              ...state,
              resizedImageUri: uri,
            }
          })
        })
        .catch(err => {
          console.log(err);
          if (setLoadingState)
            this.setState({loading: false});

          return Alert.alert(
              'Unable to resize the photo',
              'Check the console for full the error message',
          );
        });
  }

  massResize() {
    this.setState({loading: true});
    const sizes = range(300);
    console.log('Start massResize for ' + sizes.length + ' Items.');
    sizes.forEach(i => {
      console.log('massResize:i', i);
      const width = random(100, 2000);
      const height = random(100, 2000);

      this.resize(width, height, false);
    });

    this.setState({loading: false});
  }

  render() {
    console.log('render');
    return (
        <View style={styles.container}>
          <ScrollView>
          {this.state.loading ? <Text style={styles.welcome}>Is Loading...</Text> : null}
          <Text style={styles.welcome}>Image Resizer example</Text>
          <Text style={styles.instructions}>This is the original image:</Text>
          {this.state.image ? (
              <Image style={styles.image} source={{uri: this.state.image.uri}}/>
          ) : null}
          <Text style={styles.instructions}>Resized image:</Text>
          <TouchableOpacity onPress={() => this.resize()}>
            <Text style={styles.resizeButton}>Click me to resize the image</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.massResize()}>
            <Text style={styles.resizeButton}>Click me to mass resize the image</Text>
          </TouchableOpacity>
          {this.state.resizedImageUri ? (
              <Image
                  style={styles.image}
                  source={{uri: this.state.resizedImageUri}}
              />
          ) : null}
          </ScrollView>
        </View>
    );
  }
}
