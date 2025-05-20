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
import BottomNavBar from '../components/BottomNavBar';
import LeagueCard from '../components/LeagueCard';

const HomeScreen = () => {
  const [tab, setTab] = useState('Nearby');
  const [activeTab, setActiveTab] = useState('Home');
  const [myLeagues, setMyLeagues] = useState([]);
  const [joinedLeagues, setJoinedLeagues] = useState([]);
  const [otherLeagues, setOtherLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const axios = useAxios();
  const { logout } = useContext(AuthContext);

  const fetchLeagues = async () => {
    try {
      setLoading(true);

      const [myRes, joinedRes, publicRes] = await Promise.all([
        axios.get('/api/my-leagues/'),
        axios.get('/api/joined-leagues/'),
        axios.get('/api/public-leagues/'),
      ]);

      const myData = myRes.data;
      const joinedData = joinedRes.data;

      const myIds = new Set(myData.map((l) => l.id));
      const filteredJoined = joinedData.filter((l) => !myIds.has(l.id));

      const joinedIds = new Set(filteredJoined.map((l) => l.id));
      const filteredPublic = publicRes.data.filter(
        (l) => !myIds.has(l.id) && !joinedIds.has(l.id)
      );

      setMyLeagues(myData);
      setJoinedLeagues(filteredJoined);
      setOtherLeagues(filteredPublic);
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

  const handleLeaguePress = (league) => {
    navigation.navigate('LeagueDescription', { league, source: tab.toLowerCase() });
  };

  const handleEditLeague = (league) => {
    navigation.navigate('EditLeague', { league });
  };

  const handleDeleteLeague = (league) => {
    Alert.alert(
      'Delete League',
      `Are you sure you want to delete "${league.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await axios.delete(`/api/leagues/${league.id}/`);
              fetchLeagues();
            } catch (err) {
              console.error('Failed to delete league', err);
              Alert.alert('Error', 'Failed to delete league.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderLeagueList = (leagues) => (
    <FlatList
      data={leagues}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <LeagueCard league={item} onPress={() => handleLeaguePress(item)} />
      )}
      scrollEnabled={false}
    />
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

        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setTab('Nearby')}>
            <Text style={[styles.tab, tab === 'Nearby' && styles.activeTab]}>
              Nearby
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('Joined')}>
            <Text style={[styles.tab, tab === 'Joined' && styles.activeTab]}>
              Joined Leagues
            </Text>
          </TouchableOpacity>
        </View>

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

        {tab === 'Nearby' ? (
          otherLeagues.length === 0 ? (
            <Text style={styles.emptyText}>No nearby leagues found.</Text>
          ) : (
            renderLeagueList(otherLeagues)
          )
        ) : (
          <>
            <Text style={styles.sectionTitle}>Joined Leagues</Text>
            {joinedLeagues.length === 0 ? (
              <Text style={styles.emptyText}>You haven’t joined any leagues yet.</Text>
            ) : (
              renderLeagueList(joinedLeagues)
            )}

            <Text style={styles.sectionTitle}>My Leagues</Text>
            {myLeagues.length === 0 ? (
              <Text style={styles.emptyText}>You haven’t created any leagues yet.</Text>
            ) : (
              <FlatList
                data={myLeagues}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <LeagueCard
                    league={item}
                    onPress={() => handleLeaguePress(item)}
                    isOwner={true}
                    onEdit={() => handleEditLeague(item)}
                    onDelete={() => handleDeleteLeague(item)}
                  />
                )}
                scrollEnabled={false}
              />
            )}
          </>
        )}
      </ScrollView>

      <BottomNavBar activeTab={activeTab} onTabPress={setActiveTab} />
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
  sectionTitle: {
    color: '#E81F89',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 12,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#E81F89',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default HomeScreen;
