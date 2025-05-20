import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import useAxios from '../utils/useAxios';
import { AuthContext } from '../context/AuthContext';
import TopNavBar from '../components/TopNavBar';
import BottomNavbar from '../components/BottomNavbar';

import IndoorImg from '../assets/indoor.png';
import OutdoorImg from '../assets/outdoor.png';
import EsportImg from '../assets/esport.png';
import DefaultImg from '../assets/default.png';

const HomeScreen = () => {
  const [tab, setTab] = useState('Nearby');
  const [activeTab, setActiveTab] = useState('Home');
  const [myLeagues, setMyLeagues] = useState([]);
  const [otherLeagues, setOtherLeagues] = useState([]);
  const [joinedLeagues, setJoinedLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterSport, setFilterSport] = useState(null);
  const [sortOption, setSortOption] = useState(null);

  const navigation = useNavigation();
  const axios = useAxios();
  const { logout } = useContext(AuthContext);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      const [myResponse, joinedResponse, publicResponse] = await Promise.all([
        axios.get('/api/my-leagues/'),
        axios.get('/api/joined-leagues/'),
        axios.get('/api/public-leagues/'),
      ]);

      const myLeaguesData = myResponse.data;
      const joinedLeaguesData = joinedResponse.data;

      const myLeagueIds = new Set(myLeaguesData.map((league) => league.id));
      const filteredJoinedLeagues = joinedLeaguesData.filter(
        (league) => !myLeagueIds.has(league.id)
      );
      const joinedLeagueIds = new Set(filteredJoinedLeagues.map((league) => league.id));

      const filteredOtherLeagues = publicResponse.data.filter(
        (league) => !myLeagueIds.has(league.id) && !joinedLeagueIds.has(league.id)
      );

      setMyLeagues(myLeaguesData);
      setJoinedLeagues(filteredJoinedLeagues);
      setOtherLeagues(filteredOtherLeagues);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch leagues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchLeagues);
    return unsubscribe;
  }, [navigation]);

 const handleFilterPress = () => {
  const sports = ['all', 'football', 'cricket', 'basketball', 'badminton', 'esports']; // 'all' moved first
  Alert.alert('Filter by Sport', 'Choose a sport type', [
    ...sports.map((sport) => ({
      text: sport === 'all' ? 'All' : sport,
      onPress: () => setFilterSport(sport === 'all' ? null : sport),
    })),
    { text: 'Cancel', style: 'cancel' },
  ]);
};

  const handleSortPress = () => {
  Alert.alert('Sort by', 'Choose sort order', [
    { text: 'All', onPress: () => setSortOption(null) },        // <-- Changed here
    { text: 'Name (A-Z)', onPress: () => setSortOption('name') },
    { text: 'Date (Earliest)', onPress: () => setSortOption('date') },
    { text: 'Cancel', style: 'cancel' },
  ]);
};

  const applyFilterAndSort = (leagues) => {
    let result = [...leagues];

    if (filterSport) {
      result = result.filter(
        (league) => league.sport?.toLowerCase() === filterSport.toLowerCase()
      );
    }

    if (sortOption === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'date') {
      result.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
    }

    return result;
  };

  const getLeagueImageBySport = (sport) => {
    const sportLower = sport?.toLowerCase();
    if (!sportLower) return DefaultImg;

    const OUTDOOR_SPORTS = ['football', 'cricket'];
    const INDOOR_SPORTS = ['basketball', 'badminton'];
    const ESPORTS = ['esports'];

    if (OUTDOOR_SPORTS.includes(sportLower)) return OutdoorImg;
    if (INDOOR_SPORTS.includes(sportLower)) return IndoorImg;
    if (ESPORTS.includes(sportLower)) return EsportImg;
    return DefaultImg;
  };


  const renderLeagueCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('LeagueDescription', { league: item })}
      style={styles.card}
    >
      <Image source={getLeagueImageBySport(item.sport)} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDetail}>
          <Ionicons name="football-outline" size={14} color="#ccc" /> {item.sport}  
          <Ionicons name="people-outline" size={14} color="#ccc" /> {item.max_players}  
          <Ionicons name="location-outline" size={14} color="#ccc" /> {item.location}
        </Text>
        <Text style={styles.cardDetail}>
          <Ionicons name="calendar-outline" size={14} color="#ccc" /> {item.date_time} {item.league_type}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E81F89" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchLeagues} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <TopNavBar onLogout={logout} />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateLeague')}
          style={styles.createLeagueBtn}
        >
          <Text style={styles.createLeagueText}>Create your league</Text>
          <Ionicons name="chevron-forward" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setTab('Nearby')}>
            <Text style={[styles.tab, tab === 'Nearby' && styles.activeTab]}>Nearby</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('Joined')}>
            <Text style={[styles.tab, tab === 'Joined' && styles.activeTab]}>Joined Leagues</Text>
          </TouchableOpacity>
        </View>
        

        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterOption} onPress={handleFilterPress}>
            <Ionicons name="filter" size={18} color="#fff" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterOption} onPress={handleSortPress}>
            <Text style={styles.filterText}>Sort by</Text>
            <Ionicons name="chevron-down" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {tab === 'Nearby' ? (
          applyFilterAndSort(otherLeagues).length === 0 ? (
            <Text style={styles.emptyText}>No nearby leagues found.</Text>
          ) : (
            <FlatList
              data={applyFilterAndSort(otherLeagues)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderLeagueCard}
              scrollEnabled={false}
            />
          )
        ) : (
          <View>
            <Text style={styles.sectionTitle}>Joined Leagues</Text>
            {applyFilterAndSort(joinedLeagues).length === 0 ? (
              <Text style={styles.emptyText}>You haven’t joined any leagues yet.</Text>
            ) : (
              <FlatList
                data={applyFilterAndSort(joinedLeagues)}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderLeagueCard}
                scrollEnabled={false}
              />
            )}
            <Text style={styles.sectionTitle}>My Leagues</Text>
            {applyFilterAndSort(myLeagues).length === 0 ? (
              <Text style={styles.emptyText}>You haven’t created any leagues yet.</Text>
            ) : (
              <FlatList
                data={applyFilterAndSort(myLeagues)}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderLeagueCard}
                scrollEnabled={false}
              />
            )}
          </View>
        )}
      </ScrollView>
      <BottomNavbar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#000',
  },
  createLeagueBtn: {
    backgroundColor: '#1c1c1e',
    borderColor: '#fff',
    borderWidth: 1,
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  createLeagueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tab: {
    fontSize: 16,
    color: '#aaa',
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    paddingBottom: 6,
  },
  activeTab: {
    color: '#E81F89',
    borderBottomColor: '#E81F89',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterText: {
    color: '#fff',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    padding: 12,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDetail: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 2,
  },
  sectionTitle: {
    color: '#E81F89',
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 12,
  },
  emptyText: {
    color: '#777',
    fontSize: 14,
    fontStyle: 'italic',
    marginVertical: 10,
  },
  centered: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#E81F89',
    fontSize: 16,
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#E81F89',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default HomeScreen;
