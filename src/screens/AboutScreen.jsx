import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AboutScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }}>
        <Ionicons name="arrow-back" size={28} color="#1db954" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Image source={require('../assets/image.png')} style={styles.logo} />
        <Text style={styles.title}>About Kadiir Blog</Text>
        <Text style={styles.subtitle}>Your daily source for curated news, stories, and inspiration.</Text>
      </View>
      <View style={styles.card}>
        <Ionicons name="information-circle" size={40} color="#1db954" style={{ marginBottom: 10 }} />
        <Text style={styles.desc}>
          Kadiir Blog is dedicated to bringing you the latest and most relevant news, articles, and features. Our mission is to keep you informed, inspired, and connected to the world around you.
        </Text>
        <Text style={styles.feedbackTitle}>We value your feedback!</Text>
        <TouchableOpacity style={styles.feedbackBtn}>
          <Ionicons name="mail" size={22} color="#fff" />
          <Text style={styles.feedbackBtnText}>Send Feedback</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1db954',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  desc: {
    fontSize: 15,
    color: '#222',
    textAlign: 'center',
    marginBottom: 18,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1db954',
    marginBottom: 10,
  },
  feedbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1db954',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 4,
  },
  feedbackBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});