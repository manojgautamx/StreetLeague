import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const BottomNavbar = ({ activeTab, onTabPress }) => {
  const navigation = useNavigation();

  const tabs = [
    { name: 'Home', icon: 'home' },
    { name: 'Search', icon: 'search' },
    { name: 'Chat', icon: 'chatbubble-ellipses-outline' },
    { name: 'Notifications', icon: 'notifications-outline' },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          onPress={() => {
            onTabPress(tab.name);
            navigation.navigate(tab.name);
          }}
        >
          <Ionicons
            name={tab.icon}
            size={24}
            color={activeTab === tab.name ? '#E81F89' : '#fff'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingVertical: 12,
    borderTopColor: '#222',
    borderTopWidth: 1,
  },
});

export default BottomNavbar;
