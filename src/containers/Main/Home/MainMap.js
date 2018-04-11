//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,Image,Dimensions,FlatList,ItemComponent ,TouchableOpacity,Modal,TouchableHighlight,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {MapView, Marker, Polyline} from 'react-native-amap3d';
import {mapLengedBack,mapLengedFore,statusImage,IAQILevel,kindCode,IAQIColorLevel} from '../../../utils/mapconfig'
import { connect } from 'react-redux';
import { createAction,ShowToast,NavigationActions} from '../../../utils'; 
import {CodeForName,AQIorIAQI} from '../../../utils/mapconfig';
import PollutantcodeBar from '../../../components/home/PollutantcodeBar';
import LengendStateBar from '../../../components/home/LengendStateBar';
import LengendEquitmentBar from '../../../components/home/LengendEquitmentBar';
import coordinate from '../../../utils/coordinate';
import mainmap from '../../../config/configjson/mainmap.json';
const SCREEN_WIDTH=Dimensions.get('window').width;
/**
 * 主页-地图
 * Helenchen
 * @class MainMap
 * @extends {Component} 
 */
@connect(({app})=>({mallPointList:app.mallPointList,
    realTimeDataList:app.realTimeDataList,
    mkindCode:app.mkindCode,
    mTime:app.mTime,
    choosePollutantCode: app.choosePollutantCode,
    pressPollutantCode:app.pressPollutantCode}))
