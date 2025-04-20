import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const navigation = useNavigation();
  const route = useRoute(); // Use this to access the passed parameters

  // When the screen mounts, update location if passed from MapScreen
  useEffect(() => {
    if (route.params?.location) {
      setLocation(route.params.location); // Update the location state
    }
  }, [route.params?.location]);

  const onCreate = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/league/create-league', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: location,
          sport: sport,
          league_name: leagueName,
          description: description,
          category: isCasual ? 'Casual' : 'Competitive',
          date: date,
          time: time,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('League created successfully:', data);
        alert('League created!');
        navigation.goBack();
      } else {
        console.error('Server responded with error:', data);
        alert(data.detail || 'Failed to create league.');
      }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Network or server error occurred.');
    }
  };

  // Handle date picker change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      setDate(formattedDate);
    }
  };

  // Handle time picker change
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const formattedTime = selectedTime.toTimeString().split(' ')[0]; // Format as HH:MM:SS
      setTime(formattedTime);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Where are you hosting?</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Location"
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        style={styles.mapBtn}
        onPress={() => navigation.navigate('MapScreen')} // Navigate to MapScreen
      >
        <Text style={styles.mapBtnText}>Choose on Map</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Choose the Sport</Text>
      <TextInput
        style={styles.input}
        value={sport}
        onChangeText={setSport}
        placeholder="Type a sport..."
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Time & Date</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowDatePicker(true)} // Show Date Picker
        >
          <Icon name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.dateText}>{date || 'Select Date'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowTimePicker(true)} // Show Time Picker
        >
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
      <TouchableOpacity
        style={styles.casualBtn}
        onPress={() => setIsCasual(!isCasual)}
      >
        <Text style={styles.casualText}>
          {isCasual ? '⚪ Casual' : '🏆 Competitive'}
        </Text>
        <Icon name="chevron-forward-outline" size={20} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.textArea}
        value={description}
        onChangeText={setDescription}
        placeholder="Tell more about the event..."
        placeholderTextColor="#888"
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.createBtn} onPress={onCreate}>
        <Text style={styles.createText}>CREATE</Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Time Picker Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
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
});

export default CreateLeagueScreen;
