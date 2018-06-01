//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image,Dimensions  } from 'react-native';
import { connect } from 'react-redux';
import {MapView, Marker, Polyline} from 'react-native-amap3d';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 
import coordinate from '../../utils/coordinate';
import mainmap from '../../config/configjson/mainmap.json';
import {AQIorIAQI,IAQIColorLevel} from '../../utils/mapconfig';
const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
/**
 * 地图组件
 * HelenChen
 * @class MapBase
 * @extends {Component}
 */
@connect(({app})=>({mallPointList:app.mallPointList,
    mTime:app.mTime,
    pressPollutantCode:app.pressPollutantCode,
    realTimeDataList:app.realTimeDataList,
    mkindCode:app.mkindCode,
    markerRealDatas:app.markerRealDatas}))
class MapBase extends Component {
    constructor(props) {
        super(props); 
        this.state = {        
            rotateEnabled: false,//地图旋转
            pressPollutantCode:'AQI',
            avglat:36.180897,
            avglong:119.214348,
            czlat:0.05,
            czlong:0.05,
            activecode:'',
            monitorTime:''
        }
        //this.getDataInfos();
      }
      componentWillMount(){
        let mypollutant=mainmap.data[2].pollutantType;
        let latlong=mainmap.data[3].MapConfig[0].PointLimit.split(',');
      if(latlong!=null && latlong!=''&& latlong.length>=3){
          let avglat=(parseFloat(latlong[0])+parseFloat(latlong[2]))/2;
          let avglong=(parseFloat(latlong[1])+parseFloat(latlong[3]))/2;
          let czlat=parseFloat(latlong[2])-parseFloat(latlong[0]);
          let czlong=parseFloat(latlong[3])-parseFloat(latlong[1]);
          this.setState({pressPollutantCode:mypollutant[0].pollutantCode,
                avglat:avglat.toFixed(2),
                avglong:avglong.toFixed(2),
                czlat:czlat.toFixed(2),
                czlong:czlong.toFixed(2)});
          
      }
      }
   
