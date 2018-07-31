//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet ,Dimensions,Image,TextInput,TouchableOpacity} from 'react-native';
import {MapView, Marker, Polyline} from 'react-native-amap3d'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import city from '../../utils/city';
import { Picker, List,Modal,Button} from 'antd-mobile';
import { createForm } from 'rc-form';
import app from '../../models/app'
import { createAction,CloseToast,ShowLoadingToast,ShowToast} from '../../utils';


const SCREEN_WIDTH=Dimensions.get('window').width;
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
  const operation = Modal.operation;

/**
 * 添加站点
 * Helenchen
 * @class AddPoint
 * @extends {Component}
 */
@connect(({app}) => ({pointTypeList: app.pointTypeList }))
class AddPoint extends PureComponent {
    
    constructor(props) {
        super(props); 
        this.state = {
            pointname: '',
            pointdgmin:'',
            rotateEnabled: false,//地图旋转
            longitude: 0,
            latitude: 0,
            imagelist: [],
            refresh: false,
            pickerValue:[],
            data: [],
            itemPointValue:null,
                   
        };
      }
      logLocationEvent = ({ nativeEvent }) => { 
        this.setState({
          longitude: nativeEvent.longitude,
          latitude: nativeEvent.latitude
        });
      }
      renderPickedImage=() => {
        const rtnVal = [];
        this.state.imagelist.map((item, key) => {
          const source = { uri: item.uri };
          rtnVal.push(
            <View
              key={item.uploadID}
              style={{ marginTop: 10,
                marginLeft: 10,
                width: SCREEN_WIDTH / 4 - 20,
                height: SCREEN_WIDTH / 4 - 20,
                borderColor: '#a3a3a3',
                borderWidth: 1 }}>
              <Image
                source={source}
                style={{ width: SCREEN_WIDTH / 4 - 20,
                  height: SCREEN_WIDTH / 4 - 20 }}/>
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
                <Icon style={{ backgroundColor: 'rgba(0,0,0,0)' }} name="ios-close-outline" size={25} color={'#a3a3a3'} />
              </TouchableOpacity>
            </View>
          );
        });
        return rtnVal;
      }

      uploadImageCallBack=(img) => {
        this.setState((state) => {

          const imagelist = state.imagelist;
          const refresh = !state.refresh;
          imagelist.push(img);
          return { imagelist, refresh };
        });
        CloseToast();
      }
      uploadPointTypeCallBack=(point) => {
        
        const opItem = [];
        this.props.pointTypeList.map((item, index) => {
          opItem.push({ text: `${item.PollutantTypeName}[${item.PollutantTypeCode}]`,
            onPress: () => {
              this.onClose(item);
              
            } });
        });
        operation(opItem);
      }
      onClose = (itemVaule) => {
          this.setState({
            itemPointValue: itemVaule
          });      
      }

      //提交全部
      _commitAll = async () => {     
        this.props.dispatch(createAction('app/commitAll')({        
          pointname: this.state.pointname,
          pointdgmin: this.state.pointdgmin,
          PollutantTypeCode:this.state.itemPointValue.PollutantTypeCode,
          pickerValue:this.state.pickerValue,
          longitude:this.state.longitude,
          latitude: this.state.latitude,         
          
        }));  
 
      };

