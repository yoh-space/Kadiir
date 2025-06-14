import React, { useState, useEffect } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions, ScrollView, StatusBar } from 'react-native';
import MainTabNavigator from './MainTabNavigator';
import SettingScreen from '../screens/SettingScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import Rateus from '../screens/Rateus';
import { Ionicons, MaterialIcons, FontAwesome5, Feather, AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');
const Drawer = createDrawerNavigator();

const AnimatedDrawerItem = Animated.createAnimatedComponent(DrawerItem);

function CustomDrawerContent(props) {
  const [activeRoute, setActiveRoute] = useState('Home');
  const [animationValues] = useState(() => 
    props.state.routes.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    // Animate all items when drawer opens
    animationValues.forEach((val, index) => {
      Animated.spring(val, {
        toValue: 1,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handlePress = (routeName, screenName) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveRoute(routeName);
    props.navigation.navigate(screenName);
  };

  const renderIcon = (name, focused) => {
    const iconSize = width < 400 ? 20 : 24; // Adjust icon size based on screen width
    const iconColor = focused ? '#FF6B6B' : '#E0E0E0';
    
    switch (name) {
      case 'Home':
        return <Ionicons name={focused ? "home" : "home-outline"} size={iconSize} color={iconColor} />;
      case 'Favorites':
        return <Ionicons name={focused ? "heart" : "heart-outline"} size={iconSize} color={iconColor} />;
      case 'Popular':
        return <Ionicons name={focused ? "fire" : "flame-outline"} size={iconSize} color={iconColor} />;
      case 'Profile':
        return <Ionicons name={focused ? "person" : "person-outline"} size={iconSize} color={iconColor} />;
      case 'Settings':
        return <Ionicons name={focused ? "settings" : "settings-outline"} size={iconSize} color={iconColor} />;
      case 'About':
        return <Ionicons name={focused ? "information-circle" : "information-circle-outline"} size={iconSize} color={iconColor} />;
      case 'Contact us':
        return <Ionicons name={focused ? "call" : "call-outline"} size={iconSize} color={iconColor} />;
      case 'Rate us':
        return <AntDesign name={focused ? "star" : "staro"} size={iconSize} color={iconColor} />;
      default:
        return <Feather name="circle" size={iconSize} color={iconColor} />;
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#1E1E2D" barStyle="light-content" animated={true} />
      <DrawerContentScrollView 
        {...props} 
        contentContainerStyle={styles.scrollContainer}
        scrollEnabled={true}
      >
        <View style={styles.drawerContent}>
          {/* Animated Header */}
          <Animated.View style={[styles.drawerHeader, {
            transform: [{
              translateX: animationValues[0].interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0]
              })
            }]
          }]}>
            <View style={styles.avatarContainer}>
              <Image 
                source={require('../assets/image.png')} 
                style={styles.avatar} 
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={{ marginLeft: 16 }}>
              <Text style={styles.drawerName}>Kadiir Blog</Text>
              <Text style={styles.drawerEmail}>info@kadiir.com</Text>
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => props.navigation.closeDrawer()}
              activeOpacity={0.7}
            >
              <Feather name="x" size={width < 400 ? 20 : 24} color="#E0E0E0" />
            </TouchableOpacity>
          </Animated.View>

          {/* Main Options */}
          <View style={styles.drawerSection}>
            {props.state.routes.slice(0, 5).map((route, index) => {
              const focused = activeRoute === route.name;
              return (
                <AnimatedDrawerItem
                  key={route.key}
                  label={route.name}
                  labelStyle={[
                    styles.drawerLabel,
                    focused && styles.activeLabel
                  ]}
                  icon={() => renderIcon(route.name, focused)}
                  onPress={() => handlePress(route.name, route.name)}
                  style={[
                    styles.drawerItem,
                    focused && styles.activeItem,
                    {
                      transform: [{
                        translateX: animationValues[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [-50, 0]
                        })
                      }],
                      opacity: animationValues[index]
                    }
                  ]}
                />
              );
            })}
          </View>

          {/* Divider with animation */}
          <Animated.View style={[styles.divider, {
            opacity: animationValues[5],
            transform: [{
              scaleX: animationValues[5].interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
              })
            }]
          }]} />

          {/* Other Options */}
          <View style={styles.drawerSection}>
            {props.state.routes.slice(5).map((route, index) => {
              const focused = activeRoute === route.name;
              const animIndex = index + 5;
              return (
                <AnimatedDrawerItem
                  key={route.key}
                  label={route.name}
                  labelStyle={[
                    styles.drawerLabel,
                    focused && styles.activeLabel
                  ]}
                  icon={() => renderIcon(route.name, focused)}
                  onPress={() => handlePress(route.name, route.name)}
                  style={[
                    styles.drawerItem,
                    focused && styles.activeItem,
                    {
                      transform: [{
                        translateX: animationValues[animIndex].interpolate({
                          inputRange: [0, 1],
                          outputRange: [-50, 0]
                        })
                      }],
                      opacity: animationValues[animIndex]
                    }
                  ]}
                />
              );
            })}
          </View>

          {/* Logout at the bottom */}
          <Animated.View style={[styles.logoutSection, {
            opacity: animationValues[animationValues.length - 1],
            transform: [{
              translateY: animationValues[animationValues.length - 1].interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })
            }]
          }]}>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                // Add logout logic here
              }}
              activeOpacity={0.6}
            >
              <MaterialIcons name="logout" size={width < 400 ? 20 : 24} color="#FF6B6B" />
              <Text style={styles.logoutText}>Logout</Text>
              <View style={styles.logoutArrow}>
                <Feather name="arrow-right" size={width < 400 ? 16 : 20} color="#FF6B6B" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </DrawerContentScrollView>
    </>
  );
}

