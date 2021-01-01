import { useState, useCallback } from 'react';
import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import RangeSlider from 'react-native-range-slider-expo';
import {getRoute} from '../Utils/Route'


export default function Sliders(props) {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(10);
  


  let location = props.position
  return (
      <View>
        <Text style={{ color: '#000' }}>Select Distance Range:</Text>
                    <RangeSlider min={1} max={10}
                         fromValueOnChange={value => setMin(value)}
                         toValueOnChange={value => setMax(value)}
                         initialFromValue={1} styleSize='small' showRangeLabels={false} step={.25}
                    />
          <TouchableOpacity onPress={async () => {
              
              
              let route = await getRoute( location.coords.longitude, location.coords.latitude, min*1000, 20, Math.trunc(1 + Math.random() * (100000 - 1)))
              let saved = null;
              let savedDistance = Number.MAX_SAFE_INTEGER;
              for(let i = 0; i < 20; i++){
                if(route.segments[0].distance <= max && route.segments[0].distance >= min){
                  saved = route
                  break
                }
                if(i == 0){
                  saved = route
                }
                else if(Math.abs(route.segments[0].distance - min) < savedDistance && route.segments[0].distance >= min)
                {
                  saved = route
                  savedDistance = Math.abs(min - route.segments[0].distance)
                }
                route = await getRoute( location.coords.longitude, location.coords.latitude, min*1000, 20, Math.trunc(1 + Math.random() * (100000 - 1)))
              }
              
              props.onChange(saved.geometry)
            }} style={styles.appButtonContainer}>
  <Text style={styles.appButtonText}>Find Route</Text>
  </TouchableOpacity>
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
    
  },appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: Dimensions.get('window').width-20
  },
  appButtonText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    textAlign: 'center',
    textTransform: "uppercase"
  }
});
