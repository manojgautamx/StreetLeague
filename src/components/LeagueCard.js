import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import IndoorImg from '../assets/indoor.png';
import OutdoorImg from '../assets/outdoor.png';
import EsportImg from '../assets/esport.png';
import DefaultImg from '../assets/default.png';

const OUTDOOR_SPORTS = [
  'futsal', 'football', 'cricket', 'volleyball', 'tennis', 'hockey',
  'baseball', 'rugby', 'kabaddi', 'swimming', 'athletics', 'golf',
  'cycling', 'archery', 'shooting'
];

const INDOOR_SPORTS = [
  'basketball', 'badminton', 'table tennis', 'handball', 'chess',
  'boxing', 'mma', 'wrestling', 'gymnastics', 'weightlifting',
  'judo', 'karate', 'taekwondo', 'fencing'
];

const ESPORTS = [
  'counter-strike', 'dota 2', 'league of legends', 'valorant', 'fortnite',
  'pubg', 'apex legends', 'call of duty', 'rainbow six siege', 'rocket league',
  'overwatch', 'hearthstone', 'fifa', 'nba 2k', 'starcraft ii',
  'super smash bros', 'street fighter', 'tekken', 'mobile legends',
  'free fire', 'wild rift', 'arena of valor', 'e-sports', 'esports'
];

const getLeagueImageBySport = (sport) => {
  const sportLower = sport?.toLowerCase();
  if (!sportLower) return DefaultImg;
  if (OUTDOOR_SPORTS.includes(sportLower)) return OutdoorImg;
  if (INDOOR_SPORTS.includes(sportLower)) return IndoorImg;
  if (ESPORTS.includes(sportLower)) return EsportImg;
  return DefaultImg;
};

const formatLocation = (location) => {
  if (!location) return '';
  const parts = location.split(',');
  return parts.slice(0, 2).join(',').trim(); // Example: "Hattiban, Lalitpur"
};

const formatDate = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  return date.toLocaleDateString();
};

const formatTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const LeagueCard = ({ league, onPress, isOwner = false, onEdit, onDelete }) => (
  <TouchableOpacity onPress={onPress} style={styles.card}>
    <Image source={getLeagueImageBySport(league.sport)} style={styles.cardImage} />

    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{league.name}</Text>

      <View style={styles.row}>
        <View style={styles.detailBox}>
          <Ionicons name="football-outline" size={16} color="#ddd" />
          <Text style={styles.cardDetail}> {league.sport}</Text>
        </View>
        <View style={styles.detailBox}>
          <Ionicons name="people-outline" size={16} color="#ddd" />
          <Text style={styles.cardDetail}> {league.max_players} players</Text>
        </View>
      </View>

      <View style={styles.fullWidthBox}>
        <Ionicons name="location-outline" size={16} color="#ddd" />
        <Text style={styles.cardDetail}> {formatLocation(league.location)}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.detailBox}>
          <Ionicons name="calendar-outline" size={16} color="#ddd" />
          <Text style={styles.cardDetail}> {formatDate(league.date_time)}</Text>
        </View>
        <View style={styles.detailBox}>
          <Ionicons name="time-outline" size={16} color="#ddd" />
          <Text style={styles.cardDetail}> {formatTime(league.date_time)}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.detailBox}>
          <Ionicons name="trophy-outline" size={16} color="#ddd" />
          <Text style={styles.cardDetail}> {league.league_type}</Text>
        </View>
      </View>

      {isOwner && (
        <View style={styles.ownerButtons}>
          <TouchableOpacity onPress={onEdit} style={styles.button}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={[styles.button, styles.deleteButton]}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 10,
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardContent: {
    backgroundColor: 'rgba(28, 28, 30, 0.7)',
    padding: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fullWidthBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardDetail: {
    color: '#ddd',
    fontSize: 14,
    marginLeft: 6,
    flexShrink: 1,
  },
  ownerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  button: {
    backgroundColor: '#FF4081',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#E53935',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default LeagueCard;
