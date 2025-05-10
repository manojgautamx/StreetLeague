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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import useAxios from '../utils/useAxios';
import { AuthContext } from '../context/AuthContext';

// Import images
import IndoorImg from '../assets/indoor.png';
import OutdoorImg from '../assets/outdoor.png';
import EsportImg from '../assets/E-sport.png';
import DefaultImg from '../assets/default.png'; // You can add this fallback if needed

const HomeScreen = () => {
  const [tab, setTab] = useState('Nearby');
  const [myLeagues, setMyLeagues] = useState([]);
  const [otherLeagues, setOtherLeagues] = useState([]);
  const [joinedLeagues, setJoinedLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const axios = useAxios();
  const { logout } = useContext(AuthContext);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      const [myResponse, otherResponse, joinedResponse] = await Promise.all([
        axios.get('/api/my-leagues/'),
        axios.get('/api/public-leagues/'),
        axios.get('/api/joined-leagues/'),
      ]);
      setMyLeagues(myResponse.data);
      setOtherLeagues(otherResponse.data);
      setJoinedLeagues(joinedResponse.data);
    } catch (err) {
      console.error('Error fetching leagues:', err);
      setError(err.response?.data?.detail || 'Failed to fetch leagues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchLeagues);
    return unsubscribe;
  }, [navigation]);

  // 🟢 Image logic based on sport
  const getLeagueImageBySport = (sport) => {
    const sportLower = sport?.toLowerCase();
    if (!sportLower) return DefaultImg;

    if (['football', 'cricket', 'rugby'].includes(sportLower)) {
      return OutdoorImg;
    } else if (['badminton', 'table tennis', 'basketball'].includes(sportLower)) {
      return IndoorImg;
    } else if (['e-sports', 'esports', 'valorant', 'csgo', 'fifa'].includes(sportLower)) {
      return EsportImg;
    }
    return DefaultImg;
  };

  const renderLeagueCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('LeagueDescription', { league: item })}
      style={styles.card}
    >
      <Image
        source={getLeagueImageBySport(item.sport)}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDetail}>
          <Ionicons name="football-outline" size={14} color="#ccc" /> {item.sport}    
          <Ionicons name="people-outline" size={14} color="#ccc" /> {item.max_players}    
          <Ionicons name="location-outline" size={14} color="#ccc" /> {item.location}
        </Text>
        <Text style={styles.cardDetail}>
          <Ionicons name="calendar-outline" size={14} color="#ccc" /> {item.date_time}    
          {item.league_type}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const isNearby = tab === 'Nearby';

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
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color="#fff" />
        </TouchableOpacity>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <TouchableOpacity>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateLeague')}
          style={styles.createLeagueBtn}
        >
          <Text style={styles.createLeagueText}>Create your league</Text>
          <Ionicons name="chevron-forward" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setTab('Nearby')}>
            <Text style={[styles.tab, tab === 'Nearby' && styles.activeTab]}>Nearby</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('Joined')}>
            <Text style={[styles.tab, tab === 'Joined' && styles.activeTab]}>Joined Leagues</Text>
          </TouchableOpacity>
        </View>

        {/* Filter and Sort */}
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterOption}>
            <Ionicons name="filter" size={18} color="#fff" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterOption}>
            <Text style={styles.filterText}>Sort by</Text>
            <Ionicons name="chevron-down" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* League Cards */}
        {isNearby ? (
          otherLeagues.length === 0 ? (
            <Text style={styles.emptyText}>No nearby leagues found.</Text>
          ) : (
            <FlatList
              data={otherLeagues}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderLeagueCard}
              scrollEnabled={false}
            />
          )
        ) : (
          <View>
            <Text style={styles.sectionTitle}>Joined Leagues</Text>
            {joinedLeagues.length === 0 ? (
              <Text style={styles.emptyText}>You haven’t joined any leagues yet.</Text>
            ) : (
              <FlatList
                data={joinedLeagues}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderLeagueCard}
                scrollEnabled={false}
              />
            )}

            <Text style={styles.sectionTitle}>My Leagues</Text>
            {myLeagues.length === 0 ? (
              <Text style={styles.emptyText}>You haven’t created any leagues yet.</Text>
            ) : (
              <FlatList
                data={myLeagues}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderLeagueCard}
                scrollEnabled={false}
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Icon Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home" size={24} color="#E81F89" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
  },
  logo: {
    width: 36,
    height: 36,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
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
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#E81F89',
    padding: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingVertical: 12,
    borderTopColor: '#222',
    borderTopWidth: 1,
  },
});

export default HomeScreen;