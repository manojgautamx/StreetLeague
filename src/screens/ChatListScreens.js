import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAxios from '../utils/useAxios'; // Replace with your custom hook

const ChatListScreen = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxios(); // Authenticated Axios instance
  const navigation = useNavigation();

  useEffect(() => {
    fetchJoinedLeagues();
  }, []);

  const fetchJoinedLeagues = async () => {
    try {
      const res = await axios.get('/api/joined-leagues/');
      setLeagues(res.data);
    } catch (err) {
      console.error('Failed to fetch joined leagues:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderLeague = ({ item }) => (
    <TouchableOpacity
      style={styles.leagueItem}
      onPress={() => navigation.navigate('Chat', { leagueId: item.id })}
    >
      <Text style={styles.leagueName}>{item.name}</Text>
      <Text style={styles.leagueDetails}>
        {item.sport} • {item.location}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (leagues.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>You haven't joined any leagues yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={leagues}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLeague}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  list: {
    padding: 16,
  },
  leagueItem: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
  },
  leagueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  leagueDetails: {
    fontSize: 14,
    color: '#aaa',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#ccc',
  },
});

export default ChatListScreen;
