import React, { Component } from 'react'
import { Card } from 'react-native-paper'
import { StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import { decodePoly } from '../Utils/Route'

const AppButton = ({ onPress, title }) => (
  <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);

class HistoryCard extends Component {
  state = { line: [] }
  componentDidMount () {
    const poly = decodePoly(this.props.line, false)
    this.setState({ line: poly })
  }

  

  render () {
    return (

      <Card style={styles.card}>

        
            <MapView
              style={styles.mapStyle} ref={(ref) => { this.mapRef = ref }} onMapReady={() => {
                this.mapRef.fitToCoordinates(this.state.line, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })
              }}
            >

              <Polyline
                coordinates={this.state.line}
                strokeColor='#000' // fallback for when `strokeColors` is not supported by the map-provider
                strokeColors={[
                  '#7F0000',
                  '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                  '#B24112',
                  '#E5845C',
                  '#238C23',
                  '#7F0000'
                ]}
                strokeWidth={6}
              />
            </MapView>
            <AppButton title="Select Route"/>
            <AppButton title="Delete Route"/>
      </Card>

    )
  }
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

export default HistoryCard
