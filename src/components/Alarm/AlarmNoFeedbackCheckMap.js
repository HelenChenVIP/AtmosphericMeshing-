//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions} from 'react-native';

import {MapView, Marker, Polyline} from 'react-native-amap3d';
const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
// create a component
class AlarmNoFeedbackCheckMap extends PureComponent {
    constructor(props) {
        super(props);
        console.log(props); 
        this.state = {        
            rotateEnabled: false,//地图旋转
            longitude: '',
            latitude: '',
         
        }
      }
    render() {
        return (
            <MapView 
            zoomLevel={13} 
            locationEnabled={true}
            showsLocationButton={true}
            rotateEnabled={this.state.rotateEnabled}    
            onLocation={({ nativeEvent }) =>
            {
              this.setState({
                longitude: nativeEvent.longitude,
                latitude: nativeEvent.latitude
              });
              this.props.onstateChange(nativeEvent.longitude,nativeEvent.latitude);
            }}   
            coordinate={{
              latitude: this.state.latitude ? this.state.latitude : 35.103663,
              longitude: this.state.longitude ? this.state.longitude : 118.356618,
            }}
            style={{width:SCREEN_WIDTH,height:150,borderColor:'#dedede',borderWidth:1}}>
          </MapView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default AlarmNoFeedbackCheckMap;
