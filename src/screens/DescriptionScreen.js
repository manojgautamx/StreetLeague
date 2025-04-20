import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DescriptionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    leagueName = 'Futsal Tournament',
    date = 'Thurs, 2025, 8th March',
    time = '8:00 PM',
    location = 'Pepsicola Ground, Kathmandu',
    description = 'Welcome to the game. You can join here.',
    sport = 'Futsal',
    image = require('../assets/futsal.png'),
  } = route.params || {};

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>League Description</Text>
        <Image
          source={require('../assets/profile.png')}
          style={styles.profile}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* League Image */}
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} />
          <Text style={styles.imageCaption}>Hattiban, Lalitpur</Text>
        </View>

        {/* League Title */}
        <Text style={styles.title}>{leagueName}</Text>

        {/* Info Rows */}
        <View style={styles.infoRow}>
          <Icon name="calendar-today" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.infoText}>{date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="access-time" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.infoText}>{time}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="location-on" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.infoText}>{location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="sports-soccer" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.infoText}>{sport}</Text>
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{description}</Text>

        {/* Join Button */}
        <TouchableOpacity style={styles.joinBtn}>
          <Text style={styles.joinText}>JOIN</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default DescriptionScreen;

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
  headerTitle: {
    fontSize: 16,
    color: '#aaa',
    fontWeight: 'bold',
  },
  profile: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  backIcon: {
    color: '#fff',
    fontSize: 24,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 160,
  },
  imageCaption: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
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
  joinText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
