import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import BlogPostItem from '../components/BlogPostItem';
import useWordPressApi from '../hooks/useWordPressApi';
import { useTheme } from '../screens/SettingScreen';
import { useNavigation } from '@react-navigation/native';

export default function PopularScreen() {
  return (
    <View>
      <Text style={{fontSize: 24, color: 'black', textAlign: 'center', marginTop: 20, padding: 10, backgroundColor: '#f0f0f0'}}>
        This is PopularScreen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
});
