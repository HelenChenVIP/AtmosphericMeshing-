//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import moment from 'moment';
import { connect } from 'react-redux';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 
const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
let chooseDays=[];
/**
 * 日历时间选择
 * Helenchen
 * @class MyCalendar
 * @extends {Component}
 */
@connect(({})=>({}))
class MyCalendar extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        title: '时间选择',
        tabBarLable: '时间选择',
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
            startDay:'',
            chooseTimeList:[],
            mTimeList:[],
            HourStartTime:'',
            HourendTime:moment().format('YYYY-MM-DD HH:mm:ss'),
            DaystartTime:'',
            DayendTime:moment().format('YYYY-MM-DD HH:mm:ss'),

        };
        this.onDayPress = this.onDayPress.bind(this);
       
        
    }
    render() {
        let dataSelect = {};
        if(this.state.mTimeList!=null && this.state.mTimeList!='' && this.state.mTimeList.length>0){
            this.state.mTimeList.map((item,key)=>{
                const day=moment(item).format('YYYY-MM-DD');
                dataSelect[day] = {selected: true, marked: true}
            });
        }
        return (
            <View style={styles.container}>
                <CalendarList
                    minDate={'2017-01-01'}
                    maxDate={'2019-12-31'}
                    monthFormat={'yyyy MM'}
                    onDayPress={this.onDayPress}
                    onDayLongPress={this.onDayPress}
                    onMonthChange={(month) => {console.log('month changed', month)}}
                    onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
                    pastScrollRange={12}
                    futureScrollRange={12}
                    scrollEnabled={true}
                    showScrollIndicator={true}
                    markedDates={dataSelect}/>
                <TouchableOpacity 
                style={{width:SCREEN_WIDTH-80,height:44,backgroundColor:'#568af5',position:'absolute',bottom:16,alignContent:'center',alignItems:'center',borderRadius:4}}
                onPress={()=>{this.backView()}}>
                    <Text style={{width:SCREEN_WIDTH-100,height:50,fontSize:18,color:'#ffffff',textAlign:'center',textAlignVertical:'center'}}>确定</Text>
                </TouchableOpacity>
            </View>
        );
    }
    backView=()=>{
        this.props.dispatch(NavigationActions.back({}));
    }

    onDayPress(day) {
        switch(chooseDays.length){
            case 0:
            chooseDays[0]=day.dateString;
            break;
            case 1:
            chooseDays[1]=day.dateString;
            break;
            default:
            chooseDays.length=0;
            chooseDays[0]=day.dateString;
            break;
        }
        let mBeging='';
        let time='';
        mBeging=chooseDays[0];
        if(chooseDays.length<2){
            time=chooseDays[0];
        }else{
            time=chooseDays[1];
        }
        let mTimeList=[];
        let ff=[];
        if(time>mBeging){
            ff=[mBeging];
            while (time>mBeging)
            {
                mBeging=moment(mBeging).add(1, 'd').format('YYYY-MM-DD HH:mm:ss');
                mTimeList.push(mBeging);
            }
        }else if(time<mBeging){
            ff=[time];
            while (time<mBeging)
            {
                time=moment(time).add(1, 'd').format('YYYY-MM-DD HH:mm:ss');
                mTimeList.push(time);
            }
        }else{
            ff=[chooseDays[0]];
            mTimeList=chooseDays[0];
        }
        let allTimeList=ff.concat(mTimeList);
        this.setState({
            mTimeList:allTimeList
        });
        this._timeLongs(allTimeList);
    }
    _timeLongs=(allTimeList)=>{
        let aTime=moment(allTimeList[0]).format('YYYY-MM-DD HH:mm:ss');
        let bTime=moment(allTimeList[allTimeList.length-1]).format('YYYY-MM-DD HH:mm:ss');
        let starttime='';
        let endtime='';
        if(aTime<bTime){
             starttime=aTime;
             endtime=bTime;
        }else{
             starttime=bTime;
             endtime=aTime;
        }
        if(starttime!='' && endtime!='' && starttime!=endtime){
            if(this.props.navigation.state.params.PagerIndex=='0'){
                this.setState({
                    HourStartTime: starttime,
                    HourendTime:endtime,},
                    ()=>{
                    this.props.dispatch(createAction('pointdetails/updateState')({
                        HourStartTime: starttime,
                        HourendTime: endtime,
                    }))
                    this.props.dispatch(createAction('pointdetails/GetHourDatas')({}));
                });
                
            }else{
                this.setState({
                    DaystartTime: starttime,
                    DayendTime: endtime,},
                    ()=>{
                    this.props.dispatch(createAction('pointdetails/updateState')({
                        DaystartTime: starttime,
                        DayendTime: endtime,
                    }))
                    this.props.dispatch(createAction('pointdetails/GetDayDatas')({}));
                });
                
            }
        }
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fefefe',
        flexDirection:'column'
    },
});

//make this component available to the app
export default MyCalendar;
