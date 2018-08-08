//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, Image,TextInput,ScrollView,TouchableOpacity,Modal,FlatList,Alert } from 'react-native';
import alarmJson from '../../config/configjson/alarm.json';
import {MapView, Marker, Polyline} from 'react-native-amap3d';
import { DatePicker, List,TextareaItem } from 'antd-mobile';
import { connect } from 'react-redux';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import NoDataComponent from '../../components/comment/NoDataComponent';
import { Radio} from 'antd-mobile';
import AlarmNoFeedbackCheckMap from '../../components/Alarm/AlarmNoFeedbackCheckMap';
const RadioItem = Radio.RadioItem;
import { createAction,ShowToast,NavigationActions,CloseToast,ShowResult,ShowLoadingToast} from '../../utils'; 
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

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
@connect(({alarm})=>({
  NoAlarmDesData:alarm.NoAlarmDesData,
  }))
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
        this.state = {        
            rotateEnabled: false,//地图旋转
            RecoveryTime: moment().add(alarmJson.data[0].recoverTime, 'hours'),
            modalVisible:false,
            reasonStatemap:(new Map(): Map<string, boolean>),
            longitude: '',
            latitude: '',
            sceneDescription:'',
            imagelist: [],
            value:0,
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
    debugger;
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
  
  feedbackCallback=() => {
    this.props.navigation.state.params.clearselect;
    this.props.dispatch(NavigationActions.back());
    CloseToast();
    ShowResult(true, '反馈成功');
  }
  //提交全部
  summitAll=()=>{
    debugger;
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
            WarningReason: this.state.value,
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
                <TouchableOpacity style={{width:SCREEN_WIDTH,height:30,justifyContent:'center',alignItems:'center'}} onPress={() => {this.lookMore()}}>
                <Text style={{fontSize:14,color:'#4782f5',textAlignVertical:'center',textAlign:'center'}}>点击查看已选预警信息</Text>
                </TouchableOpacity>
                <View style={{flexDirection:'row',width:SCREEN_WIDTH,height:120,marginTop:1,marginBottom:1,backgroundColor:'#ffffff'}}>
                <Text style={{fontSize:16,marginLeft:10,marginRight:10,color:'#333333',textAlignVertical:'center'}}>预警原因:</Text>
                <View style={{width:SCREEN_WIDTH/2,height:120,backgroundColor:'#ffffff'}}>
                <RadioForm
                  radio_props={alarmJson.data[0].alarmCheckReasons}
                  formHorizontal={true}
                  labelColor={'#7b7b7b'}
                  initial={0}
                  style={{flex:1,height:120,backgroundColor:'#ffffff',flexWrap:'wrap',marginTop:6,marginBottom:6}}
                  onPress={(value) => {this.setState({value:value})}}/>
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
                style={{height: 50,backgroundColor:'#ffffff',marginRight:10,width:SCREEN_WIDTH-100,marginTop:1}}
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
                      } else if (response.error) {
                      } else if (response.customButton) {
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
                <Image source={require('../../images/home_point_add.png')} style={{ width: 60, height: 60,marginRight:5,marginLeft:10,marginBottom:8 }} />
                </TouchableOpacity>
                   
               </View>
               <View style={{flexDirection:'row',width:SCREEN_WIDTH,height:50,backgroundColor:'#f0f0f0',alignItems:'center',borderColor:'#dedede',borderWidth:1}}>
                    <Image source={require('../../images/ic_point.png')} style={{ width: 17, height: 17, marginRight:5,marginLeft:10 }} />
                    <Text style={{fontSize:16,color:'#333333',marginLeft:10,flex:1}}>定位</Text>
              </View>
              <AlarmNoFeedbackCheckMap onstateChange={(longitude,latitude)=>{
               this.setState({
                longitude: longitude,
                latitude: latitude
              });
              }}/>              
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
      <View style = {{ flexDirection: 'row', height: 50,  alignItems: 'center',backgroundColor:'#ffffff'}}>
        <TouchableOpacity onPress={props.onClick} style={{flexDirection: 'row',}}>
          <Text style={{fontSize:16,color:'#333333',marginLeft : 10}}>预计恢复时间：</Text>
          <Text style={{fontSize: 16, color: '#848484' ,marginLeft:30}}>{`${props.extra}`}</Text>
        
        </TouchableOpacity>
        <TouchableOpacity onPress = {()=> {

          Alert.alert('预计恢复时间说明','  设备故障：默认预计恢复正常时间当天24点\n  突发性环境污染：默认预计恢复正常时间当天24点前\n  区域性污染：默认预计恢复正常时间为从当前时间计算24小时后\n   其他因素默认：预计恢复正常时间为3小时后\n此处时间均可根据实际情况做修改');
        }
          
        } style={{ marginRight :5 ,marginLeft:5}}>
        <Image source={require('../../images/ic_what.png')} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
      
      </View>

   
  );
//make this component available to the app
export default AlarmNoFeedbackCheck;
