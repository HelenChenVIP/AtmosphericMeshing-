//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,SectionList,Dimensions,Image,TouchableOpacity,FlatList } from 'react-native';
import NoDataComponent from '../comment/NoDataComponent';
import LoadingComponent from '../comment/LoadingComponent';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 
import Calendar from 'react-native-calendar-select';
import moment from 'moment';
import { connect } from 'react-redux';
const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * 报警-已反馈
 * HelenChen
 * @class AlarmNoFeedback
 * @extends {Component}
 */
@connect(({alarm,loading})=>({
    mainAlarmData:alarm.mainAlarmData,timeData:alarm.timeData,
    loading:loading.effects['alarm/GetMainAlarm'],}))
class AlarmDoneFeed extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
          isupdate: false,
          startDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
      }
      componentWillMount(){
        let nowTime = (new Date()).valueOf();
        let initCurrenDate=moment(nowTime).format('YYYY-MM-DD');
        let initLastDate=moment().add(-3, 'days').format('YYYY-MM-DD');
        this.props.dispatch(createAction('alarm/GetMainAlarm')({
            starttime:initLastDate,
            endtime:initCurrenDate,
            polluntCode:'',
            warnReason:'',
            RegionCode:'',
            pointName:'',
            state:'2'
            }));
       } 

      confirmDate=({ startDate, endDate, startMoment, endMoment }) => {
        this.setState({
          startDate: moment(startDate).format('YYYY-MM-DD'),
          endDate: moment(endDate).format('YYYY-MM-DD'),
        });
        this.props.dispatch(createAction('alarm/GetMainAlarm')({
        starttime:moment(startDate).format('YYYY-MM-DD'),
        endtime:moment(endDate).format('YYYY-MM-DD'),
        polluntCode:'',
        warnReason:'',
        RegionCode:'',
        pointName:'',
        state:'2'
        }));
      }
      //FlatList key
    _extraUniqueKey=(item,index)=> `index22${index}${item}`
    _renderItemList = (item) => {
        if(item!=null){
            return(
                <TouchableOpacity onPress={() => {
                    this.props.dispatch(createAction('alarm/updateState')({
                        DGIMN:item.item.dgimn,
                        PointName:item.item.pointName,
                        BeginTime:this.state.startDate,
                        EndTime:this.state.endDate,
                        RegionCode:'',
                        PolluntCode:'',
                        EarlyWaringType:'',
                        State:'1',
                        IsPc:'false',
                        PageSize:'8',}));
                    this.props.dispatch(NavigationActions.navigate({
                        routeName: 'AlarmDoneFeedDes',                        
                        params: {} }));

                }}>
                    <View style={{backgroundColor:'#ffffff',borderColor:'#d7dcdd',borderWidth:1,borderRadius:5,flexDirection:'row',height:70,marginTop:10,marginLeft:10,marginRight:10}}>
                        <Image source={require('../../images/icon_alarm_point.png')} style={{width:40,height:40,marginLeft:10,alignSelf:'center'}}></Image>
                        <View style={{flexDirection:'column',alignItems:'center',marginLeft:10,alignSelf:'center',flex:1}}>
                            <Text style={{fontSize:14,color:'#333333',alignSelf:'flex-start'}}>{item.item.pointName}</Text>
                            <Text style={{fontSize:12,color:'#757575',marginTop:5,alignSelf:'flex-start'}}>{item.item.regionName}</Text>
                        </View>
                        <View style={{flexDirection:'column',width:40,marginRight:10,justifyContent:'center',alignItems:'center'}}>
                            <View style={{flexDirection:'column',width:40,marginRight:10,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontSize:12,color:'#969696'}}>{'已反馈'}</Text>
                                <View style={{backgroundColor:'#5285ed',width:30,height:20,borderColor:'#5285ed',borderRadius:10,marginTop:5,}}>
                                <Text style={{fontSize:12,color:'white',textAlign:'center',textAlignVertical:'center'}}>{item.item.count}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }{
            return(<NoDataComponent Message={'没有查询到数据'} />)
        }
    }
    render() {
        let CurrenDate=this.props.timeData.length>0 ?this.props.timeData[0].endtime: this.state.endDate;
        let LastDate=this.props.timeData.length>0 ?this.props.timeData[0].starttime:this.state.startDate;
        let nowTime = (new Date()).valueOf();
        let initCurrenDate=moment(nowTime).format('YYYY-MM-DD HH:mm:ss');
        let initLastDate=moment().add(-3, 'days').format('YYYY-MM-DD HH:mm:ss');
        let chooseTime = CurrenDate==LastDate ? '自 '+initLastDate+' 至 '+ initCurrenDate : '自 '+LastDate+' 至 '+CurrenDate;
        return (
            <View style={styles.container}>
                <Calendar
                i18n="zh"
                ref={(calendar) => { this.calendar = calendar; }}
                color={color}
                format="YYYYMMDD"
                startDate={this.props.timeData.length>0 ?this.props.timeData[0].starttime:this.state.startDate}
                endDate={this.props.timeData.length>0 ?this.props.timeData[0].endtime: this.state.endDate}
                minDate={moment().format('YYYY0101')}
                maxDate={moment().format('YYYYMMDD')}
                onConfirm={this.confirmDate}/>
                <TouchableOpacity onPress={() => {this.calendar && this.calendar.open();}}>
                    <View style={{flexDirection:'row',width:SCREEN_WIDTH,height:30,backgroundColor:'#f3f3f3',alignItems:'center'}}>
                        <Image source={require('../../images/icon_alarm_time.png')} style={{ marginLeft: 10, height: 15, width: 15 }} />
                        <Text style={{fontSize:14,color:'#5285ed', marginLeft: 5}}>{chooseTime}</Text>
                    </View>
                </TouchableOpacity>
                {
                    this.props.loading ? 
                    <LoadingComponent Message={'正在加载数据'} /> :
                    <FlatList   
                    ListEmptyComponent={() => (this.props.mainAlarmData.length ? null : <View style={{ height: SCREEN_HEIGHT - 200 }}><NoDataComponent Message={'没有查询到数据'} /></View>)}
                    data={this.props.mainAlarmData}
                    renderItem={this._renderItemList}
                    keyExtractor={this._extraUniqueKey}/>
                }
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
export default AlarmDoneFeed;
