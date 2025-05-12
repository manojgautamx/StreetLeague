import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useAxios from '../utils/useAxios';

import IndoorImg from '../assets/indoor.png';
import OutdoorImg from '../assets/outdoor.png';
import EsportsImg from '../assets/esport.png';
import DefaultImg from '../assets/default.png';

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
  if (inList(ESPORTS)) return EsportsImg;

  return DefaultImg;
};

const LeagueDescriptionScreen = ({ route }) => {
  const navigation = useNavigation();
  const { league } = route.params;
  const axios = useAxios();

  const [joining, setJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(league.is_joined);

  const handleJoinLeague = async () => {
    try {
      setJoining(true);
      const response = await axios.post(`http://10.0.2.2:8000/api/join-league/${league.id}/`);
      Alert.alert('Success', 'You joined the league!');
      setIsJoined(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.detail || 'Failed to join league');
    } finally {
      setJoining(false);
    }
  };

  const handleMessage = () => {
    navigation.navigate('ChatScreen', { leagueId: league.id });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/iimage.png')}
          style={styles.profile}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* League Image */}
        <Image
          source={getLeagueImageBySport(league.sport)}
          style={styles.leagueImage}
          resizeMode="cover"
        />

        <Text style={styles.title}>{league.name}</Text>

        <View style={styles.infoRow}>
          <Icon name="sports-soccer" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.infoText}>{league.sport}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="location-on" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.infoText}>{league.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="event" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.infoText}>{league.date_time}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="category" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.infoText}>{league.league_type}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="group" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.infoText}>Max Players: {league.max_players}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="attach-money" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.infoText}>₹{league.price}</Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{league.description}</Text>

        {isJoined ? (
          <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
            <Text style={styles.joinText}>Message</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.joinBtn}
            onPress={handleJoinLeague}
            disabled={joining}
          >
            <Text style={styles.joinText}>{joining ? 'Joining...' : 'JOIN'}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default LeagueDescriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  logo: {
    width: 100,
    height: 30,
  },
  profile: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  leagueImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  descriptionText: {
    color: '#aaa',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  joinBtn: {
    marginTop: 30,
    backgroundColor: '#FF2E94',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  messageButton: {
    marginTop: 30,
    backgroundColor: '#198754',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  joinText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
