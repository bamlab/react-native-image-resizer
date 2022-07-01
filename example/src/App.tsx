import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { multiply, addition } from 'react-native-image-resizer';

const multiplyResult = multiply(3, 7);
const additionResult = addition(2, 3);

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Result multiply: {multiplyResult}</Text>
      <Text>Result addition: {additionResult}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
