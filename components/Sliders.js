import { useState } from 'react';
import React from 'react';
import { StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import Slider from 'react-native-slider';
import {getRoute, decodePoly} from '../Utils/Route'


export default function Sliders(props) {
  const [distance, setDistance] = useState(1);
  const [tolerance, setTolerance] = useState(1);
  let location = props.position
  return (
      <View>
    <Text style={{ color: '#acacac' }}>Distance: {distance} mi</Text>
          <Slider
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
<Text style={{ color: '#acacac' }}>tolerance: {tolerance} %</Text>
<Slider
            minimumValue={5}
            maximumValue={20}
            minimumTrackTintColor='#1EB1FC'
            maximumTractTintColor='#1EB1FC'
            step={1}
            value={5}
            onValueChange={value => setTolerance(value)}
            style={styles.slider}
            thumbTintColor='#1EB1FC'
          />

          <Button
            color='#001584'
            backgroundColor='#acacac'
            mode='contained'
            onPress={async () => {
              
              let max = distance+distance*(tolerance/100)
              let route = await getRoute( location.coords.longitude, location.coords.latitude, distance*1000, 20, Math.trunc(1 + Math.random() * (100000 - 1)))
              let saved = null;
              let savedDistance = Number.MAX_SAFE_INTEGER;
              for(let i = 0; i < 20; i++){
                if(route.segments[0].distance <= max && route.segments[0].distance >= distance){
                  saved = route
                  break
                }
                if(i == 0){
                  saved = route
                }
                else if(Math.abs(route.segments[0].distance - distance) < savedDistance && route.segments[0].distance >= distance)
                {
                  saved = route
                  savedDistance = Math.abs(distance - route.segments[0].distance)
                }
                route = await getRoute( location.coords.longitude, location.coords.latitude, distance*1000, 20, Math.trunc(1 + Math.random() * (100000 - 1)))
              }
              
              props.onChange(decodePoly(saved.geometry, false), saved.segments[0].distance)
            }}
            title="Find Route"
          >
            
          </Button>
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
