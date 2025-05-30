import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, TextInput, Alert } from 'react-native';
import { onAuthChange, signIn, signUp, logOut } from '../api/firebaseAuth';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'signup'

  useEffect(() => {
    const unsubscribe = onAuthChange(setUser);
    return unsubscribe;
  }, []);

  const handleAuth = async () => {
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (e) {
      Alert.alert('Auth Error', e.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (e) {
      Alert.alert('Logout Error', e.message);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>{mode === 'login' ? 'Sign In' : 'Sign Up'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title={mode === 'login' ? 'Sign In' : 'Sign Up'} onPress={handleAuth} />
        <Text
          style={{ color: '#4a90e2', marginTop: 16 }}
          onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
        >
          {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/icon.png')} style={styles.avatar} />
      <Text style={styles.name}>{user.email}</Text>
      <Text style={styles.info}>Welcome to your profile!</Text>
      <Button title="Sign Out" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6f8fa',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 18,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  info: {
    fontSize: 16,
    color: '#888',
  },
  input: {
    width: 260,
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
});