class MainMap extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: '地图',
        tabBarLable: '地图',
        animationEnabled: false,
        headerBackTitle: null,
        headerTintColor: '#ffffff',
        headerTitleStyle: {alignSelf: 'center'},//标题居中
        headerStyle: { backgroundColor: '#5688f6',height:45 },
        labelStyle: {fontSize: 14},
        headerRight:(
        <TouchableOpacity style={{width:24,height:24,marginRight:10}}
        onPress={()=>{
           navigation.state.params.navigatePress();
        }}>
        <Image source={require('../../../images/ic_refresh.png')} style={{width:24,height:24,marginRight:10}}></Image>
        </TouchableOpacity>
        ),
        tabBarIcon: ({ focused, tintColor }) =>
        <Image source={focused ? require('../../../images/ic_map_hover.png') : require('../../../images/ic_map.png')} style={{height:20,width:20}}></Image>
        })
        componentDidMount(){
            this.props.navigation.setParams({navigatePress:this.refreshOn})
          }
          refreshOn=()=>{
            this.props.navigation.dispatch(createAction('app/getpressCodeData')({
                whitchPage:'Map',
                pressPollutantCodeMap: this.props.pressPollutantCode!=null ? this.props.pressPollutantCode : mainmap.data[2].pollutantType[0].pollutantCode,
                pressPollutantCodeRank:''
                }));
        }
      constructor(props) {
        super(props); 
        this.state = {        
            rotateEnabled: false,//地图旋转
            lenData:[],
            equitmentData:[],
            pollutantData:[],
            pressPollutantCode:'AQI',
            avglat:35.035278,
            avglong:118.476389,
            czlat:0.05,
            czlong:0.05,
            activecode:'',
            monitorTime:''
        }
        this.getDataInfos();
      }
      async getDataInfos() {
        let data = await require('../../../config/configjson/mainmap.json');
        let jsonData = data.data;
        let lengendType=[];
        let equitmentType=[];
        let pollutantType=[];
        let mapConfig=[];
        lengendType=jsonData[0].lengendType;
        equitmentType=jsonData[1].equitmentType;
        pollutantType=jsonData[2].pollutantType;
        mapConfig=jsonData[3].MapConfig;
        let latlong=[];
        latlong=mapConfig[0].PointLimit.split(',');
        let avglat;
        let avglong;
        let czlat;
        let czlong;
        if(latlong!=null && latlong!=''){
            const minlat=parseFloat(latlong[0]);
            const minlong=parseFloat(latlong[1]);
            const maxlat=parseFloat(latlong[2]);
            const maxlong=parseFloat(latlong[3]);
            avglat=(minlat+maxlat)/2;
            avglong=(minlong+maxlong)/2;
            czlat=maxlat-minlat;
            czlong=maxlong-minlong;
        }
        this.setState({lenData:lengendType,equitmentData:equitmentType,pollutantData:pollutantType,pressPollutantCode:pollutantType[0].pollutantCode,
            avglat:avglat,avglong:avglong,czlat:czlat,czlong:czlong});
    }
   
    //循环渲染点击marker的item
    _renderClickItemView = (dgimn) =>{
        let rtnVal;
        if (this.props.realTimeDataList != null && this.props.realTimeDataList!='') {
                rtnVal = [];
                this.props.realTimeDataList.map((item, key) => {
                if(item.DGIMN == dgimn){
                    let kindCodeList=this.props.mkindCode;
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
                    mLat=35.035278;
                    mLon=118.476389;
                }
                //将84坐标改为高德坐标
                mLonAndmLat=coordinate.wgs84togcj02(mLon,mLat);
                rtnVal.push(
                <Marker   
                key={key+1} 
                active={this.state.activecode==item.dbo__T_Bas_CommonPoint__DGIMN}  
                image={
                    item.fillIcon
                }
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
                            <Image source={require('../../../images/icon_close_red.png')} style={{width:26,height:26,}}></Image>
                        </TouchableOpacity>
                        
                    </View>
                    <View style={{flexDirection:'column',width:SCREEN_WIDTH-120}}>
                    <View style={{flexDirection:'row',marginBottom:3,flexWrap:'wrap',width:SCREEN_WIDTH-120,justifyContent:'center',marginLeft:3,marginRight:3}}>
                        {this._renderClickItemView(item.dbo__T_Bas_CommonPoint__DGIMN)}
                    </View>
                    <Text style={{width:SCREEN_WIDTH-120,height:1,backgroundColor:'#A9A9A9'}}></Text>
                    <TouchableOpacity
                        onPress={() => {
                        this.props.dispatch(NavigationActions.navigate({
                            routeName: 'MainMy',                        
                            params: {} }));
                        }}
                        style={{height:30,width:SCREEN_WIDTH-120,alignItems:'center'}}>
                        <Text style={{ color: '#4B83F5', fontSize: 14 ,alignSelf:'center'}}>{'查看详情'}</Text>
                  </TouchableOpacity>
                  </View>
                </View>
               </Marker>)
            }
             }) : <View style={{height:20,width:20,backgroundColor:'#ffda44'}}><Text style={{fontSize:14,color:'#ef3344'}}>暂无数据</Text></View> 
           return rtnVal;
        }
           
    render() {
        return (
            <View style={styles.container}>
                <MapView 
                zoomLevel={14} 
                rotateEnabled={this.state.rotateEnabled}      
                style={StyleSheet.absoluteFill}
                region={
                    {latitude: this.state.avglat,
                    longitude: this.state.avglong,
                    latitudeDelta: this.state.czlat,
                    longitudeDelta: this.state.czlong,}
                }>
                {   //循环渲染Marker 
                    this._renderMarker()
                }
                </MapView>
                <PollutantcodeBar style={{width:SCREEN_WIDTH,backgroundColor:'#ffffff',position:'absolute',top:0}}/> 
                <View style={styles.lengendStyle}>
                    <LengendStateBar style={{backgroundColor:'#ffffff',width:SCREEN_WIDTH}}/>
                    <Text style={{backgroundColor:'#efefef',width:SCREEN_WIDTH,height:1,marginTop:5}}/>
                    <LengendEquitmentBar style={{backgroundColor:'#ffffff',width:SCREEN_WIDTH}}/>
                </View>
                <Image source={require('../../../images/big_circle.png')} style={{width:50,height:50, position:'absolute',bottom:40,left:5}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        flexDirection: 'column',
    },
    lengendStyle:{
        flexDirection: 'column',
        position:'absolute',
        bottom:0,
        width:SCREEN_WIDTH,
        backgroundColor:'#ffffff',
        padding:5,
    },
    markerText: {
        color: '#ffffff',
        fontSize:12,
      },
    markerValueText: {
        color: '#ffffff',
        fontSize:10,
    },
    customInfoWindow: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: 'white',
        width:SCREEN_WIDTH-120,
        flexDirection:'column'
    },
  

});

//make this component available to the app
export default MainMap;
