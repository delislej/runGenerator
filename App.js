
import React from 'react';
import HomeScreen from './components/screens/HomeScreen'
import HistoryScreen from './components/screens/HistoryScreen'
import Store from './context/Store'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
export default function App() {

  const Tab = createBottomTabNavigator();
  const [route, updateRoute] = useState([])
    function update(route) {
        updateRoute(route)
    }
  return (
    <Store>
    <NavigationContainer>
    <Tab.Navigator>
    <Tab.Screen name="home" component={HomeScreen} />
    <Tab.Screen name="history" component={HistoryScreen} />
    </Tab.Navigator>
  </NavigationContainer>
  </Store>
    
    
  );
}






