//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions,Image,TouchableOpacity,Modal,FlatList } from 'react-native';
import { SegmentedControl } from 'antd-mobile';
import PointDetailsFlatList from '../PointDetails/PointDetailsFlatList';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 
import { connect } from 'react-redux';
import {kindCode,kindAndCode} from '../../utils/mapconfig';
import NoDataComponent from '../../components/comment/NoDataComponent';
import Calendar from 'react-native-calendar-select';
import moment from 'moment';

const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
/**
 * 站点详情--数据
 * HelenChen
 * @class PointDetailsShow
 * @extends {Component}
 */
@connect(({})=>({}))
class PointDetailsShow extends Component {
    constructor(props) {
        super(props); 
        this.state = {        
            modalVisible:false,
            startDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            PagerIndex:'0',
            codeClickID:'',
            codeClickName:'',
        }
      }
    
    render() {
        let pointName=this.props.pointDetails.pointName ? this.props.pointDetails.pointName : '-- --';
        let region=this.props.pointDetails.region ? this.props.pointDetails.region : '-- --';
        let pollutantType=this.props.pointDetails.pollutantType ? this.props.pointDetails.pollutantType : '-- --';
        let linkman=this.props.pointDetails.linkman ? this.props.pointDetails.linkman : '-- --';
        let dgimn=this.props.pointDetails.dgimn ? this.props.pointDetails.dgimn : '-- --';
        let equitmentType=this.props.pointDetails.equitmentType ? this.props.pointDetails.equitmentType : '-- --';
        let mkindCode=kindAndCode(equitmentType);
        let showIndex=this.state.PagerIndex;
        const color = {
            subColor: '#fff',
            mainColor: '#4c68ea'
          };
        let startTime=this.state.startDate;
        let endTime=this.state.endDate;
        let initLastDate=moment().add(-3, 'days').format('YYYY-MM-DD');
        startTime=(startTime==endTime ? initLastDate : startTime);
        let chooseTime = startTime + '至' + endTime;
        let codeClickID=this.state.codeClickID;
        return (
            <View style={styles.container}>
                <View style={{flexDirection:'row',height:40,marginTop:1,backgroundColor:'#ffffff',alignItems:'center',justifyContent: 'center',}}>
                    <Text style={{fontSize:16,color:'#4b66e4',marginLeft:10,marginRight:10,textAlignVertical:'center'}}>{pointName+'('+region+')'}</Text>
                </View>
                <View style={{flexDirection:'row',height:40,marginTop:1,backgroundColor:'#ffffff',alignItems:'center',justifyContent: 'center',}}>
                    <Text style={{fontSize:14,color:'#818181',marginLeft:10,flex:1,textAlignVertical:'center'}}>设备类型：</Text>
                    <Text style={{fontSize:16,color:'#4b66e4',marginRight:10,textAlignVertical:'center'}}>{pollutantType}</Text>
                </View>
                <View style={{flexDirection:'row',height:40,marginTop:1,backgroundColor:'#ffffff',alignItems:'center',justifyContent: 'center',}}>
                    <Text style={{fontSize:14,color:'#818181',marginLeft:10,flex:1,textAlignVertical:'center'}}>管理人员</Text>
                    <Text style={{fontSize:16,color:'#4b66e4',marginRight:10,textAlignVertical:'center'}}>{linkman}</Text>
                </View>
                <SegmentedControl
                style={{height:38,marginTop: 10, backgroundColor:'#ffffff'}}
                values={['小时数据', ' 日数据']}
                onChange={this.onChange}
                onValueChange={this.onValueChange}/>
                <View style={{flexDirection:'row',width:SCREEN_WIDTH,height:30,marginTop:1,backgroundColor:'#ffffff',alignItems:'center',justifyContent:'space-between'}}>
                    {
                        // <TouchableOpacity onPress={()=>{this.chooseTime()}}>
                        // <Image source={require('../../images/time.png')} style={{width:26,height:26,marginLeft:10}}/>
                        // </TouchableOpacity>
                    }
                    <Calendar
                    i18n="zh"
                    ref={(calendar) => { this.calendar = calendar; }}
                    color={color}
                    format="YYYYMMDD"
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    minDate={moment().format('YYYY0101')}
                    maxDate={moment().format('YYYYMMDD')}
                    onConfirm={this.confirmDate}/>
                    <Text style={{flex:1,marginTop:5,backgroundColor:'#ffffff',fontSize:15,color:'#4b66e4',textAlign:'center',alignSelf:'center'}}>{this.state.codeClickName!='' ? this.state.codeClickName : 'AQI'}</Text>
                    {
                        <TouchableOpacity onPress={()=>{this.chooseCode()}}>
                        <Image source={require('../../images/pollution_type_on.png')} style={{width:26,height:26,marginRight:10}}/>
                        </TouchableOpacity>
                    }
                   
                    <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {alert("Modal has been closed.")}}>
                    <View style={{backgroundColor:"#383838",opacity:0.8,position:"absolute",alignSelf:'center',flex:1,width:SCREEN_WIDTH-40,marginTop:150,borderRadius:10}}>
                        <View style={{flex:1,width:SCREEN_WIDTH-40,flexDirection:'column',backgroundColor:'#ffffff',borderRadius:10,alignItems:'center',justifyContent: 'center', }}>
                            <View style={{width:SCREEN_WIDTH-40,height:40,alignSelf:'center'}}>
                                <View style={{alignItems:'center',justifyContent: 'center',width:SCREEN_WIDTH-40,height:40,backgroundColor:'#5a78ed',borderTopLeftRadius:10,borderTopRightRadius:10  }}>
                                <Text style={{fontSize:17,color:'#ffffff',textAlignVertical:'center'}}>监测因子选择</Text>
                                </View>
                                <TouchableOpacity style={{position:'absolute',right:2}} onPress={() => {this.setState({modalVisible:false})}}>
                                <Image source={require('../../images/icon_close_red.png') } style={{width:25,height:25}} />
                                </TouchableOpacity>
                            </View>
                            <View style={{width:SCREEN_WIDTH-40,flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',backgroundColor:'#ffffff'}}>
                                <FlatList
                                ListEmptyComponent={() => (mkindCode ? null : <View style={{ height: SCREEN_HEIGHT - 200 }}><NoDataComponent Message={'没有查询到数据'} /></View>)}
                                keyExtractor={this.extraUniqueKey}
                                data={mkindCode}
                                renderItem={this.renderItem}
                                numColumns={2}/>
                           </View>
                        </View>
                    </View>
                    </Modal>
                </View>
                <Text style={{width:SCREEN_WIDTH,backgroundColor:'#ffffff',fontSize:13,color:'#818181',textAlign:'center',alignSelf:'center'}}>{chooseTime}</Text>
                <PointDetailsFlatList pointDetailsShow={{dgimn,showIndex,codeClickID,startTime,endTime}}/>
            </View>
        );
    }
    onChange = (e) => {
        const i = e.nativeEvent.selectedSegmentIndex;
        //小时数据 日数据
        if(i==0){
            this.setState({PagerIndex:'0'});
        }else{
            this.setState({PagerIndex:'1'});
        }
        console.log('=============站点详情onChange=======================');
        console.log(i);
        
    }
    onValueChange = (value) => {
        console.log('=============站点详情onValueChange=======================');
    }
    //选择监测因子
    chooseCode=()=>{
        this.setState({modalVisible:true});
    }
    //选择时间
    chooseTime=()=>{
        this.calendar && this.calendar.open();
    }
    //选中时间
    confirmDate=({ startDate, endDate, startMoment, endMoment }) => {
        this.setState({
          startDate: moment(startDate).format('YYYY-MM-DD'),
          endDate: moment(endDate).format('YYYY-MM-DD'),
        });

        let dgimn=this.props.pointDetails.dgimn
        let codeClickID=this.state.codeClickID;
        let startTime=this.state.startDate;
        let endTime=this.state.endDate;
        this.props.dispatch(createAction('app/GetHourDatas')({
          dgimn:dgimn,
          codeClickID:codeClickID,
          startTime:startTime,
          endTime:endTime
           }));
      }

    extraUniqueKey=(item, index) => `index7${index}${item}`
    //渲染污染因子
    renderItem=({ item }) => {
        let codeName;
        if(item.pcode=='a34004'){
            codeName='PM2.5';
        }else{
            codeName=item.pname;
        }
        return (
            <TouchableOpacity onPress={()=>{this.codeClick(item)}}>
              <Text style={{width:SCREEN_WIDTH/2-60,height:40,fontSize:16,color:this.state.codeClickID==item.pcode ? '#f8850b' : '#333333',marginLeft:5,textAlign:'center',alignSelf:'center'}}>{codeName}</Text>
              </TouchableOpacity>
        );
    }
    //选择的code
    codeClick=(item)=>{
        this.setState({
            codeClickID:item.pcode,
            codeClickName:item.pname,
            modalVisible:false
        });
        let dgimn=this.props.pointDetails.dgimn
        let codeClickID=this.state.codeClickID;
        let startTime=this.state.startDate;
        let endTime=this.state.endDate;
        this.props.dispatch(createAction('app/GetHourDatas')({
            dgimn:dgimn,
            codeClickID:codeClickID,
            startTime:startTime,
            endTime:endTime
             }));
    }

}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        height:SCREEN_HEIGHT,
        width:SCREEN_WIDTH
    },
});

//make this component available to the app
export default PointDetailsShow;