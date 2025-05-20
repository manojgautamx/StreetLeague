import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useAxios from '../utils/useAxios';

import IndoorImg from '../assets/indoor.png';
import OutdoorImg from '../assets/outdoor.png';
import EsportImg from '../assets/esport.png';
import DefaultImg from '../assets/default.png';

const windowWidth = Dimensions.get('window').width;

// Helper to return sport type image
const getSportImage = (sport) => {
  const lower = sport?.toLowerCase();
  if (!lower) return DefaultImg;

  const outdoorSports = [
    'futsal', 'football', 'cricket', 'volleyball', 'tennis', 'hockey', 'baseball',
    'rugby', 'kabaddi', 'swimming', 'athletics', 'golf', 'cycling', 'archery', 'shooting',
  ];
  const indoorSports = [
    'basketball', 'badminton', 'table tennis', 'handball', 'chess', 'boxing', 'mma',
    'wrestling', 'gymnastics', 'weightlifting', 'judo', 'karate', 'taekwondo', 'fencing',
  ];
  const esports = [
    'counter-strike', 'dota 2', 'league of legends', 'valorant', 'fortnite', 'pubg',
    'apex legends', 'call of duty', 'rainbow six siege', 'rocket league', 'overwatch',
    'hearthstone', 'fifa', 'nba 2k', 'starcraft ii', 'super smash bros', 'street fighter',
    'tekken', 'mobile legends', 'free fire', 'wild rift', 'arena of valor', 'e-sports', 'esports',
  ];

  if (outdoorSports.includes(lower)) return OutdoorImg;
  if (indoorSports.includes(lower)) return IndoorImg;
  if (esports.includes(lower)) return EsportImg;
  return DefaultImg;
};

const LeagueDescriptionScreen = ({ route }) => {
  const navigation = useNavigation();
  const { league, source } = route.params; 
  const axios = useAxios();

  const [loading, setLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(league.is_joined);

  const dateObj = league.date_time ? new Date(league.date_time) : null;
  const formattedDate = dateObj ? dateObj.toLocaleDateString() : 'Date not set';
  const formattedTime = dateObj ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time not set';

  const handleJoinLeague = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/join-league/${league.id}/`);
      Alert.alert('Success', 'You have joined the league!');
      setIsJoined(true);
    } catch (error) {
      console.error('Join error:', error);
      Alert.alert('Error', error.response?.data?.detail || 'Failed to join the league');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveLeague = () => {
    Alert.alert('Confirm Leave', 'Are you sure you want to leave the league?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Leave',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await axios.post(`/api/leave-league/${league.id}/`);
            Alert.alert('Left', 'You have left the league.');
            setIsJoined(false);
          } catch (error) {
            console.error('Leave error:', error);
            Alert.alert('Error', error.response?.data?.detail || 'Failed to leave the league');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleEditLeague = () => {
    navigation.navigate('EditLeague', { league });
  };

  const handleDeleteLeague = () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this league?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await axios.delete(`/api/leagues/${league.id}/`);
            Alert.alert('Deleted', 'League has been deleted.');
            navigation.goBack();
          } catch (error) {
            console.error('Delete error:', error);
            Alert.alert('Error', error.response?.data?.detail || 'Failed to delete league');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleMessage = () => {
    navigation.navigate('Chat', {
      leagueId: league.id,
      leagueName: league.name,
      currentUserId: null,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Big Cover Image Full Width */}
        <Image source={getSportImage(league.sport)} style={styles.coverImage} />

        {/* League Name */}
        <Text style={styles.leagueName}>{league.name}</Text>
        {/* Date */}
<View style={styles.infoRow}>
  <Icon name="event" size={22} color="#fff" style={styles.icon} />
  <Text style={styles.infoText}>{formattedDate}</Text>
</View>

{/* Time */}
<View style={styles.infoRow}>
  <Icon name="schedule" size={22} color="#fff" style={styles.icon} />
  <Text style={styles.infoText}>{formattedTime}</Text>
</View>

        {/* Location */}
        <View style={styles.infoRow}>
          <Icon name="location-on" size={22} color="#fff" style={styles.icon} />
          <Text style={styles.infoText}>{league.location}</Text>
        </View>

        {/* Game/Sport */}
        <View style={styles.infoRow}>
          <Icon name="sports-soccer" size={22} color="#fff" style={styles.icon} />
          <Text style={styles.infoText}>{league.sport}</Text>
        </View>
        {/* Game Type (Casual or Competitive) */}
<View style={styles.infoRow}>
  <Icon name="sports" size={22} color="#fff" style={styles.icon} />
  <Text style={styles.infoText}>
    {league.type ? league.type.charAt(0).toUpperCase() + league.type.slice(1) : 'N/A'}
  </Text>
</View>

{/* Price */}
<View style={styles.infoRow}>
  <Icon name="attach-money" size={22} color="#fff" style={styles.icon} />
  <Text style={styles.infoText}>
    {league.price !== undefined && league.price !== null ? `RM ${league.price}` : 'Free'}
  </Text>
</View>


        {/* Description Title */}
        <Text style={styles.sectionTitle}>Description</Text>
        {/* Description Text */}
        <Text style={styles.descriptionText}>{league.description}</Text>

        {/* Action Buttons */}
        {source === 'nearby' && !isJoined && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#E81F89' }]}
            onPress={handleJoinLeague}
            disabled={loading}
          >
            <Text style={styles.actionButtonText}>{loading ? 'Joining...' : 'Join League'}</Text>
          </TouchableOpacity>
        )}
        

        {source === 'joined' && isJoined && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#E81F89' }]}
              onPress={handleLeaveLeague}
              disabled={loading}
            >
              <Text style={styles.actionButtonText}>
                {loading ? 'Leaving...' : 'Leave League'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { marginTop: 12, backgroundColor: '#27A644' }]}
              onPress={handleMessage}
            >
              <Text style={styles.actionButtonText}>Message League</Text>
            </TouchableOpacity>
          </>
        )}

        {source === 'myLeagues' && league.created_by && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#E81F89' }]}
              onPress={handleEditLeague}
              disabled={loading}
            >
              <Text style={styles.actionButtonText}>Edit League</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { marginTop: 12, backgroundColor: '#dc3545' }]}
              onPress={handleDeleteLeague}
              disabled={loading}
            >
              <Text style={styles.actionButtonText}>Delete League</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313',
  },
  header: {
    padding: 12,
    backgroundColor: '#131313',
  },
  content: {
    paddingHorizontal: 0,
    paddingBottom: 40,
  },
  coverImage: {
    width: windowWidth,
    height: 250,
    resizeMode: 'cover',
  },
  leagueName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 16,
  },
  icon: {
    marginRight: 9,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 32,
    marginHorizontal: 16,
  },
  descriptionText: {
    color: '#ccc',
    fontSize: 18,
    marginTop: 10,
    marginHorizontal: 16,
    lineHeight: 24,
  },
  actionButton: {
    marginTop: 32,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default LeagueDescriptionScreen;
