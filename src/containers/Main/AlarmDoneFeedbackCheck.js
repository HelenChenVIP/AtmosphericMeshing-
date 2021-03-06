//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,Image,Dimensions,TouchableOpacity } from 'react-native';
import {MapView, Marker, Polyline} from 'react-native-amap3d';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 
import { connect } from 'react-redux';
import alarmJson from '../../config/configjson/alarm.json';
import LoadingComponent from '../../components/comment/LoadingComponent';
import NoDataComponent from '../../components/comment/NoDataComponent';

const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
/**
 * HelenChen
 * 报警核实单
 * @class AlarmDoneFeedbackCheck
 * @extends {Component}
 */
@connect(({alarm,loading})=>({
    CheckEarlyWarningInfoData:alarm.CheckEarlyWarningInfoData,
    loading:loading.effects['alarm/GetCheckEarlyWarningInfo'],}))
class AlarmDoneFeedbackCheck extends PureComponent {
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
            longitude: 118.356618,
            latitude: 35.103663,
        }
      }
      componentWillMount(){
          this.props.dispatch(createAction('alarm/GetCheckEarlyWarningInfo')({
            ID:this.props.navigation.state.params.ID}));
     }
     componentWillUpdate(nextProps, nextState){
         if(nextProps.CheckEarlyWarningInfoData==this.props.CheckEarlyWarningInfoData){
             return false;
         }else{
             return true;
         }
     }
    render() {
        return(
            this.props.loading ? <LoadingComponent Message={'正在加载数据...'} /> 
            :
                this.props.CheckEarlyWarningInfoData ? 
                <View style={styles.container}>
                <Text style={{width:SCREEN_WIDTH,height:20}}> </Text>
                <View style={{flexDirection:'row',width:SCREEN_WIDTH,height:80,backgroundColor:'#ffffff',alignItems:'center',borderColor:'#dedede',borderWidth:1}}>
                <Text style={{fontSize:16,color:'#333333',marginLeft:10,height:100,textAlignVertical:'center'}}>预警原因：</Text>
                <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around',flex:1,alignItems:'center',marginRight:10}}>
                {alarmJson.data[0].alarmCheckReasons.map((item,key)=>{
                        return (
                            <View style={{flexDirection:'row',marginTop:12}} key={item.value}>{
                            this.props.CheckEarlyWarningInfoData.warningReason==item.value ? 
                                <Image source={require('../../images/ic_rbtn_select.png')} style={{ width: 16, height: 16 }}/>
                            :  <Image source={require('../../images/ic_rbtn_default.png')} style={{ width: 16, height: 16 }}/>}
                                <Text style={{fontSize:16,color:'#848484',marginLeft:2}}>{item.label}</Text>
                            </View>
                        );})}
                </View>
                </View>
                <View style={{flexDirection: 'row', height: 50, justifyContent: 'center', alignItems: 'center',backgroundColor:'#ffffff'}}>
                    <Text style={{fontSize:16,color:'#333333',marginLeft:10,flex:1}}>预计恢复时间：</Text>
                    <Text style={{fontSize: 16, color: '#848484',marginRight:10 }}>{this.props.CheckEarlyWarningInfoData.recoveryTime}</Text>
                </View>

                <View style={{flexDirection:'row',height: 50,width:SCREEN_WIDTH,alignItems:'center',backgroundColor:'#ffffff',marginTop:1}}>
                    <Text style={{fontSize:16,marginLeft:10,color:'#333333'}}>描述：</Text>
                    <Text style={{fontSize: 16, color: '#848484',marginRight:10 }}>{this.props.CheckEarlyWarningInfoData.sceneDescription}</Text>
                </View>
                <MapView 
                    style={{marginTop:1}}
                    zoomLevel={14} 
                    rotateEnabled={this.state.rotateEnabled}    
                    coordinate={{
                        latitude: this.props.CheckEarlyWarningInfoData.latitude ?  this.props.CheckEarlyWarningInfoData.latitude : this.state.latitude,
                        longitude: this.props.CheckEarlyWarningInfoData.longitude ?  this.props.CheckEarlyWarningInfoData.longitude : this.state.longitude,
                        }}
                    onLocation={({ nativeEvent }) =>
                    this.logLocationEvent}   
                    style={{width:SCREEN_WIDTH,height:150,borderColor:'#dedede',borderWidth:1}}>
                </MapView>
                <View style={{ flexDirection: 'row', height: 50, justifyContent: 'center', alignItems: 'center',backgroundColor:'#ffffff',marginTop:1}}>
                    <Text style={{fontSize:16,color:'#333333',marginLeft:10,flex:1}}>{'反馈人：'+this.props.CheckEarlyWarningInfoData.personalFeedback}</Text>
                    <Text style={{fontSize: 16, color: '#848484',marginRight:10 }}>{this.props.CheckEarlyWarningInfoData.feedbackTime}</Text>
                </View>
                </View>
                : <NoDataComponent Message={'暂无数据'}/>
                );
            }
        
            
    
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        flexDirection:'column',
        marginTop:20
    },
});

//make this component available to the app
export default AlarmDoneFeedbackCheck;
