//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,SectionList,Dimensions,Image,TouchableOpacity,FlatList } from 'react-native';
import NoDataComponent from '../../components/comment/NoDataComponent';
import LoadingComponent from '../../components/comment/LoadingComponent';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 
import Calendar from 'react-native-calendar-select';
import moment from 'moment';
import { connect } from 'react-redux';
import {Checkbox} from 'antd-mobile';
const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
/**
 * 报警-未反馈二级
 * HelenChen
 * @class AlarmNoFeedback
 * @extends {Component}
 */
@connect(({alarm,loading})=>({
    NoAlarmDesData:alarm.NoAlarmDesData,PageIndex:alarm.PageIndex,
    loading:loading.effects['alarm/GetNoAlarmDes'],}))
class AlarmNoFeedbackDes extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        title: '预警反馈',
        tabBarLable: '预警反馈',
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
          isupdate: false,
          startDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          checkboxStatemap:(new Map(): Map<string, boolean>),
          checkboxState:false,
          checkboxAlltv:'全选',
          mBeginTime:'',
          mEndTime:'',
        };
      }
      componentWillMount(){
          let mBeginTime;
          let mEndTime;
          let nowTime = (new Date()).valueOf();
          let initCurrenDate=moment(nowTime).format('YYYY-MM-DD');
          let initLastDate=moment().add(-3, 'days').format('YYYY-MM-DD');
          if(this.props.navigation.state.params.BeginTime==this.props.navigation.state.params.EndTime){
              mBeginTime=initLastDate;
              mEndTime=initCurrenDate;
          }else{
            mBeginTime=this.props.navigation.state.params.BeginTime;
            mEndTime=this.props.navigation.state.params.EndTime;
          }
        this.setState({mBeginTime:mBeginTime,mEndTime:mEndTime});
        this.props.dispatch(createAction('alarm/GetNoAlarmDes')({
            DGIMN:this.props.navigation.state.params.DGIMN,
            PointName:this.props.navigation.state.params.PointName,
            RegionCode:'',
            PolluntCode:'',
            BeginTime:mBeginTime,
            EndTime:mEndTime,
            EarlyWaringType:'',
            State:'0',
            PageIndex:this.props.PageIndex,
            PageSize:'8',
            IsPc:'false',
            }));
      }
      confirmDate=({ startDate, endDate, startMoment, endMoment }) => {
        this.setState({
          startDate: moment(startDate).format('YYYY-MM-DD'),
          endDate: moment(endDate).format('YYYY-MM-DD'),
        });
        this.props.dispatch(createAction('alarm/GetNoAlarmDes')({
            DGIMN:this.props.navigation.state.params.DGIMN,
            PointName:this.props.navigation.state.params.PointName,
            RegionCode:'',
            PolluntCode:'',
            BeginTime:moment(startDate).format('YYYY-MM-DD'),
            EndTime:moment(endDate).format('YYYY-MM-DD'),
            EarlyWaringType:'',
            State:'0',
            PageIndex:this.props.PageIndex,
            PageSize:'8',
            IsPc:'false',
        }));
      }
      //FlatList key
    _extraUniqueKey=(item,index)=> `index22${index}${item}`
      //FlatList key
      _extraUniqueKey33=(item,index)=> `index33${index}${item}`
      onChange = (val) => {
        console.log(val);
      }
    _renderItemList = (item) => {
        if(item!=null){
            return(
                <TouchableOpacity  onPress={() => {this._someChoose(item.item)}}>
                    <View style={{backgroundColor:'#ffffff',borderColor:'#d7dcdd',borderWidth:1,borderRadius:5,flexDirection:'column',height:70,marginTop:5,marginBottom:5,marginLeft:10,marginRight:10}}>
                        <View style={{flexDirection:'row',height:40,marginLeft:10,marginRight:10,alignItems:'center'}}> 
                            <View style={{flexDirection:'row',height:40,flex:1,alignItems:'center'}}> 
                                {this.state.checkboxStatemap.get(item.item.ID) ?
                                    <Image source={require('../../images/checkbox_pressed.png')} style={{ width: 17, height: 17 }} /> :
                                    <Image source={require('../../images/checkbox_normal.png')} style={{ width: 17, height: 17 }} />
                                }
                                <Text style={{fontSize:16,color:'#4c4c4c',marginLeft:5}}>{item.item.ExceptionTypeName}</Text>
                            </View>
                            <Text style={{fontSize:14,color:'#a2a2a2',marginRight:10}}>{item.item.AlarmTime.length>=16 ? item.item.AlarmTime.substring(5,16) : '时间'}</Text>
                        </View>
                            <Text style={{fontSize:12,color:'#979797',marginLeft:20,marginRight:10}}>{item.item.AlarmMsg}</Text>
                    </View>
                    </TouchableOpacity>
            )
        }{
            return(<NoDataComponent Message={'没有查询到数据'} />);
        }
    }
    //选择其中几项
    _someChoose=(item)=>{
        this.setState((state) => {
            const checkboxStatemap = new Map(state.checkboxStatemap);
            if (checkboxStatemap.get(item.ID) === undefined) {
                checkboxStatemap.set(item.ID, true); 
            } else {
                checkboxStatemap.delete(item.ID);
            }
            return { checkboxStatemap };
          });

    }
    //全选
    _allChoose=()=>{
        this.setState((state) => {
            // copy the map rather than modifying state.
            const checkboxStatemap = new Map(state.checkboxStatemap);
            let checkboxAlltv='全选';
            this.props.NoAlarmDesData.map((item, key) => {
              if (checkboxStatemap.get(item.ID) === undefined) {
                checkboxStatemap.set(item.ID, true); // toggle
                checkboxAlltv='取消全选';
              } else {
                checkboxStatemap.set(item.ID, !checkboxStatemap.get(item.ID)); // toggle
                checkboxAlltv='全选';
              }
            });
            return { checkboxStatemap,checkboxAlltv };
          });
    }
    clearselect=() => {
        this.state.checkboxStatemap.clear();
      }
    //核实
    _check=()=>{
        if (this.state.checkboxStatemap.size !== 0) {
           
            this.props.dispatch(NavigationActions.navigate({
                routeName: 'AlarmNoFeedbackCheck',                        
                params: {
                    checkboxStatemap: this.state.checkboxStatemap,
                    DGIMN: this.props.navigation.state.params.DGIMN,
                    clearselect: this.clearselect
                } }));
          } else {
            ShowToast('请选择报警记录进行核实');
          }
    }
    render() {
        let nowTime = (new Date()).valueOf();
        let initCurrenDate=moment(nowTime).format('YYYY-MM-DD');
        let initLastDate=moment().add(-3, 'days').format('YYYY-MM-DD');
        const color = {
            subColor: '#fff',
            mainColor: '#4c68ea'
          };
        if(this.props.navigation.state.params.BeginTime==this.props.navigation.state.params.EndTime){
            mBeginTime=initLastDate;
            mEndTime=initCurrenDate;
        }else{
          mBeginTime=this.props.navigation.state.params.BeginTime;
          mEndTime=this.props.navigation.state.params.EndTime;
        }
        let chooseTime = '自 '+mBeginTime+' 至 '+ mEndTime;
        return (
            <View style={styles.container}>
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
                <TouchableOpacity onPress={() => {this.calendar && this.calendar.open();}}>
                    <View style={{flexDirection:'row',width:SCREEN_WIDTH,height:30,backgroundColor:'#f3f3f3',alignItems:'center'}}>
                        <Image source={require('../../images/icon_alarm_time.png')} style={{ marginLeft: 10, height: 15, width: 15 }} />
                        <Text style={{fontSize:14,color:'#5285ed', marginLeft: 5}}>{chooseTime}</Text>
                    </View>
                </TouchableOpacity>
                {this.props.loading?
                <LoadingComponent Message={'正在加载数据'} /> :
                <FlatList           
                ListEmptyComponent={() => (this.props.NoAlarmDesData ? null : <View style={{ height: SCREEN_HEIGHT - 200 }}><NoDataComponent Message={'没有查询到数据'} /></View>)}
                data={this.props.NoAlarmDesData}
                renderItem={this._renderItemList}
                keyExtractor={this._extraUniqueKey}
                onEndReachedThreshold={0.5}
                initialNumToRender={8}
                refreshing={false}
                onRefresh={() => {
                  this.props.dispatch(createAction('alarm/GetNoAlarmDes')({
                      DGIMN:this.props.navigation.state.params.DGIMN,
                      PointName:this.props.navigation.state.params.PointName,
                      RegionCode:'',
                      PolluntCode:'',
                      BeginTime:this.state.mBeginTime,
                      EndTime:this.state.mEndTime,
                      EarlyWaringType:'',
                      State:'0',
                      PageIndex:1,
                      PageSize:'8',
                      IsPc:'false',
                      }));
                }}
                onEndReached={(info) => {
                    let loadingpage=1;
                    if(this.props.PageIndex>=1){
                        loadingpage=this.props.PageIndex+1;
                    }else{
                        loadingpage=1;
                    }
                  this.props.dispatch(createAction('alarm/GetNoAlarmDes')({
                      DGIMN:this.props.navigation.state.params.DGIMN,
                      PointName:this.props.navigation.state.params.PointName,
                      RegionCode:'',
                      PolluntCode:'',
                      BeginTime:this.state.mBeginTime,
                      EndTime:this.state.mEndTime,
                      EarlyWaringType:'',
                      State:'0',
                      PageIndex:loadingpage,
                      PageSize:'8',
                      IsPc:'false',
                      }));
                }}/>}
                <View style={{width:SCREEN_WIDTH,height:50,flexDirection:'row',alignItems:'center'}}>
                    <TouchableOpacity style={{height:50,backgroundColor:'#ffffff',flex:1,alignItems:'center', justifyContent: 'center',}} onPress={() => {this._allChoose()}}>
                        <Text style={{fontSize:18,color:'#333333',textAlign:'center',textAlignVertical:'center'}}>{this.state.checkboxAlltv}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{height:50,backgroundColor:'#4884f5',flex:1,alignItems:'center', justifyContent: 'center',}} onPress={() => {this._check()}}>
                        <Text style={{fontSize:18,color:'#ffffff',textAlign:'center',textAlignVertical:'center'}}>反馈</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#e8f3f8',
        flexDirection:'column'
    },
});

//make this component available to the app
export default AlarmNoFeedbackDes;
