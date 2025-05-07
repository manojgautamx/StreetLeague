import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Profile');
  const [selectedSport, setSelectedSport] = useState(null);
  const navigation = useNavigation();

  const favoriteSports = ['Basketball', 'Cricket', 'Dota 2', 'Valorant'];

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Join me on this awesome sports app! ',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share content.');
    }
  };

  const handleTagPress = (sport) => {
    setSelectedSport(sport);
    Alert.alert('Sport Selected', `You clicked: ${sport}`);
  };

  return (
    <View style={styles.flexContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={24} color="#fff" />
          </Pressable>
          <Image source={require('../assets/messi.png')} style={styles.profileImage} />
          <Text style={styles.name}>Rahul Sharma</Text>
        </View>

        <View style={styles.statsContainer}>
          <Stat label="Played Leagues" value="21" />
          <Stat label="Created Leagues" value="3" />
        </View>

        <View style={styles.tabContainer}>
          <Tab title="Profile" active={activeTab === 'Profile'} onPress={() => setActiveTab('Profile')} />
          <Tab title="History" active={activeTab === 'History'} onPress={() => setActiveTab('History')} />
        </View>

        {activeTab === 'Profile' ? (
          <>
            <Section title="Bio">
              <Text style={styles.text}>
                "Passionate about sports and esports. Always ready for a challenge, both on the field and in life."
              </Text>
            </Section>

            <Section title="Favorite Sports/eSports">
              <View style={styles.tagsContainer}>
                {favoriteSports.map((sport) => (
                  <Pressable key={sport} onPress={() => handleTagPress(sport)}>
                    <View
                      style={[
                        styles.tag,
                        selectedSport === sport && styles.activeTag,
                      ]}
                    >
                      <Text style={styles.tagText}>{sport}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </Section>

            <Pressable style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareText}>Share</Text>
            </Pressable>
          </>
        ) : (
          <Section title="History">
            <Text style={styles.text}>Your league participation history will appear here.</Text>
          </Section>
        )}

        <Pressable style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>

      {/* Bottom NavBar */}
      <View style={styles.navBar}>
        <Pressable style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Home</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => navigation.navigate('Leagues')}>
          <Ionicons name="trophy-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Leagues</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle-outline" size={24} color="#E81F89" />
          <Text style={[styles.navText, { color: '#E81F89' }]}>Profile</Text>
        </Pressable>
      </View>
    </View>
  );
};

const Stat = ({ label, value }) => (
  <View style={styles.statBox}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const Tab = ({ title, active, onPress }) => (
  <Pressable onPress={onPress}>
    <Text style={[styles.tabText, active ? styles.activeTab : styles.inactiveTab]}>
      {title}
    </Text>
  </Pressable>
);

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: -10,
    left: 0,
    padding: 10,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 12,
  },
  tabText: {
    fontSize: 16,
    paddingBottom: 6,
    marginHorizontal: 20,
  },
  activeTab: {
    color: '#E81F89',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#E81F89',
  },
  inactiveTab: {
    color: '#aaa',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  text: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    marginBottom: 10,
  },
  activeTag: {
    backgroundColor: '#E81F89',
    borderColor: '#E81F89',
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
  },
  shareButton: {
    backgroundColor: '#E81F89',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  shareText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#E81F89',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 80,
  },
  logoutText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1e1e1e',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
});

export default ProfileScreen;
