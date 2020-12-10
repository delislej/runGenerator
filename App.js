import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import React from 'react';
import { StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import { getRoute, decodePoly, calcDistance } from './Utils/Route'
import MapView, {Polyline} from 'react-native-maps';
import Slider from 'react-native-slider';


export default function App() {

  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);

  
  

  return (
    <View style={styles.container}>
      <Text>working on your app!</Text>

      <View>

          <Text style={{ color: '#acacac' }}>Distance: {distance} mi</Text>
          <Slider
          style={{width: Dimensions.width /2, height: 40}}
            minimumValue={1}
            maximumValue={10}
            minimumTrackTintColor='#1EB1FC'
            maximumTractTintColor='#1EB1FC'
            step={0.5}
            value={1}
            onValueChange={value => setDistance(value)}
            style={styles.slider}
            thumbTintColor='#1EB1FC'
          />
          
          <Button
            color='#001584'
            backgroundColor='#acacac'
            mode='contained'
            onPress={async () => {
              const route = await getRoute( -122.200420, 37.435120, distance*1000, 20, Math.trunc(1 + Math.random() * (100000 - 1)))
              setRoute(route)
            }}
            title="Find Route"
          >
            
          </Button>

        </View>
      
      <MapView style={styles.mapStyle}
    initialRegion={{
      latitude: 37.435120,
      longitude: -122.200420,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}

   
  >
 <Polyline coordinates={route} strokeColor='#0cf' strokeWidth={5} lineDashPattern={[3, 3]} />

  </MapView>
      <StatusBar style="auto" />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height/2,
  }
});
