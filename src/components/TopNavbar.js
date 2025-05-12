import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const TopNavbar = ({ onMenuPress }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <Ionicons
        name="menu"
        size={28}
        color="#fff"
        onPress={onMenuPress}
      />
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image source={require('../assets/profile.png')} style={styles.profile} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 36,
    height: 36,
  },
  profile: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});

export default TopNavbar;