import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import useAxios from '../utils/useAxios';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = () => {
  const [myLeagues, setMyLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('joined');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigation = useNavigation();
  const axios = useAxios();
  const { logout } = useContext(AuthContext);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://10.0.2.2:8000/api/my-leagues/');
      setMyLeagues(response.data);
    } catch (err) {
      console.error('Error fetching leagues:', err);
      setError(err.response?.data?.detail || 'Failed to fetch leagues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  const handleLogout = () => {
    logout();
    setIsDrawerOpen(false);
  };

  const drawerOptions = [
    { label: 'About', onPress: () => alert('About screen coming soon!') },
    { label: 'Settings', onPress: () => alert('Settings screen coming soon!') },
    { label: 'Terms & Conditions', onPress: () => alert('Terms & Conditions...') },
    { label: 'Privacy Policy', onPress: () => alert('Privacy Policy...') },
    { label: 'Logout', onPress: handleLogout },
  ];

  const renderLeagueCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Description', { league: item })}
      style={styles.card}
    >
      <Image
        source={require('../assets/futsal.png')}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardTitleRow}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Ionicons name="information-circle-outline" size={20} color="#fff" />
      </View>

      <View style={styles.cardInfoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="football" size={16} color="#fff" />
          <Text style={styles.infoText}>{item.sport}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="person" size={16} color="#fff" />
          <Text style={styles.infoText}>
            {item.players_joined || 1}/{item.max_players}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="location-outline" size={16} color="#fff" />
          <Text style={styles.infoText}>4 km away</Text>
        </View>
      </View>

      <View style={styles.cardInfoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar" size={16} color="#fff" />
          <Text style={styles.infoText}>{item.date_time}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="people" size={16} color="#fff" />
          <Text style={styles.infoText}>{item.league_type}</Text>
        </View>
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
    <SafeAreaView style={styles.container}>
      <FlatList
        data={activeTab === 'joined' ? myLeagues : []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLeagueCard}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Ionicons name="menu" size={28} color="#fff" onPress={() => setIsDrawerOpen(true)} />
              <Image source={require('../assets/logo.png')} style={styles.logo} />
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Image source={require('../assets/messi.png')} style={styles.profile} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('CreateLeague')}
              style={styles.createLeagueBtn}
            >
              <Text style={styles.createLeagueText}>Create your league</Text>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.tabContainer}>
              <TouchableOpacity onPress={() => setActiveTab('joined')}>
                <Text style={[styles.tabText, activeTab === 'joined' && styles.activeTab]}>
                  Joined Leagues
                </Text>
                {activeTab === 'joined' && <View style={styles.underline} />}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setActiveTab('nearby')}>
                <Text style={[styles.tabText, activeTab === 'nearby' && styles.activeTab]}>
                  Nearby
                </Text>
                {activeTab === 'nearby' && <View style={styles.underline} />}
              </TouchableOpacity>
            </View>

            <View style={styles.filterSortRow}>
              <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="filter" size={16} color="#fff" style={{ marginRight: 4 }} />
                <Text style={styles.filterText}>Filter</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterText}>Sort by</Text>
                <Ionicons name="chevron-down" size={16} color="#fff" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>

            {activeTab === 'nearby' && (
              <Text style={{ color: '#888', textAlign: 'center', marginVertical: 20 }}>
                Nearby leagues coming soon.
              </Text>
            )}
          </>
        }
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.barItem}>
          <Ionicons name="home" size={24} color="#E81F89" />
          <Text style={styles.barLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.barItem}>
          <Ionicons name="search" size={24} color="#fff" />
          <Text style={styles.barLabel}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.barItem}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <Text style={styles.barLabel}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.barItem}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
          <Text style={styles.barLabel}>Chat</Text>
        </TouchableOpacity>
      </View>

      {isDrawerOpen && (
        <View style={styles.drawerOverlay}>
          <View style={styles.drawer}>
            <TouchableOpacity
              onPress={() => setIsDrawerOpen(false)}
              style={{ alignSelf: 'flex-end', padding: 10 }}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            {drawerOptions.map((item, index) => (
              <TouchableOpacity key={index} style={styles.drawerItem} onPress={item.onPress}>
                <Text style={styles.drawerText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 36,
    height: 36,
  },
  profile: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  createLeagueBtn: {
    backgroundColor: '#E81F89',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    margin: 16,
    borderRadius: 12,
  },
  createLeagueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
  },
  tabText: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTab: {
    color: '#E81F89',
  },
  underline: {
    height: 3,
    backgroundColor: '#E81F89',
    marginTop: 4,
    borderRadius: 10,
  },
  filterSortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cardInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    width: '48%',
  },
  infoText: {
    color: '#CCCCCC',
    marginLeft: 6,
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#E81F89',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1C1C1E',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
  },
  barItem: {
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 2,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  drawer: {
    width: '70%',
    height: '100%',
    backgroundColor: '#1C1C1E',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  drawerItem: {
    paddingVertical: 16,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  drawerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
