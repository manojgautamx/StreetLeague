<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React, { useEffect, useState, useContext } from 'react';
>>>>>>> main
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
import BottomNavbar from '../components/BottomNavbar';

<<<<<<< HEAD
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2;

const LeagueCard = () => (
  <View style={styles.card}>
    <Image
      source={require('../assets/futsal.png')}
      style={styles.cardImage}
      resizeMode="cover"
    />
    <Text style={styles.title}>Futsal Play</Text>

    <View style={styles.row}>
      <View style={styles.iconRow}>
        <Ionicons name="football-outline" size={12} color="gray" />
        <Text style={styles.infoText}>Futsal</Text>
      </View>
      <Text style={styles.infoText}>1/22</Text>
      <View style={styles.iconRow}>
        <Ionicons name="location-outline" size={12} color="gray" />
        <Text style={styles.infoText}>4 km</Text>
      </View>
    </View>

    <View style={styles.row}>
      <View style={styles.iconRow}>
        <Ionicons name="calendar-outline" size={12} color="gray" />
        <Text style={styles.infoText}>13 Feb, 2025, 8:00 PM</Text>
      </View>
      <View style={styles.iconRow}>
        <Ionicons name="star-outline" size={12} color="gray" />
        <Text style={styles.infoText}>Pro</Text>
      </View>
    </View>
  </View>
);

const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Nearby');

  const handleCardPress = () => {
    navigation.navigate('LeagueDetails');
  };

  const handleCreateLeague = () => {
    navigation.navigate('CreateLeague');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log('Menu clicked')}>
          <Icon name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Image source={require('../assets/image.png')} style={styles.logo} />
        <TouchableOpacity style={styles.profilePlaceholder} />
      </View>

      {/* Create League Button */}
      <TouchableOpacity style={styles.createLeague} onPress={handleCreateLeague}>
        <Text style={styles.createLeagueText}>Create your league</Text>
        <Icon name="chevron-right" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab('Nearby')}>
          <Text style={[styles.tabText, activeTab === 'Nearby' && styles.activeTab]}>
            Nearby
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Joined')}>
          <Text style={[styles.tabText, activeTab === 'Joined' && styles.activeTab]}>
            Joined Leagues
            </Text>
            </TouchableOpacity>

      </View>

      {/* Filter & Sort */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterOption}>
          <Icon name="filter-list" size={20} color="#fff" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterOption}>
          <Icon name="sort" size={20} color="#fff" />
          <Text style={styles.filterText}>Sort by</Text>
        </TouchableOpacity>
      </View>

      {/* League Cards */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cardGrid}>
          {activeTab === 'Nearby'
            ? [...Array(6)].map((_, idx) => (
                <TouchableOpacity key={idx} onPress={handleCardPress}>
                  <LeagueCard />
                </TouchableOpacity>
              ))
            : (
              <Text style={{ color: 'gray', marginTop: 20 }}>
                You haven't joined any leagues yet.
              </Text>
            )}
=======
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

 const getLeagueImageBySport = (sport) => {
  const sportLower = sport?.toLowerCase();
  if (!sportLower) return DefaultImg;

  const OUTDOOR_SPORTS = [
    'futsal', 'football', 'cricket', 'volleyball', 'tennis',
    'hockey', 'baseball', 'rugby', 'kabaddi', 'swimming',
    'athletics', 'golf', 'cycling', 'archery', 'shooting'
  ];

  const INDOOR_SPORTS = [
    'basketball', 'badminton', 'table tennis', 'handball',
    'chess', 'boxing', 'mma', 'wrestling', 'gymnastics',
    'weightlifting', 'judo', 'karate', 'taekwondo', 'fencing'
  ];

  const ESPORTS = [
    'counter-strike', 'dota 2', 'league of legends', 'valorant',
    'fortnite', 'pubg', 'apex legends', 'call of duty',
    'rainbow six siege', 'rocket league', 'overwatch',
    'hearthstone', 'fifa', 'nba 2k', 'starcraft ii',
    'super smash bros', 'street fighter', 'tekken',
    'mobile legends', 'free fire', 'wild rift', 'arena of valor',
    'e-sports', 'esports'
  ];

  const inList = (list) => list.includes(sportLower);

  if (inList(OUTDOOR_SPORTS)) return OutdoorImg;
  if (inList(INDOOR_SPORTS)) return IndoorImg;
  if (inList(ESPORTS)) return EsportImg;

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
      {/* Top Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color="#fff" />
        </TouchableOpacity>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <TouchableOpacity>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Create League */}
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
>>>>>>> main
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

        {/* League Lists */}
        {tab === 'Nearby' ? (
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

<<<<<<< HEAD
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={24} color="#e91e63" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubble-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

=======
      {/* Bottom Navbar */}
      <BottomNavbar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
};

>>>>>>> main
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
<<<<<<< HEAD
  createLeagueText: { color: '#fff', fontSize: 16 },

  // Tabs
  tabs: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  tabText: {
    color: 'gray',
    marginRight: 24,
    fontSize: 14,
  },
  activeTab: {
    color: '#e91e63',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#e91e63',
    paddingBottom: 4,
  },

  // Filter Row
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 24,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    color: 'gray',
    fontSize: 12,
    marginLeft: 6,
  },

  // Cards
  cardGrid: {
=======
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
>>>>>>> main
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
<<<<<<< HEAD
  title: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 6 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    alignItems: 'center',
  },
  infoText: { color: 'gray', fontSize: 11 },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#121212',
  },
});
=======
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
});

export default HomeScreen;
>>>>>>> main
