import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeOnlyForYou({ onlyForYou, navigation, theme, styles, selectedCategory }) {
  if (selectedCategory !== 'All') return null;
  return (
    <>
      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>✨ ONLY FOR YOU</Text>
        <TouchableOpacity 
          style={styles.seeAllButton}
          onPress={() => navigation.navigate('BlogList', { category: 'Academics' })}
        >
          <Text style={[styles.seeAll, { color: theme.color }]}>SEE ALL</Text>
          <Ionicons name="arrow-forward" size={16} color={theme.color} />
        </TouchableOpacity>
      </View>
      <View style={styles.forYouContainer}>
        {onlyForYou.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.forYouCard}
            onPress={() => navigation.navigate('Post', { post: item })}
            activeOpacity={0.85}
          >
            {item._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
              <Image 
                source={{ uri: item._embedded['wp:featuredmedia'][0].source_url }} 
                style={styles.forYouImage} 
              />
            )}
            <View style={styles.forYouTextContainer}>
              <Text style={styles.forYouCategory}>KADIIR EXCLUSIVE</Text>
              <Text style={[styles.forYouTitle, { color: theme.text }]} numberOfLines={2}>
                {item.title.rendered}
              </Text>
              <View style={styles.forYouMetaContainer}>
                <Ionicons name="person-circle" size={18} color="#FF3A44" />
                <Text style={[styles.forYouMeta, { color: theme.text }]}>KADIIR ABDULATIF</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
