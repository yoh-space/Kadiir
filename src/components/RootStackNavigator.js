import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import PostScreen from '../screens/PostScreen';
import { useTheme } from '../screens/SettingScreen';

const Stack = createNativeStackNavigator();

export default function RootStackNavigator() {
  const { isDark } = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Post" component={PostScreen}
        options={{
          title: 'Post',
          headerStyle: {
            backgroundColor: isDark ? '#181a20' : 'darkgreen',
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 18,
            elevation: 3
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22, marginTop: 0 },
        }}
      />
    </Stack.Navigator>
  );
}
