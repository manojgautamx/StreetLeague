import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateLeagueScreen from '../screens/CreateLeagueScreen';
<<<<<<< HEAD
import JoinedScreen from '../screens/JoinedScreen';
import StartScreen from '../screens/StartScreen';
import LoadingScreen from '../screens/LoadingScreen';
=======
import MapPickerScreen from '../screens/MapPickerScreen';
import LeagueDescriptionScreen from '../screens/LeagueDescriptionScreen';
import Search from '../screens/Search';
import NotificationScreen from '../screens/NotificationsScreen';
>>>>>>> main


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E81F89" />
      </View>
    );
  }

  return (
<<<<<<< HEAD
    <Stack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreateLeague" component={CreateLeagueScreen} />
      <Stack.Screen name="Joined" component={JoinedScreen} />
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="Loading" component={LoadingScreen} />
=======
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CreateLeague" component={CreateLeagueScreen} />
          <Stack.Screen name="MapPicker" component={MapPickerScreen} />
          <Stack.Screen name="LeagueDescription" component={LeagueDescriptionScreen} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Notifications" component={NotificationScreen} />


        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
>>>>>>> main
    </Stack.Navigator>
  );
}

// export default function AppNavigator() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = await AsyncStorage.getItem('accessToken');
//       setIsLoggedIn(!!token);
//       setIsLoading(false);
//     };
//     checkAuth();
//   }, []);

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#E81F89" />
//       </View>
//     );
//   }

//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {isLoggedIn ? (
//         <>
//           <Stack.Screen name="Home" component={HomeScreen} />
//           <Stack.Screen name="CreateLeague" component={CreateLeagueScreen} />
//           <Stack.Screen name="MapPicker" component={MapPickerScreen} />
//         </>
//       ) : (
//         <>
//           <Stack.Screen name="Login" component={LoginScreen} />
//           <Stack.Screen name="Signup" component={SignupScreen} />
//         </>
//       )}
//     </Stack.Navigator>
//   );
// }
