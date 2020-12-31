import React, { Component } from 'react'
import MapView, { Polyline } from 'react-native-maps'
class Map extends Component {

    constructor() {
        super()
        this.mapRef = null;
        console.log("making card")
    }

    render() {
      return    <MapView style={{flex: 1}}
                    ref={(ref) => { this.mapRef = ref }}
                    onLayout = {() => this.mapRef.fitToCoordinates(this.props.myLatLongs, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })}>
                    <Polyline coordinates={this.props.myLatLongs} strokeWidth={4} strokeColor="#2962FF" /> 
                </MapView>
    }
}
export default Map