    render() { 
      
        return (          
            <View style={styles.container}>
             <KeyboardAwareScrollView ref="scroll">
                <Image source={require('../../images/home_top.png')} style={{height:10}}></Image>
                <View style={styles.itemStyle}>
                    <Image source={require('../../images/home_point_name.png')} style={styles.imageStyle}></Image>
                    <Text style={styles.textStyle}>监测点名称</Text>
                    <TextInput keyboardType={'default'} clearTextOnFocus placeholderTextColor="gray" placeholder="请输入监测点名称" 
                        autoCapitalize={'none'} autoCorrect={false} underlineColorAndroid={'transparent'} 
                        onChangeText={(text)=>{//动态更新组件内state 记录输入内容
                            this.setState({pointname:text,});;}}                           
                        value={this.state.pointname}    
                        style={{width:SCREEN_WIDTH/2-50,placeholderTextColor: '#646363',position:'absolute',right:12}}/>
                </View>

                <View style={styles.itemStyle}>
                <Image source={require('../../images/home_point_dgmin.png')} style={styles.imageStyle}></Image>
                <Text style={styles.textStyle}>设备编号</Text>
                <TextInput keyboardType={'default'} clearTextOnFocus placeholderTextColor="gray" placeholder="  请输入设备编号" 
                    autoCapitalize={'none'} autoCorrect={false} underlineColorAndroid={'transparent'} 
                    onChangeText={(text)=>{//动态更新组件内state 记录输入内容
                        this.setState({pointdgmin:text,});;}}                           
                    value={this.state.pointdgmin}    
                    style={{width:SCREEN_WIDTH/2-50,placeholderTextColor:'#646363',position:'absolute',right:10}}/>
                </View>

                <View style={styles.itemStyle}>
                    <Image source={require('../../images/home_point_type.png')} style={styles.imageStyle}></Image>
                    <Text style={styles.textStyle}>设备类型</Text>
                    <TouchableOpacity onPress={() => {                                           
                      this.props.dispatch(createAction('app/getPointTypeList')({                       
                        callback: this.uploadPointTypeCallBack
                      }));
                    }} 
                    style={{width:SCREEN_WIDTH/2-50,position:'absolute',right:3}}>
                    <Text style={{color:'#646363',fontSize:14}}>{
                      this.state.itemPointValue!=null?this.state.itemPointValue.PollutantTypeName:'请选择设备类型'}</Text>                   
                    </TouchableOpacity>
                </View>
       
                <View style={styles.itemStyle}>
                    <Image source={require('../../images/home_point_region.png')} style={styles.imageStyle}></Image>
                    <Text style={styles.textStyle}>行政区划</Text>
                    <View style={{flex:1,marginRight:10,marginRight:10}}>     
                        <Picker extra="请选择行政区划"
                        data={city}
                        title="行政区划"   
                        value={this.state.pickerValue}                       
                        onPickerChange={v => this.setState({ pickerValue: v })}
                        onOk={v => this.setState({ pickerValue: v })}      
                        >               
                        <CustomChildren>Customized children</CustomChildren>
                        </Picker>                       
                    </View>  
                </View>

                <View style={styles.mapStyle}>
                        <View style={styles.mapTopStyle}>
                            <Image source={require('../../images/home_point_local.png')} style={styles.imageStyle}></Image>
                            <Text style={styles.textStyle}>定位</Text>
                        </View>
                        <MapView 
                        locationEnabled
                        onLocation={this.logLocationEvent}
                        coordinate={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                          }}
                        zoomLevel={18} 
                        rotateEnabled={this.state.rotateEnabled}   
                        style={{width:SCREEN_WIDTH-8,height:180,marginLeft:8,marginRight:8,marginBottom:10}}/>
                       
                </View> 
                
                <View style={styles.photoStyle}>
                    <View style={styles.mapTopStyle}>
                        <Image source={require('../../images/home_point_photo.png')} style={styles.imageStyle}></Image>
                        <Text style={styles.textStyle}>图片</Text>
                    </View>            

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start',marginBottom:5}}>
                    {this.renderPickedImage()}
                    <TouchableOpacity
                      onPress={() => {
                        ImagePicker.showImagePicker(options, (response) => {
                          if (response.didCancel) {
                          } else if (response.error) {
                          } else if (response.customButton) {
                          } else {
                            ShowLoadingToast('正在上传图片');
                            const imageIndex = this.state.imagelist
                              .findIndex((value, index, arr) => value.origURL === response.origURL);
                              this.props.dispatch(createAction('app/uploadimage')({
                                image: response,
                                callback: this.uploadImageCallBack
                              }));                          
                          }
                        });
                      }}
                      style={{ marginTop: 10,
                        marginLeft: 10,                   
                        alignItems: 'center',
                        justifyContent: 'center'}}
                    >
                    <Image source={require('../../images/home_point_add.png')} style={{width:SCREEN_WIDTH / 4 - 20,height:SCREEN_WIDTH / 4 - 20,marginLeft:10}}></Image>
                    </TouchableOpacity>
                  </View>

                </View>

                <Button style={{ width: 280 ,backgroundColor:'white',height:40,marginTop:20,alignSelf:'center',marginBottom:20}} className="btn" type="ghost" inline onClick={()=>this._commitAll()}>提交</Button>
               
             </KeyboardAwareScrollView>
            </View>
        );
    }
}
 
  const CustomChildren = props => (
    <TouchableOpacity onPress={props.onClick} style={{ flexDirection: 'row', height: 50, justifyContent: 'center', alignItems: 'center', }}>
    
      <Text style={{ marginLeft: 5, fontSize: 14, color: '#646363' }}>{`${props.extra}`}</Text>
    </TouchableOpacity>
  );
  
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efeeee',
        flexDirection: 'column',
        
    },
    itemStyle:{
        width:SCREEN_WIDTH,
        flexDirection:'row',
        backgroundColor:'#ffffff',
        height:50,
        marginTop:10,
        alignItems:'center',
    },
    imageStyle:{
        width:24,
        height:24,
        marginLeft:10,
    },
    textStyle:{
        flex:1,
        fontSize:16,
        color:'#4d4d4e',
        marginRight:10,
        marginLeft:5,       
    },
    mapStyle:{
        marginTop:10,
        flexDirection: 'column',
        backgroundColor:'#ffffff',
        justifyContent:'center',
        alignItems:'center',
    },
    photoStyle:{
        marginTop:10,
        flexDirection: 'column',
        backgroundColor:'#ffffff',
        justifyContent:'center',
        
    },
    mapTopStyle:{
        flexDirection:'row',
        backgroundColor:'#ffffff',
        height:40,
        marginTop:10,
        alignItems:'center',
    
    },
    imagePhotoStyle:{
        width:60,
        height:60,
        marginLeft:20,
        marginBottom:10,
    },
});

//make this component available to the app
export default AddPoint;

