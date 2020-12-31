
import React from 'react';
import HomeScreen from './components/screens/HomeScreen'
import HistoryScreen from './components/screens/HistoryScreen'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Store from './context/Store'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default function App() {

  const Tab = createBottomTabNavigator();
  
  return (
    <Store>
    <NavigationContainer>
    <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                if (route.name === 'home') {
                  iconName = focused
                    ? 'home'
                    : 'home';
                } else if (route.name === 'history') {
                  iconName = focused ? 'save' : 'save';
                }
    
                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
    >
    <Tab.Screen name="home" component={HomeScreen} />
    <Tab.Screen name="history" component={HistoryScreen} />
    </Tab.Navigator>
  </NavigationContainer>
  </Store>
    
    
  );
}






