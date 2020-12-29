
import React from 'react';
import HomeScreen from './components/screens/HomeScreen'
import HistoryScreen from './components/screens/HistoryScreen'
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
export default function App() {

  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
    <Tab.Navigator>
    <Tab.Screen name="home" component={HomeScreen} />
    <Tab.Screen name="history" component={HistoryScreen} />
    </Tab.Navigator>
  </NavigationContainer>
    
    
  );
}






