import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const TopNavBar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  const menuItems = [
    { label: 'About', screen: 'About' },
    { label: 'Settings', screen: 'Settings' },
    { label: 'Privacy Policy', screen: 'PrivacyPolicy' },
    { label: 'Terms & Conditions', screen: 'TermsConditions' },
  ];

  const handleMenuItemPress = (item) => {
    setMenuVisible(false);
    if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuBtn}>
          <Ionicons name="menu" size={28} color="#E81F89" />
        </TouchableOpacity>

        <Text style={styles.title}>StreetLeague</Text>

        <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <Modal visible={menuVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setMenuVisible(false)}
            >
              <Ionicons name="close" size={28} color="#E81F89" />
            </TouchableOpacity>

            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item)}
              >
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.menuItem, styles.logoutBtn]}
              onPress={() => {
                logout();
                setMenuVisible(false);
              }}
            >
              <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E81F89',
  },
  menuBtn: {
    padding: 8,
  },
  title: {
    color: '#E81F89',
    fontSize: 22,
    fontWeight: 'bold',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    marginTop: 60,
    backgroundColor: '#111',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    elevation: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    zIndex: 20,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuItemText: {
    color: '#E81F89',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutBtn: {
    borderBottomWidth: 0,
    marginTop: 12,
  },
  logoutText: {
    color: 'red',
  },
});

export default TopNavBar;
