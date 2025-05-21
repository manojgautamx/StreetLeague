import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axiosInstance from '../utils/axiosInstance';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BASE_URL = 'http://10.0.2.2:8000';

export default function ProfileViewScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchProfile = async () => {
        try {
          setLoading(true);
          const res = await axiosInstance.get('profile/');
          if (isActive) setProfile(res.data);
        } catch (err) {
          console.error('Error fetching profile:', err);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchProfile();
      return () => { isActive = false; };
    }, [])
  );

  const getAvatarUri = () => {
    if (!profile?.avatar) return null;
    return profile.avatar.startsWith('http')
      ? profile.avatar
      : `${BASE_URL}${profile.avatar}`;
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#E81F89" /></View>;
  }

  if (!profile) {
    return <View style={styles.centered}><Text>Could not load profile.</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        {getAvatarUri() ? (
          <Image source={{ uri: getAvatarUri() }} style={styles.avatar} />
        ) : (
          <Image source={require('../assets/profile.png')} style={styles.avatar} />
        )}
      </View>

      {/* Edit Button */}
      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('ProfileEdit', { profile })}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Details Section */}
      <View style={styles.section}>
        <Text style={styles.name}>{profile.full_name || 'No Name'}</Text>
        <Text style={styles.label}>Username: <Text style={styles.value}>{profile.username}</Text></Text>
        <Text style={styles.label}>Age: <Text style={styles.value}>{profile.age}</Text></Text>
        <Text style={styles.label}>Gender: <Text style={styles.value}>{profile.gender}</Text></Text>
        <Text style={styles.label}>Birth Date: <Text style={styles.value}>{profile.birth_date}</Text></Text>

        <Text style={styles.sectionTitle}>Content</Text>
        <Text style={styles.subLabel}>Favourite Sports</Text>
        <View style={styles.tags}>
          {profile.favorite_sports.length > 0 ? (
            profile.favorite_sports.map((sport) => (
              <Text key={sport} style={styles.tag}>{sport}</Text>
            ))
          ) : (
            <Text style={styles.value}>None</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>History</Text>
        <Text style={styles.label}>Leagues Created: <Text style={styles.value}>{profile.leagues_created}</Text></Text>
        <Text style={styles.label}>Leagues Joined: <Text style={styles.value}>{profile.leagues_joined}</Text></Text>
      </View>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: '#E81F89',
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 12,
    position: 'relative',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 45,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginTop: -40,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#222',
  },
  editButton: {
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#E81F89',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
  },
  subLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
    marginTop: 4,
  },
  value: {
    color: '#E81F89',
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#E81F89',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
});
