import React, { useEffect, useState } from 'react';
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
import useAxios from '../utils/useAxios';

const JoinedLeaguesScreen = () => {
  const [joinedLeagues, setJoinedLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const axios = useAxios();
  const [activeTab, setActiveTab] = useState('joined');

  useEffect(() => {
    fetchJoinedLeagues();
  }, []);

  const fetchJoinedLeagues = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://10.0.2.2:8000/api/joined-leagues/');
      setJoinedLeagues(response.data);
    } catch (err) {
      setError('Failed to load joined leagues.');
    } finally {
      setLoading(false);
    }
  };

  const renderLeagueCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Description', { league: item })}
      style={styles.card}
    >
      <Image source={require('../assets/futsal.png')} style={styles.cardImage} />

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>

        <Text style={styles.label}>Sport:</Text>
        <Text style={styles.value}>{item.sport}</Text>

        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>{item.location}</Text>

        <Text style={styles.label}>Date & Time:</Text>
        <Text style={styles.value}>{item.date_time}</Text>

        <Text style={styles.label}>League Type:</Text>
        <Text style={styles.value}>{item.league_type}</Text>

        <Text style={styles.label}>Max Players:</Text>
        <Text style={styles.value}>{item.max_players}</Text>

        <Text style={styles.label}>Price:</Text>
        <Text style={styles.value}>₹{item.price}</Text>

        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{item.description}</Text>
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

  return (
    <View style={styles.container}>
      <FlatList
        data={joinedLeagues}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLeagueCard}
        ListEmptyComponent={
          <View style={{ padding: 16 }}>
            <Text style={styles.noLeaguesText}>No joined league yet</Text>
          </View>
        }
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Ionicons name="menu" size={28} color="#fff" />
              <Image source={require('../assets/logo.png')} style={styles.logo} />
              <Image source={require('../assets/iimage.png')} style={styles.profile} />
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('CreateLeague')}
              style={styles.createLeagueBtn}
            >
              <Text style={styles.createLeagueText}>Create your league</Text>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.tabContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={[styles.tabText, activeTab === 'nearby' && styles.activeTab]}>
                  Nearby
                </Text>
                {activeTab === 'nearby' && <View style={styles.underline} />}
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={[styles.tabText, activeTab === 'joined' && styles.activeTab]}>
                  Joined Leagues
                </Text>
                {activeTab === 'joined' && <View style={styles.underline} />}
              </TouchableOpacity>
            </View>

            <View style={styles.filterSortRow}>
              <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="filter" size={16} color="#fff" style={{ marginRight: 4 }} />
                <Text style={styles.filterText}>Filter</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListFooterComponent={
          <View style={{ padding: 16 }}>
            <Text style={styles.myLeaguesTitle}>My Leagues</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.barItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#fff" />
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
    </View>
  );
};

export default JoinedLeaguesScreen;

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
    backgroundColor: '#333',
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
    justifyContent: 'flex-start',
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
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 14,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  label: {
    color: '#fff',
    fontWeight: '600',
    marginTop: 8,
  },
  value: {
    color: '#ccc',
    marginBottom: 6,
  },
  noLeaguesText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  myLeaguesTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
});
