import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeBreakingNews({ breakingNews, getCategoryNames, navigation, theme, styles }) {
  return (
    <>
      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>🔥 Latest Blog</Text>
        <TouchableOpacity 
          style={styles.seeAllButton}
          onPress={() => navigation.navigate('BlogList', { category: 'Breaking News' })}
          >
          <Text style={[styles.seeAll, { color: theme.color }]}>SEE ALL</Text>
          <Ionicons name="arrow-forward" size={16} color={theme.color} />
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.breakingNewsContainer}
        contentContainerStyle={styles.breakingNewsContent}
      >
        {breakingNews.map((item, idx) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.breakingCard, idx === 0 && { marginLeft: 0 }]}
            onPress={() => navigation.navigate('Post', { post: item })}
            activeOpacity={0.85}
          >
            {item._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
              <Image 
                source={{ uri: item._embedded['wp:featuredmedia'][0].source_url }} 
                style={styles.breakingImage} 
              />
            )}
            <View style={styles.breakingOverlay} />
            <View style={styles.breakingContent}>
              <Text style={styles.breakingTitle} numberOfLines={2}>
                {item.title.rendered}
              </Text>
              <View style={styles.breakingPill}>
                <Text style={styles.breakingPillText}>
                  {getCategoryNames(item.categories)[0] || 'TRENDING'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}
