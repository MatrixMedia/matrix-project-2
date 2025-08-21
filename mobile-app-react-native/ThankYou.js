import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

// Local image imports (adjust paths based on your RN project structure)
import robot from '../../assets/images/robot.png';
import felptxt from '../../assets/images/felp-txt.png'; // Convert SVG to PNG or use react-native-svg if needed

export default function ThankYouScreen({ route }) {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Simulating getting user from route or navigation params
    const nameFromRoute = route?.params?.user || 'User';
    setUserName(nameFromRoute);
  }, [route]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.videoSection}>
        <Image source={robot} style={styles.robotImage} resizeMode="contain" />
      </View>

      <View style={styles.chatSection}>
        <View style={styles.felpTextContainer}>
          <Image source={felptxt} style={styles.felpImage} resizeMode="contain" />
          <Text style={styles.tagline}>Your Super AI Agent, Ask Me Anything!</Text>
        </View>

        <View style={styles.thankYouBox}>
          <Text style={styles.heading}>Thank You {userName} for Registering with Felp AI!</Text>
          <Text style={styles.message}>Your registration is successful. Welcome aboard!</Text>
          <Text style={styles.message}>
            Start exploring smart features designed to make your experience faster and easier.
          </Text>
          <Text style={styles.message}>Need help? We're here to support you.</Text>
          <Text style={styles.signature}>— Team Felp AI</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  videoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  robotImage: {
    width: 200,
    height: 200,
  },
  chatSection: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  felpTextContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  felpImage: {
    width: 150,
    height: 50,
  },
  tagline: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  thankYouBox: {
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  message: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
    color: '#444',
  },
  signature: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    color: '#222',
  },
});
