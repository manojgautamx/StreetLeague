import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../utils/axiosInstance';

const { height } = Dimensions.get('window');

const ALL_SPORTS = [
  'Football', 'Futsal', 'Floorball', 'Field Hockey', 'Frisbee', 'Fishing',
  'Basketball', 'Baseball', 'Badminton', 'Boxing', 'Bowling', 'Billiards',
  'Cricket', 'Cycling', 'Climbing', 'CrossFit', 'Curling',
  'Dodgeball', 'Darts', 'Disc Golf',
  'Esports', 'E-soccer', 'E-racing',
  'Golf', 'Gymnastics',
  'Handball', 'Hiking', 'Horse Riding',
  'Ice Hockey', 'Indoor Soccer', 'Inline Skating',
  'Judo', 'Jiu Jitsu', 'Jet Skiing',
  'Karate', 'Kayaking', 'Kendo', 'Kickboxing', 'Kite Surfing',
  'Lacrosse', 'Laser Tag',
  'Martial Arts', 'MMA', 'Mountain Biking',
  'Netball', 'Nordic Skiing',
  'Paintball', 'Paragliding', 'Parkour', 'Paddle Tennis', 'Ping Pong',
  'Quidditch',
  'Rugby', 'Racquetball', 'Rock Climbing', 'Rowing', 'Roller Derby',
  'Skating', 'Skateboarding', 'Snooker', 'Snowboarding', 'Skiing', 'Squash', 'Surfing', 'Swimming',
  'Tennis', 'Table Tennis', 'Taekwondo', 'Track and Field', 'Triathlon',
  'Ultimate Frisbee', 'Underwater Hockey',
  'Volleyball',
  'Wrestling', 'Weightlifting', 'Walking', 'Wakeboarding', 'Windsurfing',
  'Yoga',
  'Zumba'
];

const CreateLeagueScreen = ({ navigation, route }) => {
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [sport, setSport] = useState('');
  const [sportSuggestions, setSportSuggestions] = useState([]);
  const [leagueName, setLeagueName] = useState('');
  const [description, setDescription] = useState('');
  const [isCasual, setIsCasual] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [price, setPrice] = useState('Free');

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (location.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Location autocomplete error:', err);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [location]);

  useEffect(() => {
    if (route.params?.selectedLocation) {
      const { latitude, longitude, display_name } = route.params.selectedLocation;
      setLatitude(latitude);
      setLongitude(longitude);
      setLocation(display_name);
      setSuggestions([]);
    }
  }, [route.params?.selectedLocation]);

  useEffect(() => {
    if (sport.length > 0) {
      const filtered = ALL_SPORTS.filter(s => s.toLowerCase().startsWith(sport.toLowerCase()));
      setSportSuggestions(filtered);
    } else {
      setSportSuggestions([]);
    }
  }, [sport]);

  const handleSuggestionPress = (item) => {
    setLocation(item.display_name);
    setLatitude(parseFloat(item.lat));
    setLongitude(parseFloat(item.lon));
    setSuggestions([]);
  };

  const handleSportSuggestionPress = (suggestedSport) => {
    setSport(suggestedSport);
    setSportSuggestions([]);
  };

  const onCreate = async () => {
    if (!leagueName || !location || !sport || !date || !time || !maxPlayers) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      name: leagueName,
      description,
      sport,
      location,
      latitude,
      longitude,
      date_time: `${date}T${time}`,
      league_type: isCasual ? 'casual' : 'competitive',
      max_players: parseInt(maxPlayers),
      price: price.trim().toLowerCase() === 'free' ? 0 : parseFloat(price),
    };

    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axiosInstance.post('http://10.0.2.2:8000/api/create-league/', payload);
      Alert.alert('Success', 'League created successfully!');
      navigation.navigate('Home', { refresh: true });
    } catch (err) {
      console.error('Create league error:', err.message);
      setError('Failed to create league.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Icon name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Create a League</Text>

      <Text style={styles.label}>Where are you hosting?</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Location"
        placeholderTextColor="#888"
      />
      {suggestions.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.suggestionItem}
          onPress={() => handleSuggestionPress(item)}
        >
          <Text style={{ color: '#fff' }}>{item.display_name}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.mapBtn} onPress={() => navigation.navigate('MapPicker')}>
        <Text style={styles.mapBtnText}>Choose on Map</Text>
      </TouchableOpacity>

      {latitude && longitude && (
        <WebView
          source={{
            html: `
              <html><body style="margin:0;padding:0;">
                <div id="map" style="height:150px;width:100%"></div>
                <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
                <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
                <script>
                  var map = L.map('map').setView([${latitude}, ${longitude}], 13);
                  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                  L.marker([${latitude}, ${longitude}]).addTo(map);
                </script>
              </body></html>
            `
          }}
          style={{ height: 150, marginTop: 10, borderRadius: 10 }}
          scrollEnabled={false}
        />
      )}

      <Text style={styles.label}>Choose the Sport</Text>
      <TextInput
        style={styles.input}
        value={sport}
        onChangeText={setSport}
        placeholder="Type a sport..."
        placeholderTextColor="#888"
      />
      {sportSuggestions.map((s, index) => (
        <TouchableOpacity
          key={index}
          style={styles.suggestionItem}
          onPress={() => handleSportSuggestionPress(s)}
        >
          <Text style={{ color: '#fff' }}>{s}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Time & Date</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.dateBtn} onPress={() => setDatePickerVisibility(true)}>
          <Icon name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.dateText}>{date || 'Select Date'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateBtn} onPress={() => setTimePickerVisibility(true)}>
          <Icon name="time-outline" size={20} color="#fff" />
          <Text style={styles.dateText}>{time || 'Select Time'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Name your League</Text>
      <TextInput
        style={styles.input}
        value={leagueName}
        onChangeText={setLeagueName}
        placeholder="Name"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Casual or Competitive</Text>
      <TouchableOpacity style={styles.casualBtn} onPress={() => setIsCasual(!isCasual)}>
        <Text style={styles.casualText}>{isCasual ? '⚪ Casual' : '🏆 Competitive'}</Text>
        <Icon name="chevron-forward-outline" size={20} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.label}>Maximum Players</Text>
      <TextInput
        style={styles.input}
        value={maxPlayers}
        onChangeText={setMaxPlayers}
        placeholder="e.g. 16"
        placeholderTextColor="#888"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Price (leave as 'Free' if no cost)</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Free or a price in numbers"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.textArea}
        value={description}
        onChangeText={setDescription}
        placeholder="Tell more about the event..."
        placeholderTextColor="#888"
        multiline
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.createBtn} onPress={onCreate} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createText}>CREATE</Text>}
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(selectedDate) => {
          const formatted = selectedDate.toISOString().split('T')[0];
          setDate(formatted);
          setDatePickerVisibility(false);
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={(selectedTime) => {
          const formatted = selectedTime.toTimeString().slice(0, 5);
          setTime(formatted);
          setTimePickerVisibility(false);
        }}
        onCancel={() => setTimePickerVisibility(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    padding: 20,
    paddingBottom: 60,
    minHeight: height,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
    textAlign: 'center',
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
  suggestionItem: {
    padding: 10,
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
    marginBottom: 5,
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
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default CreateLeagueScreen;
