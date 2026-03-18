import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize } from '../constants/theme';
import { moderateScale } from '../utils/responsive';
import { RootStackParamList, TabParamList } from '../types';

import { HomeScreen } from '../screens/HomeScreen';
import { AchievementsScreen } from '../screens/AchievementsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { PetSelectionScreen } from '../screens/PetSelectionScreen';
import { OyunSecScreen } from '../screens/OyunSecScreen';
import { HaydiBesleScreen } from '../screens/HaydiBesleScreen';
import { TopYakalaScreen } from '../screens/TopYakalaScreen';
import { HizliDokunScreen } from '../screens/HizliDokunScreen';
import { HafizaEslestirmeScreen } from '../screens/HafizaEslestirmeScreen';
import { DinlenmeScreen } from '../screens/DinlenmeScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let icon: any;
          if (route.name === 'AnaSayfa') icon = focused ? 'home' : 'home-outline';
          else if (route.name === 'Basarimlar') icon = focused ? 'trophy' : 'trophy-outline';
          else if (route.name === 'Istatistikler') icon = focused ? 'stats-chart' : 'stats-chart-outline';
          return <Ionicons name={icon} size={moderateScale(24)} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 0,
          height: moderateScale(65), // 70 -> 65 (daha kompakt)
          paddingBottom: moderateScale(10),
          paddingTop: moderateScale(8),
          borderTopLeftRadius: moderateScale(25),
          borderTopRightRadius: moderateScale(25),
          position: 'absolute',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 15,
        },
        tabBarLabelStyle: { 
          fontSize: 10, // FontSize.xs yerine sabit 10 (daha net)
          fontWeight: '800', 
          marginTop: -4 
        },
      })}
    >
      <Tab.Screen name="AnaSayfa" component={HomeScreen} options={{ tabBarLabel: 'Ana Sayfa' }} />
      <Tab.Screen name="Basarimlar" component={AchievementsScreen} options={{ tabBarLabel: 'Başarımlar' }} />
      <Tab.Screen name="Istatistikler" component={ProfileScreen} options={{ tabBarLabel: 'İstatistik' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PetSelection" component={PetSelectionScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="AnaTab" component={TabNavigator} />
        <Stack.Screen name="HaydiBesle" component={HaydiBesleScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="OyunSec" component={OyunSecScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="TopYakala" component={TopYakalaScreen} />
        <Stack.Screen name="HizliDokun" component={HizliDokunScreen} />
        <Stack.Screen name="HafizaEslestirme" component={HafizaEslestirmeScreen} />
        <Stack.Screen name="Dinlenme" component={DinlenmeScreen} options={{ animation: 'fade' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
