
import React from 'react';
import { useState, useEffect, useContext } from 'react';
import * as Location from 'expo-location';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity} from 'react-native';
import MapView, {Polyline, Marker} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sliders from '../Sliders'
import {calcDistance, calcRouteDistance, decodePoly} from '../../Utils/Route'
import {getHistory} from '../../Utils/dataManagement'
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
  

  function handleRouteChange(newRoute) {
    dispatch({type: 'SELECT_ROUTE', payload: newRoute});
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
    setDistanceTravelled(0.0)
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

  function getMap(loc) {
    if(loc !== null){
      return [<MapView key={0} style={styles.mapStyle}
      showsUserLocation
      followsUserLocation={true}
    initialRegion={{
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}>
      
    <Polyline coordinates={getCurrentRoute()} strokeColor='#0cf' strokeWidth={5} lineDashPattern={[3, 3]} />
    <Polyline coordinates={userRoute} strokeColor='#000' strokeWidth={5} />
    </MapView>]
    }
    else{
      return <Text key={6651864}>loading!</Text>
    }
  }


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      Permissions.askAsync(Permissions.LOCATION)
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      let lines = []
      lines = await getHistory()
      dispatch({type: 'SET_ROUTES', payload: lines});
     
      
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

  let stoppedButtons = <TouchableOpacity onPress={() => {startLocationTracking()}} style={styles.startButtonContainer}>
     <Ionicons name={"md-play"} size={20} color={'#fff'} />
    </TouchableOpacity>
  
  let pausedButtons = [<TouchableOpacity key={123}onPress={() => {startLocationTracking()}} style={styles.startButtonContainer}>
    <Ionicons name={"md-play"} size={20} color={'#fff'} />
    </TouchableOpacity>,<TouchableOpacity key={456} onPress={() => {stopLocationTracking()}} style={styles.stopButtonContainer}>
    
    <Ionicons name={"md-stop"} size={20} color={'#fff'} />
    </TouchableOpacity>];
  let startedButtons = <TouchableOpacity onPress={() => {pauseLocationTracking()}} style={styles.pauseButtonContainer}>
  <Ionicons name={"md-pause"} size={20} color={'#fff'} />
  </TouchableOpacity>
  

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
      {getMap(location)}
      <Text>Route length: {state.currentRouteDistance.toFixed(2)} mi</Text>
      <Text>Distance traveled: {distanceTravelled.toFixed(2)}</Text>
<Sliders position={location} onChange={handleRouteChange}/>
<TouchableOpacity onPress={() => {saveRoute()}} style={styles.saveButtonContainer}>
    <Text style={styles.appButtonText}>Save Route</Text>
    </TouchableOpacity>
      <View style={styles.trackingContainer}>
      
{renderSwitch(trackingState)}

</View>
      
    
    </View>
    
  );
}



const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height*(2/3),
    alignItems: 'stretch',
    justifyContent: 'center',
    
  margin: 10,
  marginTop: 50,
  },
  trackingContainer: {
    
    
    flex: 1,
    justifyContent:"space-evenly",
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 40,
      padding: 10,
    
  },
    
    
  mapStyle: {
    
    width: Dimensions.get('window').width-20,
    height: Dimensions.get('window').height/3,
    
  },
  interfaceStyle: {
    width: Dimensions.get('window').width/3,
    
  },
  pauseButtonContainer: {
    elevation: 8,
    backgroundColor: "#dddd00",
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 100,
    width:65,
    height:65
  },
  saveButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: Dimensions.get('window').width-20
  },
  findButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: Dimensions.get('window').width-20
  },
  startButtonContainer: {
    elevation: 8,
    backgroundColor: "#00cc88",
    borderRadius: 100,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems:'center',
    justifyContent:'center',
    width:65,
    height:65
  },
  stopButtonContainer: {
    elevation: 8,
    backgroundColor: "#cc0000",
    borderRadius: 100,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems:'center',
    justifyContent:'center',
    width:65,
    height:65
  },
  appButtonText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    textAlign: 'center',
    textTransform: "uppercase"
  }
});


