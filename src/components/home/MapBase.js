//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image,Dimensions  } from 'react-native';
import { connect } from 'react-redux';
import {MapView, Marker, Polyline} from 'react-native-amap3d';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 
import coordinate from '../../utils/coordinate';
import mainmap from '../../config/configjson/mainmap.json';
import {AQIorIAQI,IAQIColorLevel} from '../../utils/mapconfig';
import LoadingComponent from '../../components/comment/LoadingComponent'
import SuspensionLoadingComponent from '../../components/comment/SuspensionLoadingComponent';

const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * 地图组件
 * HelenChen
 * @class MapBase
 * @extends {Component}
 */
@connect(({map,loading,pointdetails})=>({
    mallPointList:map.mallPointList,
    pressPollutantCode:map.pressPollutantCode,
    mkindCode:map.mkindCode,
    markerRealDatas:map.markerRealDatas,
    // activecode:map.activecode,
    mapRankDatas:pointdetails.mapRankDatas,
    loading:loading.effects['map/GetGridRealTimeImgDataAndroid'],}))
class MapBase extends PureComponent {
    constructor(props) {
        super(props); 
        this.state = {        
            rotateEnabled: false,//地图旋转
            pressPollutantCode:'AQI',
            avglat:35.103663,
            avglong:118.356618,
            czlat:0.1,
            czlong:0.1,
            monitorTime:'',
            activecode:'',
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
                                    style={{flexDirection:'row',justifyContent: 'space-around',marginTop: 3,width: (SCREEN_WIDTH-100)/2,backgroundColor:'white',flexWrap:'wrap'}}>
                                    {nameList[i]=='PM25' ? <Text style={{ fontSize: 12, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-100)/5}}>PM<Text style={{ fontSize: 8, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>2.5</Text></Text>
                                    : nameList[i]=='PM10' ? <Text style={{ fontSize: 12, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-100)/5}}>PM<Text style={{ fontSize: 8, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>10</Text></Text>
                                    : nameList[i]=='NO2' ? <Text style={{ fontSize: 12, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-100)/5}}>NO<Text style={{ fontSize: 8, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>2</Text></Text>
                                    : nameList[i]=='SO2' ? <Text style={{ fontSize: 12, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-100)/5}}>SO<Text style={{ fontSize: 8, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>2</Text></Text>
                                    : nameList[i]=='O3' ? <Text style={{ fontSize: 12, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-100)/5}}>O<Text style={{ fontSize: 8, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>3</Text></Text>
                                    : <Text style={{ fontSize: 12, color: '#333333',textAlign:'left',width:(SCREEN_WIDTH-120)/5}}>{nameList[i]}</Text>
                                    }
                                    <Text style={{ fontSize: 12, color: tvColor,height:20,backgroundColor:bkColor,textAlign:'left',width:(SCREEN_WIDTH-100)/5}}>
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
        return (
            <View style={styles.container}>
                <MapView 
                zoomLevel={11} 
                rotateEnabled={this.state.rotateEnabled}      
                style={{flex: 1,
                    width:SCREEN_WIDTH,height:SCREEN_HEIGHT}}
                    coordinate={{
                        latitude: this.state.avglat,
                        longitude: this.state.avglong,
                    }}
            >
                {   this.props.mallPointList ? 
                    //循环渲染Marker 
                    this._renderMarker() :<Marker 
                    coordinate={{latitude: 34.3776250003,
                        longitude: 116.70123,}}
                    icon={() =><View >
                        <Text>{}</Text>      
                    </View>}
                />
                }
                </MapView>
            </View>
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
                    mLat=35.103663;
                    mLon=118.356618;
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
                onPress={()=>{
                    this.setState({
                        avglat:this.state.avglat === item.dbo__T_Bas_CommonPoint__Latitude ? item.dbo__T_Bas_CommonPoint__Latitude+ 1 / 10000 :item.dbo__T_Bas_CommonPoint__Latitude,
                        avglong:this.state.avglong === item.dbo__T_Bas_CommonPoint__Longitude ? item.dbo__T_Bas_CommonPoint__Longitude + 1 / 10000:item.dbo__T_Bas_CommonPoint__Longitude,
                        activecode:item.dbo__T_Bas_CommonPoint__DGIMN
                    });
                }}               
                coordinate={{
                latitude: mLonAndmLat[1],
                longitude: mLonAndmLat[0],}}>
                <View style={styles.customInfoWindow}>
                    <View style={{flexDirection:'column',height:60,width:SCREEN_WIDTH-100,backgroundColor:'#6395FF',borderBottomColor:'#356FE8',alignItems:'center',borderTopLeftRadius:10,borderTopRightRadius:10}}>
                        <Text style={{fontSize:14,color:'white',marginLeft:6,marginTop:6,height:16,alignSelf:'flex-start',textAlign:'left'}}>{item.dbo__T_Bas_CommonPoint__PointName}</Text>
                        <Text style={{fontSize:9,color:'white',marginLeft:6,marginTop:4,height:16,alignSelf:'flex-start',textAlign:'left'}}>{'网格类型:'+item.dbo__T_Cod_GridType}</Text>
                        <View style={{flexDirection:'row',width:SCREEN_WIDTH-100,marginBottom:5}}>
                            <Text style={{fontSize:9,color:'white',marginLeft:6,flex:1}}>{item.mtime ? item.mtime : '-年-月-日-时-分-秒'}</Text>
                            <Text style={{fontSize:9,color:'white',marginRight:6}}>{item.dbo__T_Cod_Region}</Text>
                        </View>
                        <TouchableOpacity
                        onPress={() => {
                            this.setState({activecode:''});
                            // this.props.dispatch(createAction('map/setActivecode')({'activecode':''}));
                            }}
                        style={{position:'absolute',right:10,marginTop:5}}>
                            <Image source={require('../../images/icon_close_red.png')} style={{width:26,height:26,}}></Image>
                        </TouchableOpacity>
                        
                    </View>
                    <View style={{flexDirection:'column',width:SCREEN_WIDTH-100}}>
                    <View style={{flexDirection:'row',marginBottom:3,flexWrap:'wrap',width:SCREEN_WIDTH-100,justifyContent:'center',marginLeft:3,marginRight:3}}>
                    {this._renderClickItem(item.dbo__T_Bas_CommonPoint__DGIMN)}
                    </View>
                    <Text style={{width:SCREEN_WIDTH-100,height:1,backgroundColor:'#efefef'}}></Text>
                    {
                        <TouchableOpacity
                        onPress={() => {
                            this.props.dispatch(createAction('pointdetails/updateState')({
                                mapRankDatas:{
                                    ...this.props.mapRankDatas,
                                    dgimn:item.dbo__T_Bas_CommonPoint__DGIMN,
                                }
                                 }));
                                 this.props.dispatch(NavigationActions.navigate({routeName: 'PointDetailsShow', params: { }}))        
                        }}
                        style={{height:30,width:SCREEN_WIDTH-100,alignItems:'center'}}>
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
        width:SCREEN_WIDTH-100,
        flexDirection:'column'
    },
    mapContainer: {
        flex: 1,
        width:SCREEN_WIDTH,
    },
});

//make this component available to the app
export default MapBase;
