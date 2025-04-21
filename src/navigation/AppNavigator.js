import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateLeagueScreen from '../screens/CreateLeagueScreen';
import JoinedScreen from '../screens/JoinedScreen';
import StartScreen from '../screens/StartScreen';
import LoadingScreen from '../screens/LoadingScreen';

const Stack = createNativeStackNavigator(); // ✅ This defines "Stack"

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreateLeague" component={CreateLeagueScreen} />
      <Stack.Screen name="Joined" component={JoinedScreen} />
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="Loading" component={LoadingScreen} />
    </Stack.Navigator>
  );
}
