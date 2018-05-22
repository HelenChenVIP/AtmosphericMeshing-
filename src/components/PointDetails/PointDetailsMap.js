//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {MapView, Marker, Polyline} from 'react-native-amap3d';
import coordinate from '../../utils/coordinate';

/**
 * 站点详情-地图
 * Helenchen
 * @class PointDetailsMap
 * @extends {Component}
 */
class PointDetailsMap extends Component {
    constructor(props) {
        super(props); 
        this.state = {        
            rotateEnabled: false,//地图旋转
            pressPollutantCode:'AQI',
            avglat:36.887208,
            avglong:120.519118,
            czlat:0.05,
            czlong:0.05,
            activecode:'',
            monitorTime:''
        }
      }
    render() {
        let pointDetails=this.props.pointDetails;
        return (
            <MapView 
            zoomLevel={11} 
            rotateEnabled={this.state.rotateEnabled}      
            style={StyleSheet.absoluteFill}
            region={
                {latitude: this.state.avglat,
                longitude: this.state.avglong,
                latitudeDelta: this.state.czlat,
                longitudeDelta: this.state.czlong,}
            }>
            {   this.props.pointDetails ? 
                //循环渲染Marker 
                this._renderMarker() :<Marker 
                coordinate={{
                    latitude: 35.035278,
                    longitude: 118.476389,
                }} 
                icon={() =><View >
                    <Text>{}</Text>      
                </View>}
            />
            }
            </MapView>
        );
    }
     //循环渲染Marker
     _renderMarker = () =>{
        let rtnVal = [];
            if(this.props.pointDetails.fillIcon!=null && this.props.pointDetails.fillIcon!=''){
                let mLat;
                let mLon;
                let mLonAndmLat;
                //将84坐标改为高德坐标
                mLonAndmLat=coordinate.wgs84togcj02(this.props.pointDetails.longitude,this.props.pointDetails.latitude);
                rtnVal.push(
                <Marker   
                image={
                    this.props.pointDetails.fillIcon
                }
                coordinate={{
                latitude: mLonAndmLat[1],
                longitude: mLonAndmLat[0],}}>
               </Marker>)
            }
           return rtnVal;
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
export default PointDetailsMap;
