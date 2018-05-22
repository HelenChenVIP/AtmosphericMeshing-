//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,Image,Dimensions,TouchableOpacity } from 'react-native';
import {MapView, Marker, Polyline} from 'react-native-amap3d';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 
import { connect } from 'react-redux';
import alarmJson from '../../config/configjson/alarm.json';

const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
/**
 * HelenChen
 * 报警核实单
 * @class AlarmDoneFeedbackCheck
 * @extends {Component}
 */
@connect(({alarm})=>({CheckEarlyWarningInfoData:alarm.CheckEarlyWarningInfoData}))
class AlarmDoneFeedbackCheck extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: '核实反馈',
        tabBarLable: '核实反馈',
        animationEnabled: false,
        headerBackTitle: null,
        headerTintColor: '#ffffff',
        headerTitleStyle: {alignSelf: 'center'},//标题居中
        headerStyle: { backgroundColor: '#5688f6',height:45 },
        labelStyle: {fontSize: 14},
        tabBarIcon: ({ focused, tintColor }) =>
          <Image source={focused ? require('../../images/ic_me_hover.png') : require('../../images/ic_me.png')} style={{height:20,width:20}}></Image>,
      })
      constructor(props) {
        super(props); 
        this.state = {        
            rotateEnabled: false,//地图旋转
            longitude: 0,
            latitude: 0,
        }
      }
      componentWillMount(){
          this.props.navigation.state.params.ID;
          this.props.dispatch(createAction('alarm/GetCheckEarlyWarningInfo')({
            ID:this.props.navigation.state.params.ID}));
     }
     
    render() {
        return (
            this.props.CheckEarlyWarningInfoData!=undefined ?
            <View style={styles.container}>
            <View style={{flexDirection:'row',width:SCREEN_WIDTH,height:80,backgroundColor:'#ffffff',alignItems:'center',borderColor:'#dedede',borderWidth:1}}>
                <Text style={{fontSize:16,color:'#333333',marginLeft:10,height:100,textAlignVertical:'center'}}>预警原因：</Text>
                <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around',flex:1,alignItems:'center',marginRight:10}}>
                {alarmJson.data[0].alarmCheckReasons.map((item,key)=>{
                        return (<View style={{flexDirection:'row',marginTop:12}}>{
                            this.props.CheckEarlyWarningInfoData.warningReason==item.checkCode ? 
                                <Image source={require('../../images/ic_rbtn_select.png')} style={{ width: 16, height: 16 }}/>
                            :  <Image source={require('../../images/ic_rbtn_default.png')} style={{ width: 16, height: 16 }}/>}
                                <Text style={{fontSize:16,color:'#848484',marginLeft:2}}>{item.checkReson}</Text>
                                </View>
                        );})}
                </View>
            </View>
                <View style={{flexDirection: 'row', height: 50, justifyContent: 'center', alignItems: 'center',backgroundColor:'#ffffff'}}>
                    <Text style={{fontSize:16,color:'#333333',marginLeft:10,flex:1}}>预计恢复时间：</Text>
                    <Text style={{fontSize: 16, color: '#848484',marginRight:10 }}>{this.props.CheckEarlyWarningInfoData.recoveryTime}</Text>
               </View>

               <View style={{flexDirection:'row',height: 60,width:SCREEN_WIDTH,alignItems:'center',padding:5,backgroundColor:'#ffffff',marginTop:1}}>
                    <Text style={{fontSize:16,marginLeft:10,color:'#333333'}}>描述：</Text>
                    <Text style={{fontSize: 16, color: '#848484',marginRight:10 }}>{this.props.CheckEarlyWarningInfoData.sceneDescription}</Text>
              </View>

              <MapView 
              style={{marginTop:1}}
              zoomLevel={14} 
              rotateEnabled={this.state.rotateEnabled}    
              coordinate={{
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                }}
              onLocation={({ nativeEvent }) =>
              this.logLocationEvent}   
              style={{width:SCREEN_WIDTH,height:150,borderColor:'#dedede',borderWidth:1}}>
            </MapView>
           

            <View style={{ flexDirection: 'row', height: 50, justifyContent: 'center', alignItems: 'center',backgroundColor:'#ffffff',marginTop:1}}>
                <Text style={{fontSize:16,color:'#333333',marginLeft:10,flex:1}}>{'反馈人：'+this.props.CheckEarlyWarningInfoData.personalFeedback}</Text>
                <Text style={{fontSize: 16, color: '#848484',marginRight:10 }}>{this.props.CheckEarlyWarningInfoData.feedbackTime}</Text>
            </View>
         </View> : <View><Text>暂无记录</Text></View>
        
           
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dedede',
        flexDirection:'column'
    },
});

//make this component available to the app
export default AlarmDoneFeedbackCheck;
