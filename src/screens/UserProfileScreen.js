import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Button,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';

const STORAGE_KEY = '@user_profile';

export default function UserProfileScreen() {
  const [user, setUser] = useState({
    username: '',
    avatar: '',
    age: null,
    bio: '',
    favoriteSports: '',
    gender: '',
    birthDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const storedProfile = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedProfile) {
        setUser(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      Alert.alert('Error', 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const saveUserProfile = async () => {
    setLoading(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      Alert.alert('Success', 'Profile updated!');
      setEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Error', 'Could not update profile.');
    } finally {
      setLoading(false);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split('T')[0];
      setUser(prev => ({ ...prev, birthDate: isoDate }));
    }
  };

  const pickAvatar = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        const asset = response.assets[0];
        setUser(prev => ({ ...prev, avatar: asset.uri }));
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E81F89" />
      </View>
    );
  }

  const birthDateValue = user.birthDate ? new Date(user.birthDate) : new Date();

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Image
        source={
          user.avatar ? { uri: user.avatar } : require('../assets/profile.png')
        }
        style={styles.avatar}
      />
      {editing && (
        <Button title="Change Avatar" onPress={pickAvatar} color="#E81F89" />
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Username:</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={user.username}
            onChangeText={text => setUser(prev => ({ ...prev, username: text }))}
            placeholder="Enter your username"
            editable={!loading}
            placeholderTextColor="#aaa"
          />
        ) : (
          <Text style={styles.username}>{user.username || 'No Username'}</Text>
        )}
      </View>

      <Text style={styles.infoText}>Age: {user.age ?? 'N/A'}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Bio:</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            multiline
            value={user.bio}
            onChangeText={text => setUser(prev => ({ ...prev, bio: text }))}
            editable={!loading}
            placeholder="Tell us about yourself"
            placeholderTextColor="#aaa"
          />
        ) : (
          <Text style={styles.value}>{user.bio || 'No bio provided.'}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Favorite Sports:</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={user.favoriteSports}
            onChangeText={text =>
              setUser(prev => ({ ...prev, favoriteSports: text }))
            }
            placeholder="e.g. Soccer, Basketball"
            editable={!loading}
            placeholderTextColor="#aaa"
          />
        ) : (
          <Text style={styles.value}>
            {user.favoriteSports || 'No favorite sports listed.'}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Gender:</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={user.gender}
            onChangeText={text => setUser(prev => ({ ...prev, gender: text }))}
            placeholder="Male, Female, Other"
            editable={!loading}
            placeholderTextColor="#aaa"
          />
        ) : (
          <Text style={styles.value}>{user.gender || 'Not specified'}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Birth Date:</Text>
        {editing ? (
          <>
            <Button
              title={user.birthDate ? user.birthDate : 'Select birth date'}
              onPress={() => setShowDatePicker(true)}
              disabled={loading}
              color="#E81F89"
            />
            {showDatePicker && (
              <DateTimePicker
                value={birthDateValue}
                mode="date"
                display="default"
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}
          </>
        ) : (
          <Text style={styles.value}>{user.birthDate || 'Not set'}</Text>
        )}
      </View>

      {editing ? (
        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button
              title="Save"
              onPress={saveUserProfile}
              color="#E81F89"
              disabled={loading}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="Cancel"
              onPress={() => setEditing(false)}
              color="#777"
              disabled={loading}
            />
          </View>
        </View>
      ) : (
        <Button
          title="Edit Profile"
          onPress={() => setEditing(true)}
          color="#E81F89"
          disabled={loading}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 50,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#E81F89',
    textAlign: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
  },
  section: {
    width: '100%',
    marginVertical: 10,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#E81F89',
  },
  input: {
    borderColor: '#E81F89',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#222',
    color: '#fff',
  },
  value: {
    fontSize: 16,
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});
