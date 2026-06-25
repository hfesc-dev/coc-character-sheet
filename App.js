import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './src/theme';

// Mode & Auth Screens
import ModeSelectScreen from './src/screens/ModeSelectScreen';
import LoginScreen from './src/screens/LoginScreen';

// GM Screens
import GMDashboardScreen from './src/screens/GMDashboardScreen';
import AdventureDetailScreen from './src/screens/AdventureDetailScreen';

// Player Online Screens
import PlayerHubScreen from './src/screens/PlayerHubScreen';
import PlayerMessagesScreen from './src/screens/PlayerMessagesScreen';

// Offline / Character Screens
import MenuScreen from './src/screens/MenuScreen';
import GeneratorSetupScreen from './src/screens/GeneratorSetupScreen';
import GeneratorAttributesScreen from './src/screens/GeneratorAttributesScreen';
import GeneratorSkillsScreen from './src/screens/GeneratorSkillsScreen';
import GeneratorPulpScreen from './src/screens/GeneratorPulpScreen';
import GeneratorInfoScreen from './src/screens/GeneratorInfoScreen';

import HomeScreen from './src/screens/HomeScreen';
import SkillsScreen from './src/screens/SkillsScreen';
import CombatScreen from './src/screens/CombatScreen';
import BackgroundScreen from './src/screens/BackgroundScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CharacterSheetTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Attributes') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Skills') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Combat') {
            iconName = focused ? 'shield' : 'shield-outline';
          } else if (route.name === 'Background') {
            iconName = focused ? 'book' : 'book-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Attributes" component={HomeScreen} />
      <Tab.Screen name="Skills" component={SkillsScreen} />
      <Tab.Screen name="Combat" component={CombatScreen} />
      <Tab.Screen name="Background" component={BackgroundScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}>
        {/* Entry Point: Login */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ModeSelect" component={ModeSelectScreen} />

        {/* GM Mode Screens */}
        <Stack.Screen name="GMDashboard" component={GMDashboardScreen} />
        <Stack.Screen name="AdventureDetail" component={AdventureDetailScreen} />

        {/* Player Online Screens */}
        <Stack.Screen name="PlayerHub" component={PlayerHubScreen} />
        <Stack.Screen name="PlayerMessages" component={PlayerMessagesScreen} />

        {/* Offline / Character Management */}
        <Stack.Screen name="Menu" component={MenuScreen} />
        
        {/* Generator Wizard Stack */}
        <Stack.Screen name="GeneratorSetup" component={GeneratorSetupScreen} />
        <Stack.Screen name="GeneratorAttributes" component={GeneratorAttributesScreen} />
        <Stack.Screen name="GeneratorSkills" component={GeneratorSkillsScreen} />
        <Stack.Screen name="GeneratorPulp" component={GeneratorPulpScreen} />
        <Stack.Screen name="GeneratorInfo" component={GeneratorInfoScreen} />
        
        {/* The Final Character Sheet */}
        <Stack.Screen name="CharacterSheetTabs" component={CharacterSheetTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
