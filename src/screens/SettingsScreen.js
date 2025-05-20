// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [language, setLanguage] = useState('English'); // Placeholder

  const openPrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Open your privacy policy URL or screen here.');
  };

  const openTermsOfService = () => {
    Alert.alert('Terms of Service', 'Open your terms of service URL or screen here.');
  };

  const changeLanguage = () => {
    Alert.alert('Change Language', 'Language selection feature coming soon.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cross/Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeText}>✖️</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Settings</Text>

      <View style={styles.option}>
        <Text style={styles.optionText}>Enable Notifications</Text>
        <Switch
          trackColor={{ false: '#555', true: '#E81F89' }}
          thumbColor={notificationsEnabled ? '#fff' : '#999'}
          onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
          value={notificationsEnabled}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.optionText}>Dark Mode</Text>
        <Switch
          trackColor={{ false: '#555', true: '#E81F89' }}
          thumbColor={darkModeEnabled ? '#fff' : '#999'}
          onValueChange={() => setDarkModeEnabled(!darkModeEnabled)}
          value={darkModeEnabled}
        />
      </View>

      <TouchableOpacity style={styles.option} onPress={changeLanguage}>
        <View>
          <Text style={styles.optionText}>Language</Text>
          <Text style={styles.subText}>{language}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={openPrivacyPolicy}>
        <Text style={styles.optionText}>Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={openTermsOfService}>
        <Text style={styles.optionText}>Terms of Service</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#121212',
    flexGrow: 1,
    paddingTop: 48,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  closeText: {
    fontSize: 22,
    color: '#E81F89',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E81F89',
    marginBottom: 24,
  },
  option: {
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#DDD',
  },
  subText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});
