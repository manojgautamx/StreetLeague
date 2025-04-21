import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function StartScreen({ navigation }) {
  const handleGetStarted = () => {
    navigation.navigate('Signup');
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/Street.png')} style={styles.logo} />
      </View>

      {/* Tagline */}
      <View style={styles.taglineContainer}>
        <Text style={styles.tagline}>Where streets,{'\n'}become arenas.</Text>
      </View>

      {/* Get Started Button */}
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Get started</Text>
          <View style={{ flex: 1 }} />
          <Ionicons name="arrow-forward" size={20} color="white" />
        </View>
      </TouchableOpacity>

      {/* Sign In Link */}
      <View style={styles.signInRow}>
        <Text style={styles.signInText}>Already a user?</Text>
        <TouchableOpacity onPress={handleSignIn}>
          <Text style={styles.signInButton}> SIGN IN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
    marginLeft: 25,
  },
  logo: {
    width: 180,
    height: 50,
    resizeMode: 'contain',
  },
  taglineContainer: {
    alignItems: 'flex-start',
    marginLeft: 25,
    marginBottom: 80,
  },
  tagline: {
    color: 'white',
    fontSize: 26,
    fontWeight: '600',
  },
  button: {
    alignSelf: 'center',
    width: '85%',
    backgroundColor: '#FF1D9D',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signInText: {
    color: '#ccc',
    fontSize: 16,
  },
  signInButton: {
    color: '#E81F89',
    fontSize: 16,
    fontWeight: 'normal', // Not bold
  },
});
