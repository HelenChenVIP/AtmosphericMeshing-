//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, Image,TextInput,ScrollView,TouchableOpacity,Modal,FlatList, } from 'react-native';
import alarmJson from '../../config/configjson/alarm.json';
import {MapView, Marker, Polyline} from 'react-native-amap3d';
import { DatePicker, List,TextareaItem } from 'antd-mobile';
import { connect } from 'react-redux';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import NoDataComponent from '../../components/comment/NoDataComponent';
import { Radio} from 'antd-mobile';

const RadioItem = Radio.RadioItem;
import { createAction,ShowToast,NavigationActions,CloseToast,ShowResult,ShowLoadingToast} from '../../utils'; 
const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const options = {
    title: '选择照片',
    cancelButtonTitle: '关闭',
    takePhotoButtonTitle: '打开相机',
    chooseFromLibraryButtonTitle: '选择照片',
    quality: 0.1,
    storageOptions: {
      skipBackup: true,
      path: 'images'
    }
  };
/**
 * Helenchen
 * 未核实-核实界面
 * @class AlarmNoFeedbackCheck
 * @extends {Component}
 */
@connect(({alarm})=>({NoAlarmDesData:alarm.NoAlarmDesData}))
class AlarmNoFeedbackCheck extends PureComponent {
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
        console.log(props); 
        this.state = {        
            rotateEnabled: false,//地图旋转
            RecoveryTime: moment().add(alarmJson.data[0].recoverTime, 'hours'),
            modalVisible:false,
            reasonStatemap:(new Map(): Map<string, boolean>),
            longitude: '',
            latitude: '',
            sceneDescription:'',
            imagelist: [],
        }
      }
    //选择时间
    onDateChange=(date) => {
    this.setState({
      RecoveryTime: moment(date)
    });
   }
  extraUniqueKey=(item, index) => `index15${index}${item}`
  renderItem=({ item }) => {
    if (this.props.navigation.state.params.checkboxStatemap.get(item.ID)) {
      return (
            <View style={{backgroundColor:'#ffffff',borderColor:'#d7dcdd',borderWidth:1,borderRadius:5,flexDirection:'column',height:70,marginTop:5,marginBottom:5}}>
                <View style={{flexDirection:'row',height:40,marginLeft:10,marginRight:10,alignItems:'center'}}> 
                    <View style={{flexDirection:'row',height:40,flex:1,alignItems:'center'}}> 
                        <Image source={require('../../images/checkbox_pressed.png')} style={{ width: 17, height: 17 }}/> 
                        <Text style={{fontSize:16,color:'#4c4c4c',marginLeft:5}}>{item.ExceptionTypeName}</Text>
                    </View>
                    <Text style={{fontSize:14,color:'#a2a2a2',marginRight:10}}>{item.AlarmTime.substring(5,16)}</Text>
                </View>
                <Text style={{fontSize:12,color:'#979797',marginLeft:20,marginRight:10}}>{item.AlarmMsg}</Text>
            </View>
      );
    }
  }
  //查看预选预警信息
  lookMore=()=>{
      this.setState({modalVisible:true});
  }
  //选择预警原因
  reasonChoose=(item)=>{
    this.setState((state) => {
      checkCode:item.checkCode;
        // const reasonStatemap = new Map(state.reasonStatemap);
        // let aa=reasonStatemap.get(item.checkCode);
        // if( reasonStatemap.size>0){
        //   reasonStatemap.delete(item.checkCode);
        //   reasonStatemap.set(item.checkCode, false); 
        // }else{
        //   reasonStatemap.set(item.checkCode, true); 
        // }
        // return { reasonStatemap };
      });
   }
   logLocationEvent = ({ nativeEvent }) => {
    this.setState({
      longitude: nativeEvent.longitude,
      latitude: nativeEvent.latitude
    });
  }
  feedbackCallback=() => {
    this.props.navigation.state.params.clearselect;
    this.props.dispatch(NavigationActions.back());
    CloseToast();
    ShowResult(true, '反馈成功');
  }
  //提交全部
  summitAll=()=>{
    let paramExceptionProcessingID = '';
    let paramImageID = '';
    let WarningReason = '';
    this.props.navigation.state.params.checkboxStatemap.forEach((item, key, mapObj) => {
      paramExceptionProcessingID += `${key.toString()},`;
    });
    this.state.reasonStatemap.forEach((item, key)=>{
        WarningReason=key;
    })
    this.props.dispatch(createAction('alarm/SummitAll')({
        postjson: {
            DGIMN: this.props.navigation.state.params.DGIMN,
            ExceptionProcessingID: paramExceptionProcessingID,
            WarningReason: WarningReason,
            sceneDescription: this.state.sceneDescription,
            ImageID: paramImageID,
            feedbackTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            RecoveryTime: this.state.RecoveryTime.format('YYYY-MM-DD HH:mm:ss'),
            longitude: this.state.longitude,
            latitude: this.state.latitude,
            isRecord: 1,
          },
          successCallback: this.feedbackCallback,
          failCallback:()=>{
            // this.props.navigation.state.params.clearselect;
            // this.props.dispatch(NavigationActions.back());
            CloseToast();
            ShowResult(false, '提交失败');
          },
          'checkboxIndexmap':this.props.navigation.state.params.checkboxIndexmap
    }));
  }
  scrollToInput =(reactNode: any) => {
    // Add a 'scroll' ref to your ScrollView
      this.refs.scroll.scrollToPosition(0, 130, false);
    }
    renderPickedImage=() => {
        const rtnVal = [];
        this.state.imagelist.map((item, key) => {
          const source = { uri: item.uri };
          rtnVal.push(
            <View key={item.uploadID} style={{marginLeft: 10,width: 60,height: 60,marginRight:10,marginTop:5,marginBottom:8}}>
              <Image source={source} style={{width: 60,height: 60}}/>
              <TouchableOpacity
                onPress={() => {
                  this.setState((state) => {
                    const imagelist = state.imagelist;
                    const removeIndex = state.imagelist.findIndex((value, index, arr) =>
                      value.uploadID === item.uploadID);
                    imagelist.splice(removeIndex, 1);
                    const refresh = !state.refresh;
                    return { imagelist, refresh };
                  });
                }}
                style={[{ position: 'absolute', top: 0, left: (SCREEN_WIDTH / 4 - 35) }]}>
               <Image source={require('../../images/ic_close_blue.png')} style={{ width: 16, height: 16}} />
              </TouchableOpacity>
            </View>
          );
        });
        return rtnVal;
      }
      uploadImageCallBack=(img) => {
        this.setState((state) => {
          // copy the map rather than modifying state.
          const imagelist = state.imagelist;
          const refresh = !state.refresh;
          imagelist.push(img);
          return { imagelist, refresh };
        });
        CloseToast();
      }
    render() {
        return (
            <ScrollView> 
            <View style={styles.container}>
                <TouchableOpacity style={{width:SCREEN_WIDTH,height:30,justifyContent:'center',alignItems:'center',}} onPress={() => {this.lookMore()}}>
                <Text style={{fontSize:14,color:'#4782f5',textAlignVertical:'center',textAlign:'center'}}>点击查看已选预警信息</Text>
                </TouchableOpacity>
                <View style={{flexDirection:'row',width:SCREEN_WIDTH,height:130,backgroundColor:'#ffffff',alignItems:'center',borderColor:'#dedede',borderWidth:1}}>
                    <Text style={{fontSize:16,color:'#333333',marginLeft:10,textAlignVertical:'center'}}>预警原因：</Text>
                    <View style={{flex:1,height:126,}}>
                    {alarmJson.data[0].alarmCheckReasons.map((item,key)=>{
                            return (
                              <RadioItem style={{width:200,height:30}} key={item.checkCode} checked={this.state.checkCode === item.checkCode} onChange={() => this.reasonChoose(item)}>
                              {item.checkReson}
                              </RadioItem>
                            );
                        })}
                    </View>
                </View>
                <DatePicker
                mode="datetime"
                extra="请选择(可选)"
                title={<Text>{''}</Text>}
                onChange={this.onDateChange}
                value={this.state.RecoveryTime.toDate()}>
                <TimeComponent />
              </DatePicker>
              <View style={{flexDirection:'row',width:SCREEN_WIDTH,height:50,alignItems:'center',marginTop:1,backgroundColor:'#ffffff'}}>
              <Text style={{fontSize:16,marginLeft:10,marginRight:10,color:'#333333',textAlignVertical:'center'}}>描述:</Text>
              <TextInput
                multiline = {true}
                underlineColorAndroid="transparent"
                style={{height: 50,backgroundColor:'#ffffff',marginRight:10,width:SCREEN_WIDTH-100}}
                placeholder="请填写描述信息"
                onChangeText={(sceneDescription) => this.setState({sceneDescription})}
              />
              </View>
               <Text style={{width:SCREEN_WIDTH,height:50,fontSize:16,color:'#333333',marginTop:1,backgroundColor:'#ffffff',textAlignVertical:'center'}}>    图片</Text>
               <View style={{flexDirection:'row',width:SCREEN_WIDTH,backgroundColor:'#ffffff',alignItems:'center',flexWrap:'wrap',marginBottom:10}}>
               {this.renderPickedImage()}
                <TouchableOpacity
                  onPress={() => {
                    ImagePicker.showImagePicker(options, (response) => {
                      if (response.didCancel) {
                        console.log('User cancelled image picker');
                      } else if (response.error) {
                        console.log('ImagePicker Error: ', response.error);
                      } else if (response.customButton) {
                        console.log('User tapped custom button: ', response.customButton);
                      } else {
                        ShowLoadingToast('正在上传图片');
                        const imageIndex = this.state.imagelist.findIndex((value, index, arr) => value.origURL === response.origURL);
                        this.props.dispatch(createAction('alarm/uploadimage')({
                            image: response,
                            callback: this.uploadImageCallBack
                          }));
                      }
                    });
                  }}
                  style={{alignItems: 'center', justifyContent: 'center',  marginRight:10}}>
                <Image source={require('../../images/home_point_add.png')} style={{ width: 60, height: 60,marginRight:5,marginLeft:5,marginBottom:8 }} />
                </TouchableOpacity>
                   
               </View>
               <View style={{flexDirection:'row',width:SCREEN_WIDTH,height:50,backgroundColor:'#f0f0f0',alignItems:'center',borderColor:'#dedede',borderWidth:1}}>
                    <Image source={require('../../images/ic_point.png')} style={{ width: 17, height: 17, marginRight:5,marginLeft:10 }} />
                    <Text style={{fontSize:16,color:'#333333',marginLeft:10,flex:1}}>定位</Text>
              </View>
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
                }}   
                coordinate={{
                  latitude: this.state.latitude ? this.state.latitude : 35.103663,
                  longitude: this.state.longitude ? this.state.longitude : 118.356618,
                }}
                style={{width:SCREEN_WIDTH,height:150,borderColor:'#dedede',borderWidth:1}}>
              </MapView>
              <TouchableOpacity style={{width: SCREEN_WIDTH-60,height:40,backgroundColor:'#40a0ff',alignSelf:'center',justifyContent:'center',alignItems:'center',marginTop:20,borderRadius:10,marginBottom:30}} onPress={()=>{this.summitAll()}}>
              <Text style={{ textAlign:'center',color:'#ffffff',fontSize:20,textAlignVertical:'center'}}>提交</Text> 
              </TouchableOpacity>
              <Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {alert("Modal has been closed.")}}>
                <View style={{backgroundColor:"#383838",opacity:0.8,position:"absolute",alignSelf:'center',flex:1,width:SCREEN_WIDTH,height:SCREEN_HEIGHT,marginTop:50}}>
                <View style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,flexDirection:'row',justifyContent:'space-between',alignSelf:'center',flexWrap:'wrap'}}>
                    <FlatList
                    style={{flex:1,marginLeft:10,marginRight:10,alignSelf:'center'}}
                    ListEmptyComponent={() => (this.props.NoAlarmDesData ? null : <View style={{ height: SCREEN_HEIGHT - 200 }}><NoDataComponent Message={'没有查询到数据'} /></View>)}
                    keyExtractor={this.extraUniqueKey}
                    data={this.props.NoAlarmDesData}
                    renderItem={this.renderItem}/>
                    <TouchableOpacity style={{position:'absolute',right:2}} onPress={() => {this.setState({modalVisible:false})}}>
                    <Image source={require('../../images/icon_close_red.png') } style={{width:25,height:25}} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              </View>
            </ScrollView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dedede',
        flexDirection:'column',
        width:SCREEN_WIDTH,
    },
});
const TimeComponent = props => (
    <TouchableOpacity onPress={props.onClick} style={{ flexDirection: 'row', height: 50, justifyContent: 'center', alignItems: 'center',backgroundColor:'#ffffff'}}>
      <Text style={{fontSize:16,color:'#333333',marginLeft:10,flex:1}}>预计恢复时间：</Text>
      <Text style={{fontSize: 16, color: '#848484',marginRight:10 }}>{`${props.extra}`}</Text>
      <Image source={require('../../images/ic_what.png')} style={{ width: 20, height: 20,marginRight:10 }} />
    </TouchableOpacity>
  );
//make this component available to the app
export default AlarmNoFeedbackCheck;
