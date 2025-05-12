import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useAxios from '../utils/useAxios';

// Images
import IndoorImg from '../assets/indoor.png';
import OutdoorImg from '../assets/outdoor.png';
import EsportImg from '../assets/esport.png';
import DefaultImg from '../assets/default.png';

const getSportImage = (sport) => {
  const lower = sport?.toLowerCase();
  if (!lower) return DefaultImg;

  if (['futsal', 'football', 'cricket', 'volleyball', 'tennis',
    'hockey', 'baseball', 'rugby', 'kabaddi', 'swimming',
    'athletics', 'golf', 'cycling', 'archery', 'shooting'].includes(lower)) return OutdoorImg;

  if (['basketball', 'badminton', 'table tennis', 'handball',
    'chess', 'boxing', 'mma', 'wrestling', 'gymnastics',
    'weightlifting', 'judo', 'karate', 'taekwondo', 'fencing'].includes(lower)) return IndoorImg;

  if (['counter-strike', 'dota 2', 'league of legends', 'valorant',
    'fortnite', 'pubg', 'apex legends', 'call of duty',
    'rainbow six siege', 'rocket league', 'overwatch',
    'hearthstone', 'fifa', 'nba 2k', 'starcraft ii',
    'super smash bros', 'street fighter', 'tekken',
    'mobile legends', 'free fire', 'wild rift', 'arena of valor',
    'e-sports', 'esports'].includes(lower)) return EsportImg;
    
  return DefaultImg;
};

const LeagueDescriptionScreen = ({ route }) => {
  const navigation = useNavigation();
  const { league } = route.params;
  const axios = useAxios();

  const [joining, setJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(league.is_joined);
  const [participants, setParticipants] = useState([]);
  const [host, setHost] = useState(null);
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const res = await axios.get(`/api/league-participants/${league.id}/`);
      setHost(res.data.host);
      setParticipants(res.data.participants);
      setCurrentUser(res.data.current_user);
    } catch (error) {
      console.error('Failed to load participants', error);
    }
  };

  const handleJoinLeague = async () => {
    try {
      setJoining(true);
      await axios.post(`/api/join-league/${league.id}/`);
      Alert.alert('Success', 'You joined the league!');
      setIsJoined(true);
      fetchParticipants();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.detail || 'Failed to join league');
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveLeague = () => {
    Alert.alert(
      'Confirm Leave',
      'Are you sure you want to leave the league?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              setJoining(true);
              await axios.post(`/api/leave-league/${league.id}/`);
              Alert.alert('Left', 'You have left the league.');
              setIsJoined(false);
              fetchParticipants();
            } catch (error) {
              console.error(error);
              Alert.alert('Error', error.response?.data?.detail || 'Failed to leave league');
            } finally {
              setJoining(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleKickPlayer = async (playerId) => {
    Alert.alert(
      'Confirm Kick',
      'Are you sure you want to kick this player out of the league?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Kick',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.post(`/api/kick-player/${league.id}/`, { player_id: playerId });
              Alert.alert('Success', 'Player has been kicked from the league.');
              fetchParticipants();
            } catch (error) {
              console.error(error);
              Alert.alert('Error', error.response?.data?.detail || 'Failed to kick player');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditLeague = () => {
    if (host && currentUser === host.id) {
      navigation.navigate('EditLeague', { league });
    } else {
      Alert.alert('Permission Denied', 'Only the host can edit the league.');
    }
  };

  const handleMessage = () => {
    navigation.navigate('Chat', { leagueId: league.id });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{league.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Top sport image */}
        <Image
          source={getSportImage(league.sport)}
          style={styles.sportImage}
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

        <Text style={styles.sectionTitle}>Host</Text>
        {host && (
          <Text style={styles.participantName}>👑 {host.username}</Text>
        )}

        <Text style={styles.sectionTitle}>Participants</Text>
        {participants.length > 0 ? (
          participants.map((user, index) => (
            <View key={index} style={styles.participantRow}>
              <Text style={styles.participantName}>
                • {user.username === host?.username ? `${user.username} (Host)` : user.username}
              </Text>
              {host && user.id !== host.id && (
                <TouchableOpacity
                  style={styles.kickButton}
                  onPress={() => handleKickPlayer(user.id)}
                >
                  <Text style={styles.kickText}>Kick</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.descriptionText}>No participants yet.</Text>
        )}

        {/* Join/Leave Buttons */}
        {isJoined ? (
          <TouchableOpacity
            style={styles.leaveButton}
            onPress={handleLeaveLeague}
            disabled={joining}
          >
            <Text style={styles.joinText}>{joining ? 'Leaving...' : 'Leave League'}</Text>
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

        {/* Host Only: Edit League */}
        {host && currentUser === host.id && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditLeague}
          >
            <Text style={styles.joinText}>Edit League</Text>
          </TouchableOpacity>
        )}

        {/* All: Message League */}
        <TouchableOpacity
          style={styles.messageButton}
          onPress={handleMessage}
        >
          <Text style={styles.joinText}>Message League</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sportImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
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
  participantName: {
    color: '#ddd',
    fontSize: 15,
    marginTop: 4,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  kickButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  kickText: {
    color: '#fff',
    fontSize: 14,
  },
  joinBtn: {
    marginTop: 30,
    backgroundColor: '#FF2E94',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  leaveButton: {
    marginTop: 10,
    backgroundColor: '#dc3545',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  joinText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#FF2E94',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  messageButton: {
    marginTop: 20,
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
});
