import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BottomNavbar = () => {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.barItem}>
        <Ionicons name="home" size={24} color="#E81F89" />
        <Text style={styles.barLabel}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.barItem}>
        <Ionicons name="search" size={24} color="#fff" />
        <Text style={styles.barLabel}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.barItem}>
        <Ionicons name="notifications-outline" size={24} color="#fff" />
        <Text style={styles.barLabel}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.barItem}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
        <Text style={styles.barLabel}>Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1C1C1E',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
  },
  barItem: {
    alignItems: 'center',
  },
  barLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
});

export default BottomNavbar;