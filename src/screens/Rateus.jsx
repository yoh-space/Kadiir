import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useTheme } from './SettingScreen'; // Adjust the import path as necessary
import { useNavigation } from '@react-navigation/native';

export default function Rateus() {
  const navigation = useNavigation();
  const { isDark, theme } = useTheme();
  const [rating, setRating] = useState(0);

  return (
    <View style={[styles.container]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }}>
        <Ionicons name="arrow-back" size={28} color="#1db954" />
      </TouchableOpacity>
      <View style={styles.card}>
        <AntDesign name="star" size={48} color="#FFD700" style={{ marginBottom: 10 }} />
        <Text style={styles.title}>Rate Us</Text>
        <Text style={styles.desc}>Enjoying Kadiir Blog? Tap a star to rate and help us improve!</Text>
        <View style={styles.starsRow}>
          {[1,2,3,4,5].map(i => (
            <TouchableOpacity key={i} onPress={() => setRating(i)}>
              <AntDesign name={i <= rating ? 'star' : 'staro'} size={36} color={i <= rating ? '#FFD700' : '#bbb'} style={styles.star} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="send" size={22} color="#fff" />
          <Text style={styles.buttonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1db954',
    marginBottom: 8,
  },
  desc: {
    fontSize: 15,
    color: '#222',
    textAlign: 'center',
    marginBottom: 18,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  star: {
    marginHorizontal: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1db954',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});