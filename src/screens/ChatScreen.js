import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Image, Alert, Keyboard, Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../utils/axiosInstance';
import { db } from '../utils/firebase';
import Navbar from '../components/Navbar';

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { leagueId, leagueName, currentUserId } = route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = db
      .collection(`league_${leagueId}_chat`)
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const chatMessages = snapshot.docs.map(doc => doc.data());
        setMessages(chatMessages);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [leagueId]);

  const sendMessage = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      await axiosInstance.post(`/chat/${leagueId}/`, {
        content: trimmed,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNewMessage('');
      Keyboard.dismiss();
    } catch (error) {
      console.error('❌ Error sending message:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const isMyMessage = item.user_id === currentUserId;
    const avatar = item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.sender)}`;
    const messageTime = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={[styles.messageRow, isMyMessage ? styles.alignEnd : styles.alignStart]}>
        {!isMyMessage && (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        )}
        <View style={[styles.messageBubble, isMyMessage ? styles.myMessage : styles.otherMessage]}>
          {!isMyMessage && (
            <Text style={styles.sender}>{item.sender}</Text>
          )}
          <Text style={styles.content}>{item.content}</Text>
          <Text style={styles.timestamp}>{messageTime}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar
        title={leagueName || 'League Chat'}
        leftButton={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#E81F89" />
          </TouchableOpacity>
        }
      />

      {/* FlatList for chat messages */}
      <FlatList
        data={messages}
        inverted
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.messageList}
      />

      {/* Message Input Section */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Message..."
          placeholderTextColor="#aaa"
          multiline
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={!newMessage.trim()}
          style={styles.sendBtn}
        >
          <Ionicons
            name="send"
            size={24}
            color={newMessage.trim() ? "#fff" : "#aaa"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 0, // Ensure no extra space at the top
    justifyContent: 'flex-end', // Make sure we align content from the bottom
  },
  messageList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 0, // No extra padding at the bottom
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  alignStart: {
    justifyContent: 'flex-start',
  },
  alignEnd: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 16,
  },
  myMessage: {
    backgroundColor: '#E81F89',
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
  },
  sender: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 2,
  },
  content: {
    fontSize: 16,
    color: '#222',
  },
  timestamp: {
    fontSize: 10,
    color: '#777',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#111',
    marginBottom: 0,  // Ensure no extra margin at the bottom
  },
  input: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#fff',
    maxHeight: 100,
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: '#E81F89',
    padding: 12,
    borderRadius: 100,
  },
});

export default ChatScreen;