    _renderClickItem = (dgimn) =>{
        let rtnVal;
        this.props.markerRealDatas;
        if (this.props.markerRealDatas != null && this.props.markerRealDatas!='') {
                rtnVal = [];
                this.props.markerRealDatas.map((item, key) => {
                if(item.DGIMN == dgimn){
                    let kindCodeList=item.mkindCode;
                    console.log('===========地图base========================');
                    console.log(kindCodeList);
                    console.log('====================================');
                    if(kindCodeList.length>0){
                        let codeList=kindCodeList[0];//监测因子code
                        let nameList=kindCodeList[1];//监测因子name
                        for(let i=0;i<codeList.length;i++){
                                let AQIorIAQICode=AQIorIAQI(codeList[i]);
                                let AQIorIAQIValue;
                                if(item[AQIorIAQICode]!=undefined){
                                    AQIorIAQIValue=item[AQIorIAQICode];
                                }else{
                                    AQIorIAQIValue='--- ---';
                                }
                                let backforGround=IAQIColorLevel(AQIorIAQIValue);
                                let bkColor;
                                let tvColor;
                                if(backforGround!=undefined && backforGround.length>0){
                                    bkColor=backforGround[0];
                                    tvColor=backforGround[1];
                                }
                                let itemkey=item.DGIMN+i;
                                rtnVal.push(
                                  <View
                                    key={itemkey}
                                    style={{flexDirection:'row',alignItems:'center',justifyContent: 'space-around',marginTop: 3,width: (SCREEN_WIDTH-120)/2,backgroundColor:'white',flexWrap:'wrap'}}>
                                    {nameList[i]=='PM25' ? <Text style={{ fontSize: 12, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>PM<Text style={{ fontSize: 10, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>2.5</Text></Text>
                                    : nameList[i]=='PM10' ? <Text style={{ fontSize: 12, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>PM<Text style={{ fontSize: 10, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>10</Text></Text>
                                    : nameList[i]=='NO2' ? <Text style={{ fontSize: 12, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>NO<Text style={{ fontSize: 10, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>2</Text></Text>
                                    : nameList[i]=='SO2' ? <Text style={{ fontSize: 12, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>SO<Text style={{ fontSize: 10, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>2</Text></Text>
                                    : nameList[i]=='O3' ? <Text style={{ fontSize: 12, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>O<Text style={{ fontSize: 10, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>3</Text></Text>
                                    : <Text style={{ fontSize: 12, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>{nameList[i]}</Text>
                                    }
                                    <Text style={{ fontSize: 12, color: tvColor,height:20,backgroundColor:bkColor,textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>
                                      {item[codeList[i]] ? item[codeList[i]]:'-- --'}
                                    </Text>
                                  </View>
                                );
                        }
                    }
                    
                }
                });
          } 
          return rtnVal;
    }
    render() {
       let ma=Number(this.state.avglat);
       let mb=Number(this.state.avglong);
       let mc=Number(this.state.czlat);
       let md=Number(this.state.czlong);
        return (
            <MapView 
            zoomLevel={14} 
            rotateEnabled={this.state.rotateEnabled}      
            style={StyleSheet.absoluteFill}
            region={
                {latitude: ma,
                longitude: mb,
                latitudeDelta: mc,
                longitudeDelta: md,}
            }
          >
            {   this.props.mallPointList ? 
                //循环渲染Marker 
                this._renderMarker() :<Marker 
                coordinate={{
                    latitude:36.180897,
                    longitude:119.214348,
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
        if(this.state.pressPollutantCode!=null && this.state.pressPollutantCode!=''){
            rtnVal.splice(0,rtnVal.length);
        }
        this.props.mallPointList ? this.props.mallPointList.map((item,key)=>{
            if(item.fillIcon!=null && item.fillIcon!=''){
                let mLat;
                let mLon;
                let mLonAndmLat;
                if(item.dbo__T_Bas_CommonPoint__Latitude!=null && item.dbo__T_Bas_CommonPoint__Latitude!="" && item.dbo__T_Bas_CommonPoint__Longitude!=null && item.dbo__T_Bas_CommonPoint__Longitude!=""){
                    mLat=item.dbo__T_Bas_CommonPoint__Latitude;
                    mLon=item.dbo__T_Bas_CommonPoint__Longitude;
                }else{
                    mLat=36.887208;
                    mLon=120.519118;
                }
                //将84坐标改为高德坐标
                mLonAndmLat=coordinate.wgs84togcj02(mLon,mLat);
                let imageUri = '../../images/'+item.fillIcon+'.png';
                rtnVal.push(
                <Marker   
                key={key+1} 
                active={this.state.activecode==item.dbo__T_Bas_CommonPoint__DGIMN}  
                image={
                    item.fillIcon
                }
                // icon={
                //     <Image source={require(imageUri)}/>
                // }
                onPress={()=>{
                    this.setState({activecode:item.dbo__T_Bas_CommonPoint__DGIMN});
                }}               
                coordinate={{
                latitude: mLonAndmLat[1],
                longitude: mLonAndmLat[0],}}>
                <View style={styles.customInfoWindow}>
                    <View style={{flexDirection:'column',height:60,width:SCREEN_WIDTH-120,backgroundColor:'#6395FF',borderBottomColor:'#356FE8',alignItems:'center',borderTopLeftRadius:10,borderTopRightRadius:10}}>
                        <Text style={{fontSize:14,color:'white',marginLeft:6,marginTop:6,height:16,alignSelf:'flex-start',textAlign:'left'}}>{item.dbo__T_Bas_CommonPoint__PointName}</Text>
                        <Text style={{fontSize:9,color:'white',marginLeft:6,marginTop:4,height:16,alignSelf:'flex-start',textAlign:'left'}}>{'网格类型:'+item.dbo__T_Cod_GridType}</Text>
                        <View style={{flexDirection:'row',width:SCREEN_WIDTH-120,marginBottom:5}}>
                            <Text style={{fontSize:9,color:'white',marginLeft:6,flex:1}}>{this.props.mTime?this.props.mTime:''}</Text>
                            <Text style={{fontSize:9,color:'white',marginRight:6}}>{item.dbo__T_Cod_Region}</Text>
                        </View>
                        <TouchableOpacity
                        onPress={() => {
                            this.setState({activecode:''});
                            }}
                        style={{position:'absolute',right:10,marginTop:5}}>
                            <Image source={require('../../images/icon_close_red.png')} style={{width:26,height:26,}}></Image>
                        </TouchableOpacity>
                        
                    </View>
                    <View style={{flexDirection:'column',width:SCREEN_WIDTH-120}}>
                    <View style={{flexDirection:'row',marginBottom:3,flexWrap:'wrap',width:SCREEN_WIDTH-120,justifyContent:'center',marginLeft:3,marginRight:3}}>
                    {this._renderClickItem(item.dbo__T_Bas_CommonPoint__DGIMN)}
                    </View>
                    <Text style={{width:SCREEN_WIDTH-120,height:1,backgroundColor:'#A9A9A9'}}></Text>
                    {
                        <TouchableOpacity
                        onPress={() => {
                        this.props.dispatch(NavigationActions.navigate({
                            routeName: 'PointDetails',                        
                            params: {fillIcon: item.fillIcon,
                                     latitude: item.dbo__T_Bas_CommonPoint__Latitude,
                                     longitude: item.dbo__T_Bas_CommonPoint__Longitude,
                                     pointName: item.dbo__T_Bas_CommonPoint__PointName,
                                     pollutantType:item.dbo__T_Cod_PollutantType,
                                     linkman:item.dbo__T_Bas_CommonPoint__Linkman,
                                     region:item.dbo__T_Cod_Region,
                                     dgimn:item.dbo__T_Bas_CommonPoint__DGIMN,
                                     equitmentType:item.dbo__T_Bas_CommonPoint__PollutantType,} }));
                        }}
                        style={{height:30,width:SCREEN_WIDTH-120,alignItems:'center'}}>
                        <Text style={{ color: '#4B83F5', fontSize: 14 ,alignSelf:'center'}}>{'查看详情'}</Text>
                  </TouchableOpacity>
                    }
                  
                  </View>
                </View>
               </Marker>)
            }
             }) : <View style={{height:20,width:20,backgroundColor:'#ffda44'}}><Text style={{fontSize:14,color:'#ef3344'}}>暂无数据</Text></View> 
           return rtnVal;
        }
        
 
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    customInfoWindow: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: 'white',
        width:SCREEN_WIDTH-120,
        flexDirection:'column'
    },
    mapContainer: {
        flex: 1,
        width:SCREEN_WIDTH,
    },
});

//make this component available to the app
export default MapBase;