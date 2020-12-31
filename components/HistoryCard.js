import React from 'react'
import { Card } from 'react-native-paper'
import { StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import { decodePoly } from '../Utils/Route'



export default function HistoryCard(props) {
    return (
      <Card style={styles.card}>

 
<MapView style={styles.mapStyle}
      showsUserLocation
      followsUserLocation
    initialRegion={{
      latitude: decodePoly(props.line)[0].latitude,
      longitude: -122.200420,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }} ref={(ref) => { this.mapRef = ref }} onMapReady={() => {
      this.mapRef.fitToCoordinates(decodePoly(props.line), { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })
    }} pitchEnabled={false} rotateEnabled={false} scrollEnabled={false} zoomEnabled={false}>

              <Polyline
                coordinates={decodePoly(props.line, false)}
                strokeColor='#000' // fallback for when `strokeColors` is not supported by the map-provider
                strokeWidth={6}
              />
            </MapView>
            

            <TouchableOpacity onPress={()=>{props.test('select', props.id, props.line)}} style={styles.appButtonContainer}>
            <Text style={styles.appButtonText}>select</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{props.test('delete', props.id, props.line)}} style={styles.appButtonContainer}>
            <Text style={styles.appButtonText}>delete</Text>
            </TouchableOpacity>
            
      </Card>

    )
  }

const styles = StyleSheet.create({
  mapStyle: {
    paddingTop: 10,
    paddingLeft: 10,
    width: Dimensions.get('window').width-40,
    height: Dimensions.get('window').height / 4
  },
  card: {
    borderRadius: 8,
    width: Dimensions.get('window').width-20,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 20,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 40,
    backgroundColor: '#acacac'
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: Dimensions.get('window').width-40
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: 'center',
    textTransform: "uppercase"
  }
  

})

