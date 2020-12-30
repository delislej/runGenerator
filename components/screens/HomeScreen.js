
import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { StyleSheet, Text, View, Dimensions, Button,  ScrollView} from 'react-native';
import MapView, {Polyline, Marker} from 'react-native-maps';
import Sliders from '../Sliders'
import {calcDistance, decodePoly} from '../../Utils/Route'
import {storeHistory, getHistory} from '../../Utils/dataManagement'
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';
import {Context} from '../../context/Store'


const LOCATION_TRACKING = 'location-tracking';



export default function HomeScreen(props) {
  const [userRoute, setUserRoute] = useState([]);
  const [location, setLocation] = useState(null);
  const [distanceTravelled, setDistanceTravelled] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [accuracy, setAccuracy] = useState(0)
  const [distance, setDistance] = useState(0);
  const [trackingState, setTrackingState] = useState('stopped')
  const [state, dispatch] = useContext(Context);
  

  function handleRouteChange(newRoute, routeDistance) {
    dispatch({type: 'SELECT_ROUTE', payload: newRoute});
    setDistance(routeDistance);
  }

  function saveRoute() {
    if(state.currentRoute === ''){
      return;
    }
    dispatch({type: 'ADD_ROUTE', payload: state.currentRoute});
  }


  function getCurrentRoute() {
    if(state.currentRoute === ''){
      return [];
    }
    else{
      return decodePoly(state.currentRoute)
    }
  }

  const startLocationTracking = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING,{
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 500,
      distanceInterval: 0,
      showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'Run Generator',
          notificationColor: '#0EE',
        },
    });
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    setTrackingState('started')
  };

  const stopLocationTracking = async () => {
    if(trackingState != 'paused'){
    Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
    setUserRoute([]);
    setTrackingState('stopped')
  }
  else{
    setTrackingState('stopped')
  }
  };

  const pauseLocationTracking = async () => {
    Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
    setTrackingState('paused')
  };

  useEffect(() => {
    (async () => {
      let lines = []
      lines = await getHistory()
      dispatch({type: 'SET_ROUTES', payload: lines});
      let { status } = await Location.requestPermissionsAsync();
    Permissions.askAsync(Permissions.LOCATION)
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })
    
    ();
  }, []);

  TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
      console.log('LOCATION_TRACKING task ERROR:', error);
      return;
    }
    if (data) {
      const { locations } = data;
      let ur = userRoute;
      for(let i = 0; i < locations.length; i++){
          //console.log(locations[i])
        setAccuracy(locations[i].coords.accuracy)
        if(locations[i].coords.accuracy > 10 || locations[i].coords.speed < .333){
            continue;
        }
        let longitude = locations[i].coords.longitude;
        let latitude = locations[i].coords.latitude;
        newCoordinate = {
            latitude,
            longitude
          }
          if(ur.length > 1){
          setDistanceTravelled(distanceTravelled + calcDistance(newCoordinate, ur[ur.length-1]));
        }
        ur = ur.concat([newCoordinate])
      }
      setUserRoute(ur);
    }
  });

  let stoppedButtons = <Button title="Start tracking" onPress={startLocationTracking} />
  let pausedButtons = [<Button title="Resume tracking" onPress={startLocationTracking} key={0}/>,<Button title="Stop tracking" onPress={stopLocationTracking} key={1}/>];
  let startedButtons = <Button title="pause tracking" onPress={pauseLocationTracking} />
  

  function renderSwitch(trackingState) {
    switch(trackingState) {
      case 'stopped':
        return stoppedButtons;
      case 'started':
        return startedButtons;
      case 'paused':
        return pausedButtons;
      default:
        return stoppedButtons;
    }
  }
  
  


  return (
    <View style={styles.container}>
      <View >
      <MapView style={styles.mapStyle}
      showsUserLocation
      followsUserLocation
    initialRegion={{
      latitude: 37.435120,
      longitude: -122.200420,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}>
      
 <Polyline coordinates={getCurrentRoute()} strokeColor='#0cf' strokeWidth={5} lineDashPattern={[3, 3]} />
 <Polyline coordinates={userRoute} strokeColor='#000' strokeWidth={5} />
  </MapView>
<Sliders position={location} onChange={handleRouteChange}/>

{renderSwitch(trackingState)}
<Button title="Save Route" onPress={saveRoute} />
<Button
        title="Clear History"
        onPress={() => {dispatch({type: 'CLEAR_ROUTES', payload: []});}}
      />
      </View>
      <Text>Route length: {distance.toFixed(2)} mi</Text>
      <Text>Current Accuracy: {accuracy.toFixed(1)}</Text>
      <Text>Distance traveled: {distanceTravelled.toFixed(2)}</Text>
    
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
    
  margin: 10,
    
  },mapStyle: {
    width: Dimensions.get('window').width-20,
    height: Dimensions.get('window').height/2,
    
  },
  interfaceStyle: {
    width: Dimensions.get('window').width/3,
    
  }
});


