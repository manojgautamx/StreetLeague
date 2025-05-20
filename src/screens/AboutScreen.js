import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';

const AboutScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cross Button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeText}>✖️</Text>
      </TouchableOpacity>

      <Text style={styles.title}>About StreetLeague</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.paragraph}>
          At StreetLeague, we aim to unite sports enthusiasts from all backgrounds and skill levels.
          We believe in fostering community spirit, healthy competition, and teamwork through local leagues and events.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Discover and join local sports leagues</Text>
          <Text style={styles.bulletItem}>• Create and manage your own leagues</Text>
          <Text style={styles.bulletItem}>• Connect with other players and teams</Text>
          <Text style={styles.bulletItem}>• Stay updated with schedules, results, and announcements</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Version</Text>
        <Text style={styles.paragraph}>1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Developed By</Text>
        <Text style={styles.paragraph}>
          Our passionate team dedicated to building a vibrant sports community.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          Have questions or feedback? We’d love to hear from you!
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:support@streetleague.com')}>
          <Text style={styles.link}>support@streetleague.com</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 StreetLeague. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#121212',
    flexGrow: 1,
    paddingTop: 48,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  closeText: {
    fontSize: 22,
    color: '#E81F89',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E81F89',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E2E',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E81F89',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#CCC',
    lineHeight: 22,
  },
  bulletList: {
    marginLeft: 12,
  },
  bulletItem: {
    fontSize: 16,
    color: '#CCC',
    lineHeight: 22,
    marginBottom: 6,
  },
  link: {
    fontSize: 16,
    color: '#E81F89',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  footer: {
    marginTop: 40,
    paddingTop: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#777',
  },
});
