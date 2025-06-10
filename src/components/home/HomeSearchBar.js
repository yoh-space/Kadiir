import React from 'react';
import { Animated, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeSearchBar({ searchAnim, theme, searchText, setSearchText }) {
  return (
    <Animated.View 
      style={[
        { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 25, marginHorizontal: 20, marginBottom: 15, paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1, borderColor: 'rgba(255,58,68,0.3)', opacity: searchAnim,
          transform: [
            { 
              translateY: searchAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]
              }) 
            }
          ]
        }
      ]}
    >
      <Ionicons name="search" size={22} color="#FF3A44" style={{ marginRight: 10 }} />
      <TextInput
        style={{ flex: 1, fontSize: 16, fontWeight: 'bold', paddingVertical: 0, backgroundColor: 'transparent', color: theme.text }}
        placeholder="SEARCH CRAZY ARTICLES..."
        placeholderTextColor="#bbb"
        value={searchText}
        onChangeText={setSearchText}
        autoFocus={false}
        clearButtonMode="while-editing"
      />
    </Animated.View>
  );
}
