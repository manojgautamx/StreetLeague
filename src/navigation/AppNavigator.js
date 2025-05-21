import React, { useContext, useEffect, useState, createContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { AuthContext } from '../context/AuthContext';

// Auth
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';

// Core
import HomeScreen from '../screens/HomeScreen';
import CreateLeagueScreen from '../screens/CreateLeagueScreen';
import MapPickerScreen from '../screens/MapPickerScreen';
import LeagueDescriptionScreen from '../screens/LeagueDescriptionScreen';

// Profile
import ProfileScreen from '../screens/ProfileScreen';
import ProfileViewScreen from '../screens/ProfileViewScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';

// Extras from kanin
import Search from '../screens/Search';
import NotificationScreen from '../screens/NotificationsScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatListScreens from '../screens/ChatListScreens';

// Context
export const ProfileStatusContext = createContext();

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { userToken, isLoading } = useContext(AuthContext);
  const [profileComplete, setProfileComplete] = useState(null);

  const checkProfileStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      const response = await axios.get('http://10.0.2.2:8000/api/profile/status/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfileComplete(response.data.profile_complete);
    } catch (err) {
      console.error('Failed to check profile status:', err.message);
      setProfileComplete(false);
    }
  };

  useEffect(() => {
    if (userToken) {
      checkProfileStatus();
    }
  }, [userToken]);

  if (isLoading || (userToken && profileComplete === null)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E81F89" />
      </View>
    );
  }

  return (
    <ProfileStatusContext.Provider value={{ refreshProfileStatus: checkProfileStatus }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken ? (
          profileComplete ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="CreateLeague" component={CreateLeagueScreen} />
              <Stack.Screen name="MapPicker" component={MapPickerScreen} />
              <Stack.Screen name="LeagueDescription" component={LeagueDescriptionScreen} />
              <Stack.Screen name="Search" component={Search} />
              <Stack.Screen name="Notifications" component={NotificationScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="ChatListScreens" component={ChatListScreens} />
              <Stack.Screen name="ProfileView" component={ProfileViewScreen} />
              <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
            </>
          ) : (
            <Stack.Screen name="Profile" component={ProfileScreen} />
          )
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </ProfileStatusContext.Provider>
  );
}