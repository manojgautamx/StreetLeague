import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAxios from '../utils/useAxios';

import IndoorImg from '../assets/indoor.png';
import OutdoorImg from '../assets/outdoor.png';
import EsportImg from '../assets/esport.png';
import DefaultImg from '../assets/default.png';

const OUTDOOR_SPORTS = [
  'futsal', 'football', 'cricket', 'volleyball', 'tennis', 'hockey', 'baseball', 'rugby',
  'kabaddi', 'swimming', 'athletics', 'golf', 'cycling', 'archery', 'shooting'
];
const INDOOR_SPORTS = [
  'basketball', 'badminton', 'table tennis', 'handball', 'chess', 'boxing', 'mma',
  'wrestling', 'gymnastics', 'weightlifting', 'judo', 'karate', 'taekwondo', 'fencing'
];
const ESPORTS = [
  'counter-strike', 'dota 2', 'league of legends', 'valorant', 'fortnite', 'pubg',
  'apex legends', 'call of duty', 'rainbow six siege', 'rocket league', 'overwatch',
  'hearthstone', 'fifa', 'nba 2k', 'starcraft ii', 'super smash bros', 'street fighter',
  'tekken', 'mobile legends', 'free fire', 'wild rift', 'arena of valor', 'e-sports', 'esports'
];

const getSportImage = (sportName) => {
  const name = sportName?.toLowerCase();

  if (OUTDOOR_SPORTS.includes(name)) return OutdoorImg;
  if (INDOOR_SPORTS.includes(name)) return IndoorImg;
  if (ESPORTS.includes(name)) return EsportImg;

  return DefaultImg;
};

const ChatListScreen = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const axios = useAxios();
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

  const filteredLeagues = leagues.filter(league =>
    league.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderLeague = ({ item }) => (
    <TouchableOpacity
      style={styles.leagueItem}
      onPress={() => navigation.navigate('Chat', { leagueId: item.id })}
    >
      <Image
        source={item.avatar ? { uri: item.avatar } : getSportImage(item.sport)}
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.leagueName}>{item.name.toUpperCase()}</Text>
        <Text style={styles.leagueDetails}>{item.sport || 'No sport info'}</Text>
      </View>
      <Text style={styles.timestamp}>Sent 3m ago</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#E81F89" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="arrow-back" size={28} color="#E81F89" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>

      <TextInput
        placeholder="Search"
        placeholderTextColor="#555"
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {filteredLeagues.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>You haven't joined any leagues yet.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredLeagues}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLeague}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
  },
  headerTitle: {
    color: '#E81F89',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  searchInput: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#fff',
    marginBottom: 14,
    fontSize: 16,
  },
  leagueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#E81F89',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  leagueName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  leagueDetails: {
    color: '#aaa',
    fontSize: 13,
  },
  timestamp: {
    color: '#777',
    fontSize: 12,
    marginLeft: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});

export default ChatListScreen;
