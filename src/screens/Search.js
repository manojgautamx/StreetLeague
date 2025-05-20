import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAxios from '../utils/useAxios';
import { useNavigation } from '@react-navigation/native';
import BottomNavbar from '../components/BottomNavBar';

import IndoorImg from '../assets/indoor.png';
import OutdoorImg from '../assets/outdoor.png';
import EsportImg from '../assets/esport.png';
import DefaultImg from '../assets/default.png';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const axios = useAxios();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Search');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 0) {
        handleSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearch = async (inputQuery) => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`/api/search-leagues/?search=${encodeURIComponent(inputQuery)}`);
      setResults(res.data);
    } catch (err) {
      console.error('Search error:', err);
      setError('Something went wrong while searching.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  const getLeagueImageBySport = (sport) => {
    const sportLower = sport?.toLowerCase();
    if (!sportLower) return DefaultImg;

const OUTDOOR_SPORTS = [
  'football', 'soccer', 'futsal', 'cricket', 'volleyball', 'tennis',
  'hockey', 'rugby', 'golf', 'cycling', 'baseball', 'kabaddi', 'archery',
  'swimming', 'athletics', 'track and field', 'rowing', 'canoeing',
  'mountain biking', 'triathlon', 'softball'
];

const INDOOR_SPORTS = [
  'badminton', 'table tennis', 'basketball', 'boxing', 'karate',
  'judo', 'taekwondo', 'wrestling', 'gymnastics', 'handball', 'squash',
  'weightlifting', 'fencing', 'chess', 'snooker', 'billiards',
  'mma', 'muay thai', 'kickboxing'
];

const ESPORTS = [
  'valorant', 'dota 2', 'pubg', 'fifa', 'esports', 'counter-strike',
  'league of legends', 'fortnite', 'apex legends', 'call of duty',
  'overwatch', 'rocket league', 'rainbow six siege', 'hearthstone',
  'starcraft ii', 'mobile legends', 'free fire', 'wild rift',
  'arena of valor', 'nba 2k', 'super smash bros', 'street fighter', 'tekken'
];

    if (OUTDOOR_SPORTS.includes(sportLower)) return OutdoorImg;
    if (INDOOR_SPORTS.includes(sportLower)) return IndoorImg;
    if (ESPORTS.includes(sportLower)) return EsportImg;

    return DefaultImg;
  };

  const renderLeagueCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('LeagueDescription', { league: item })}
    >
      <Image source={getLeagueImageBySport(item.sport)} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDetail}>
          <Ionicons name="football-outline" size={14} color="#ccc" /> {item.sport}{' '}
          <Ionicons name="people-outline" size={14} color="#ccc" /> {item.max_players}{' '}
          <Ionicons name="location-outline" size={14} color="#ccc" /> {item.location}
        </Text>
        <Text style={styles.cardDetail}>
          <Ionicons name="calendar-outline" size={14} color="#ccc" /> {item.date_time} {item.league_type}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#aaa" />
          <TextInput
            style={styles.input}
            placeholder="Search leagues..."
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.trim().length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={24} color="#E81F89" />
            </TouchableOpacity>
          )}
        </View>

        {loading && <ActivityIndicator size="large" color="#E81F89" style={{ marginTop: 20 }} />}

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : results.length === 0 && query.trim().length >= 3 && !loading ? (
          <Text style={styles.emptyText}>No leagues found for "{query}"</Text>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderLeagueCard}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 140 }}
          />
        )}
      </KeyboardAvoidingView>

      <BottomNavbar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  searchBox: {
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
  emptyText: {
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDetail: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 2,
  },
});

export default SearchScreen;
