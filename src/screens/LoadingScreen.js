import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function LoadingScreen({ navigation }) {
  useEffect(() => {
    // wait 2 seconds then go to Start screen
    const timer = setTimeout(() => {
      navigation.replace('Start');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/iimage.png')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // or any background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200, // adjust size as needed
    height: 200,
    resizeMode: 'contain',
  },
});