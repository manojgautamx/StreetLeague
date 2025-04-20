import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';

const { height } = Dimensions.get('window');

const CreateLeagueScreen = () => {
  const [location, setLocation] = useState('');
  const [sport, setSport] = useState('');
  const [leagueName, setLeagueName] = useState('');
  const [description, setDescription] = useState('');
  const [isCasual, setIsCasual] = useState(true);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);

  const onCreate = () => {
    console.log({
      location,
      sport,
      leagueName,
      isCasual: isCasual ? 'Casual' : 'Competitive',
      description,
      date,
      time,
    });
  };

  const handleCalendarMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.date && data.time) {
        setDate(data.date);
        setTime(data.time);
      }
      setShowCalendar(false);
    } catch (error) {
      console.error('Invalid calendar data:', error);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowNavbar(true)}>
            <Icon name="menu-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Image source={require('../assets/profile.png')} style={styles.profile} />
        </View>

        <Text style={styles.title}>Create your League</Text>

        {/* Location */}
        <Text style={styles.label}>Where are you hosting?</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Location"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.mapBtn} onPress={() => setShowMap(true)}>
          <Text style={styles.mapBtnText}>Choose on Map</Text>
        </TouchableOpacity>

        {/* Sport */}
        <Text style={styles.label}>Choose the Sport</Text>
        <TextInput
          style={styles.input}
          value={sport}
          onChangeText={setSport}
          placeholder="Type a sport...."
          placeholderTextColor="#888"
        />

        {/* Date & Time */}
        <Text style={styles.label}>Time & Date</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.dateBtn} onPress={() => setShowCalendar(true)}>
            <Icon name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.dateText}>{date || '2025/3/15'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateBtn} onPress={() => setShowCalendar(true)}>
            <Icon name="time-outline" size={20} color="#fff" />
            <Text style={styles.dateText}>{time || '8:00 AM'}</Text>
          </TouchableOpacity>
        </View>

        {/* League Name */}
        <Text style={styles.label}>Name your League</Text>
        <TextInput
          style={styles.input}
          value={leagueName}
          onChangeText={setLeagueName}
          placeholder="Name"
          placeholderTextColor="#888"
        />

        {/* Type */}
        <Text style={styles.label}>Casual or Competitive</Text>
        <TouchableOpacity style={styles.casualBtn} onPress={() => setIsCasual(!isCasual)}>
          <Text style={styles.casualText}>{isCasual ? '⚪ Casual' : '🏆 Competitive'}</Text>
          <Icon name="chevron-forward-outline" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          placeholder="Tell more about the event..."
          placeholderTextColor="#888"
          multiline
        />

        {/* Create Button */}
        <TouchableOpacity style={styles.createBtn} onPress={onCreate}>
          <Text style={styles.createText}>CREATE</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Calendar Modal */}
      <Modal visible={showCalendar} animationType="slide">
        <WebView
          source={{ uri: 'https://cal.com/sanji-62/30min' }}
          onMessage={handleCalendarMessage}
          injectedJavaScript={`
            setTimeout(() => {
              const style = document.createElement('style');
              style.innerHTML = \`
                header, 
                .event-title-wrapper, 
                .event-type-meta, 
                .location-wrapper, 
                .timezone-wrapper,
                .event-type-meta + div {
                  display: none !important;
                }
              \`;
              document.head.appendChild(style);
            }, 1500);
            true;
          `}
        />
        <TouchableOpacity
          onPress={() => setShowCalendar(false)}
          style={styles.closeCalendarBtn}
        >
          <Icon name="close-circle" size={30} color="#FF2E94" />
        </TouchableOpacity>
      </Modal>

      {/* Map Modal (Image only) */}
      {/* Map Modal (Custom Layout) */}
<Modal visible={showMap} animationType="slide" transparent>
  <View style={styles.mapModalOverlay}>
    <View style={styles.mapModal}>
      {/* Close Button */}
      <TouchableOpacity onPress={() => setShowMap(false)} style={styles.mapCloseBtn}>
        <Icon name="close-outline" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.mapSearchContainer}>
        <Icon name="search-outline" size={20} color="#888" style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Search for a location"
          placeholderTextColor="#888"
          style={styles.mapSearchInput}
        />
      </View>

      {/* Map Image */}
      <Image
        source={require('../assets/map.png')}
        style={styles.mapImage}
      />

      {/* Use Location Button */}
      <TouchableOpacity
        style={styles.useLocationBtn}
        onPress={() => {
          setLocation('Selected Location');
          setShowMap(false);
        }}
      >
        <Text style={styles.useLocationText}>Use this Location</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


      {/* Navbar Modal */}
      <Modal visible={showNavbar} animationType="slide" transparent>
        <View style={styles.navbarOverlay}>
          <View style={styles.navbarContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <TouchableOpacity><Text style={styles.navItem}>About</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.navItem}>Settings</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.navItem}>Terms & Conditions</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.navItem}>Privacy Policy</Text></TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setShowNavbar(false)} style={styles.closeNavbarBtn}>
              <Icon name="close-circle" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Nav */}
      <View style={styles.navBar}>
        <TouchableOpacity><Icon name="home-outline" size={24} color="#FF2E94" /></TouchableOpacity>
        <TouchableOpacity><Icon name="search-outline" size={24} color="#FF2E94" /></TouchableOpacity>
        <TouchableOpacity><Icon name="notifications-outline" size={24} color="#FF2E94" /></TouchableOpacity>
        <TouchableOpacity><Icon name="chatbubble-outline" size={24} color="#FF2E94" /></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    padding: 20,
    paddingBottom: 100,
    minHeight: height,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  profile: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF2E94',
    marginBottom: 30,
    paddingLeft: 5,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
  },
  mapBtn: {
    backgroundColor: '#FF2E94',
    marginTop: 10,
    padding: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  mapBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  dateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  dateText: {
    color: '#fff',
  },
  casualBtn: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  casualText: {
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    color: '#fff',
  },
  createBtn: {
    backgroundColor: '#FF2E94',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  createText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeCalendarBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 99,
  },



  mapModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapModal: {
    width: '90%',
    height: '85%',
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapCloseBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 99,
  },
  mapSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    padding: 10,
    borderRadius: 10,
    marginTop: 40,
    width: '100%',
  },
  mapSearchInput: {
    flex: 1,
    color: '#fff',
  },
  mapImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
    borderRadius: 15,
    marginTop: 15,
  },
  useLocationBtn: {
    backgroundColor: '#FF2E94',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  useLocationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  navbarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  navbarContainer: {
    width: '70%',
    backgroundColor: '#FF2E94',
    padding: 20,
    height: '100%',
  },
  navItem: {
    color: '#000',
    fontSize: 18,
    marginVertical: 10,
  },
  logoutBtn: {
    marginTop: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  logoutText: {
    color: '#FF2E94',
    fontWeight: 'bold',
  },
  closeNavbarBtn: {
    position: 'absolute',
    top: 40,
    right: -10,
  },
});
 


export default CreateLeagueScreen;