export default function AppDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#FF6B6B',
        drawerInactiveTintColor: '#E0E0E0',
        drawerStyle: {
          backgroundColor: 'transparent',
          width: width * 0.8,
        },
        sceneContainerStyle: {
          backgroundColor: '#1E1E2D',
        },
        overlayColor: 'rgba(0,0,0,0.7)',
        drawerType: 'slide',
        edgeWidth: 100,
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen name="Home" component={MainTabNavigator} />
      <Drawer.Screen name="Favorites" component={require('../screens/FavoritesScreen').default} />
      <Drawer.Screen name="Popular" component={require('../screens/PopularScreen').default} />
      <Drawer.Screen name="Profile" component={require('../screens/ProfileScreen').default} />
      <Drawer.Screen name="Settings" component={SettingScreen} />
      <Drawer.Screen name="About" component={require('../screens/AboutScreen').default} />
      <Drawer.Screen name="Contact us" component={require('../screens/ContactScreen').default} />
      <Drawer.Screen name="Rate us" component={Rateus} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    height:'100%',
    backgroundColor: '#1E1E2D',
  },
  drawerContent: {
    flex: 1,
    paddingBottom: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252538',
    paddingVertical: height * 0.03, // Responsive padding
    paddingHorizontal: width * 0.05,
    borderBottomRightRadius: 20,
    marginBottom: height * 0.02,
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    borderWidth: 3,
    borderColor: '#3A3A4A',
    maxWidth: 60,
    maxHeight: 60,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: width * 0.035,
    height: width * 0.035,
    borderRadius: width * 0.0175,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#252538',
    maxWidth: 14,
    maxHeight: 14,
  },
  drawerName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: width < 400 ? 16 : 18,
    marginBottom: 4,
    fontFamily: 'sans-serif-medium',
  },
  drawerEmail: {
    color: '#A0A0A0',
    fontSize: width < 400 ? 12 : 14,
    fontFamily: 'sans-serif',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  drawerSection: {
    marginBottom: height * 0.015,
  },
  drawerItem: {
    borderRadius: 12,
    marginHorizontal: width * 0.025,
    marginVertical: 4,
    paddingLeft: width * 0.025,
  },
  activeItem: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
  },
  drawerLabel: {
    fontSize: width < 400 ? 14 : 16,
    fontWeight: '500',
    color: '#E0E0E0',
    marginLeft: -8,
    fontFamily: 'sans-serif-medium',
  },
  activeLabel: {
    color: '#FF6B6B',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: height * 0.015,
    marginHorizontal: width * 0.05,
  },
  logoutSection: {
    marginTop: 'auto',
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.05,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: width < 400 ? 14 : 16,
    fontWeight: '500',
    marginLeft: 10,
    flex: 1,
  },
  logoutArrow: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: width * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 30,
    maxHeight: 30,
  },
});