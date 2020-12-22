
import React from 'react';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { StyleSheet, Text, View, Dimensions, Button} from 'react-native';
import MapView, {Polyline} from 'react-native-maps';
import Sliders from '../Sliders'
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';
const LOCATION_TRACKING = 'location-tracking';


export default function HomeScreen() {

  const [route, setRoute] = useState([]);
  const [userRoute, setUserRoute] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [distance, setDistance] = useState("waiting...");



  function handleRouteChange(newRoute, routeDistance) {
    setRoute(newRoute);
    setDistance(routeDistance);
  }

  const startLocationTracking = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 500,
      distanceInterval: 0,
    });
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    console.log('tracking started?', hasStarted);
  };

  const stopLocationTracking = async () => {
    Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
    setUserRoute([]);
  };

  const pauseLocationTracking = async () => {
    Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
  };

  

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
      
    })();
  }, []);

  let text = 'Waiting..';
  if (location) {
    text = location;
  }
  
  TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
      console.log('LOCATION_TRACKING task ERROR:', error);
      return;
    }
    if (data) {
      const { locations } = data;
      let newCoordinate = null;
      let ur = userRoute;
      for(let i = 0; i < locations.length; i++){
        let latitude = locations[i].coords.latitude;
        let longitude = locations[i].coords.longitude;
        newCoordinate = {
            latitude,
            longitude
          }
        ur = ur.concat([newCoordinate])
      }
      setUserRoute(ur);
    }
  });

  return (
    <View style={styles.container}>
     

      <View >
      <MapView style={styles.mapStyle}
      showsUserLocation
    initialRegion={{
      latitude: 37.435120,
      longitude: -122.200420,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}>
      
 <Polyline coordinates={route} strokeColor='#0cf' strokeWidth={5} lineDashPattern={[3, 3]} />
 <Polyline coordinates={userRoute} strokeColor='#0cf' strokeWidth={5} />
  </MapView>
<Sliders position={location} onChange={handleRouteChange}/>

<Button title="Start tracking" onPress={startLocationTracking} />
<Button title="pause tracking" onPress={pauseLocationTracking} />
<Button title="Stop tracking" onPress={stopLocationTracking} />
         

      </View>
      
          <Text>{distance}</Text>
          <Text>{JSON.stringify(userRoute)}</Text>
      
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


