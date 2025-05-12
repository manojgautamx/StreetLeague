import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomNavbar from '../components/BottomNavbar';

const notifications = [
  {
    id: '1',
    message: 'You have joined Futsal Play!',
    time: '5 mins ago',
  },
  {
    id: '2',
    message: 'Reminder: Futsal game at 8 PM today.',
    time: '2 hours ago',
  },
  {
    id: '3',
    message: 'League "Futsal Friday" is now full.',
    time: 'Yesterday',
  },
];

const NotificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
   const [activeTab, setActiveTab] = useState('Notifications');
  

  // Example payload
  const { from, extraNote } = route.params || {};

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Ionicons name="notifications-outline" size={24} color="#E81F89" />
      <View style={styles.textContainer}>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 24 }} /> {/* Spacing placeholder */}
      </View>

      {/* Payload Info (Optional) */}
      {from || extraNote ? (
        <View style={styles.payloadContainer}>
          {from && <Text style={styles.payloadText}>From: {from}</Text>}
          {extraNote && <Text style={styles.payloadText}>Note: {extraNote}</Text>}
        </View>
      ) : null}

      {/* Notification List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
     <BottomNavbar activeTab={activeTab} onTabPress={setActiveTab} /> 
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1C1C1E',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  message: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 4,
  },
  time: {
    color: '#888',
    fontSize: 12,
  },
  payloadContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1C1C1E',
  },
  payloadText: {
    color: '#FF2D95',
    fontSize: 14,
    marginBottom: 4,
  },
});

export default NotificationScreen;
