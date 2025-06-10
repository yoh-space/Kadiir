import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ContactScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }}>
        <Ionicons name="arrow-back" size={28} color="#1db954" />
      </TouchableOpacity>
      <View style={styles.card}>
        <MaterialCommunityIcons name="email-outline" size={48} color="#1db954" style={{ marginBottom: 10 }} />
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.desc}>We would love to hear from you! For support, suggestions, or partnership inquiries, reach out anytime.</Text>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="mail" size={22} color="#fff" />
          <Text style={styles.buttonText}>Email Support</Text>
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