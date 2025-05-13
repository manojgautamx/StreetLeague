import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Image } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { getProfile, createProfile, updateProfile } from './api';

const ProfileScreen = ({ token }) => {
  const [bio, setBio] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [favoriteSports, setFavoriteSports] = useState('');
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    // Load existing profile if available
    getProfile(token)
      .then((data) => {
        setBio(data.bio);
        setBirthDate(data.birth_date);
        setFavoriteSports(data.favorite_sports);
        setGender(data.gender);
        setIsExisting(true);
      })
      .catch((err) => console.log('No profile found, creating new.'));
  }, []);

  const pickAvatar = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setAvatar(response.assets[0]);
      }
    });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('birth_date', birthDate);
    formData.append('favorite_sports', favoriteSports);
    formData.append('gender', gender);
    if (avatar) {
      formData.append('avatar', {
        uri: avatar.uri,
        name: avatar.fileName,
        type: avatar.type,
      });
    }

    try {
      if (isExisting) {
        await updateProfile(formData, token);
        alert('Profile updated!');
      } else {
        await createProfile(formData, token);
        alert('Profile created!');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  return (
    <View>
      <Text>Bio:</Text>
      <TextInput value={bio} onChangeText={setBio} />
      <Text>Birth Date (YYYY-MM-DD):</Text>
      <TextInput value={birthDate} onChangeText={setBirthDate} />
      <Text>Favorite Sports:</Text>
      <TextInput value={favoriteSports} onChangeText={setFavoriteSports} />
      <Text>Gender:</Text>
      <TextInput value={gender} onChangeText={setGender} />

      <Button title="Pick Avatar" onPress={pickAvatar} />
      {avatar && <Image source={{ uri: avatar.uri }} style={{ width: 100, height: 100 }} />}

      <Button title={isExisting ? 'Update Profile' : 'Create Profile'} onPress={handleSubmit} />
    </View>
  );
};

export default ProfileScreen;
