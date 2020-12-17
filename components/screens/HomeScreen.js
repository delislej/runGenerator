import { useState, useEffect } from 'react';
import React from 'react';
import * as Location from 'expo-location';

import { StyleSheet, Text, View, Dimensions} from 'react-native';
import MapView, {Polyline} from 'react-native-maps';
import Sliders from '../Sliders'


export default function HomeScreen() {

  const [route, setRoute] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  function handleRouteChange(newRoute) {
    setRoute(newRoute);
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  

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
  </MapView>
<Sliders position={location} onChange={handleRouteChange}/>

         

      </View>
      
          <Text>{text}</Text>
      
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
