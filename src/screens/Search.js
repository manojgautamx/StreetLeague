import React, { useState } from 'react';
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

import BottomNavbar from '../components/BottomNavbar';

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

  const getLeagueImageBySport = (sport) => {
    const sportLower = sport?.toLowerCase();
    if (!sportLower) return DefaultImg;

    const OUTDOOR_SPORTS = ['futsal', 'football', 'cricket', 'volleyball', 'tennis',
    'hockey', 'baseball', 'rugby', 'kabaddi', 'swimming',
    'athletics', 'golf', 'cycling', 'archery', 'shooting'
  ];
    const INDOOR_SPORTS = ['basketball', 'badminton', 'table tennis', 'handball',
    'chess', 'boxing', 'mma', 'wrestling', 'gymnastics',
    'weightlifting', 'judo', 'karate', 'taekwondo', 'fencing'
  ];

    const ESPORTS = ['counter-strike', 'dota 2', 'league of legends', 'valorant',
    'fortnite', 'pubg', 'apex legends', 'call of duty',
    'rainbow six siege', 'rocket league', 'overwatch',
    'hearthstone', 'fifa', 'nba 2k', 'starcraft ii',
    'super smash bros', 'street fighter', 'tekken',
    'mobile legends', 'free fire', 'wild rift', 'arena of valor',
    'e-sports', 'esports'
  ];

    if (OUTDOOR_SPORTS.includes(sportLower)) return OutdoorImg;
    if (INDOOR_SPORTS.includes(sportLower)) return IndoorImg;
    if (ESPORTS.includes(sportLower)) return EsportImg;

    return DefaultImg;
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`/api/search-leagues/?search=${encodeURIComponent(query)}`);

      setResults(res.data);
    } catch (err) {
      console.error('Search error:', err);
      setError('Something went wrong during search.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
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
          <Ionicons name="calendar-outline" size={14} color="#ccc" /> {item.date_time}{' '}
          {item.league_type}
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
            onSubmitEditing={handleSearch}
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
        ) : results.length === 0 && query.trim() !== '' && !loading ? (
          <Text style={styles.emptyText}>No leagues found for "{query}"</Text>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderLeagueCard}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 140 }} // <- important fix here
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
