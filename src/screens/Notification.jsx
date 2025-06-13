import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { useTheme } from './SettingScreen'; // Adjust the import path as necessary
import useWordPressApi from '../hooks/useWordPressApi';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function Notification({ navigation }) {
    const { theme } = useTheme();
    const { posts } = useWordPressApi();
    const [newPosts, setNewPosts] = useState([]);
    const lastSeenPostId = useRef(null);

    useEffect(() => {
        // On mount, set last seen post id
        if (posts && posts.length > 0 && lastSeenPostId.current === null) {
            lastSeenPostId.current = posts[0].id;
        }
    }, [posts]);

    useFocusEffect(
        React.useCallback(() => {
            // On screen focus, set last seen post id if not set
            if (posts && posts.length > 0 && lastSeenPostId.current === null) {
                lastSeenPostId.current = posts[0].id;
            }
        }, [posts])
    );

    useEffect(() => {
        // Check for new posts
        if (posts && posts.length > 0 && lastSeenPostId.current !== null) {
            const newOnes = posts.filter(p => p.id > lastSeenPostId.current);
            setNewPosts(newOnes);
        }
    }, [posts]);

    const handleMarkAllAsRead = () => {
        if (posts && posts.length > 0) {
            lastSeenPostId.current = posts[0].id;
            setNewPosts([]);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: theme.background }}>
            <StatusBar backgroundColor={theme.background} barStyle={theme.dark ? 'light-content' : 'dark-content'} animated={true} />
            {newPosts.length > 0 ? (
                <View style={{ marginTop: 30, alignItems: 'center' }}>
                    <Ionicons name="notifications" size={48} color="#1db954" />
                    <Text style={{ color: theme.text, fontSize: 18, marginTop: 10, fontWeight: 'bold' }}>You have {newPosts.length} new post{newPosts.length > 1 ? 's' : ''}!</Text>
                    <TouchableOpacity onPress={handleMarkAllAsRead} style={{ marginTop: 16, backgroundColor: '#1db954', borderRadius: 20, paddingHorizontal: 24, paddingVertical: 10 }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Mark all as read</Text>
                    </TouchableOpacity>
                    <View style={{ marginTop: 24, width: '90%' }}>
                        {newPosts.map(post => (
                            <View key={post.id} style={{ backgroundColor: theme.background, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#1db954' }}>
                                <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 16 }}>{post.title.rendered}</Text>
                                <Text style={{ color: theme.text, fontSize: 13, marginTop: 4 }}>{new Date(post.date).toLocaleString()}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            ) : (
                <View style={{ marginTop: 40, alignItems: 'center' }}>
                    <Ionicons name="notifications-outline" size={48} color={theme.text} />
                    <Text style={{ marginTop: 20, color: theme.text, fontSize: 16 }}>No new notifications at the moment.</Text>
                </View>
            )}
        </SafeAreaView>
    );
}