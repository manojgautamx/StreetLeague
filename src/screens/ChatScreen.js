import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Image, Alert, Keyboard
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../utils/axiosInstance';
import { db } from '../utils/firebase';
import BottomNavBar from '../components/BottomNavBar';

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { leagueId, leagueName, currentUserId } = route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const unsubscribe = db
      .collection(`league_${leagueId}_chat`)
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const chatMessages = snapshot.docs.map(doc => doc.data());
        setMessages(chatMessages);
      });

    return () => unsubscribe();
  }, [leagueId]);

  const sendMessage = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    try {
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
      console.error('Error sending message:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to send message.');
    }
  };

  const renderItem = ({ item }) => {
    const isMyMessage =
      item.user_id === currentUserId ||
      (!item.user_id && item.sender?.toLowerCase() === currentUserId?.toLowerCase());

    const avatar = item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.sender || 'User')}`;
    const timestamp = item.timestamp ? new Date(item.timestamp) : new Date();
    const messageTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={[styles.messageRow, isMyMessage ? styles.alignEnd : styles.alignStart]}>
        {!isMyMessage && (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        )}
        <View style={[styles.messageBubble, isMyMessage ? styles.myMessage : styles.otherMessage]}>
          {!isMyMessage && <Text style={styles.sender}>{item.sender}</Text>}
          <Text style={styles.content}>{item.content}</Text>
          <Text style={styles.timestamp}>{messageTime}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{leagueName}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Message list */}
      <FlatList
        data={messages}
        inverted
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.messageList}
      />

      {/* Input */}
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

      <BottomNavBar activeTab="Chat" onTabPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  messageList: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 5,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  alignStart: { justifyContent: 'flex-start' },
  alignEnd: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 6,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  myMessage: {
    backgroundColor: '#E81F89',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#1a1a1a',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    alignSelf: 'flex-start',
  },
  sender: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: 2,
  },
  content: {
    fontSize: 16,
    color: '#fff',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  input: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#fff',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#333',
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: '#E81F89',
    padding: 12,
    borderRadius: 100,
  },
});

export default ChatScreen;
