//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import moment from 'moment';
import { connect } from 'react-redux';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 
import {timeJQ,timeMores} from '../../utils/mathUtils';
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
class AlarmCalendar extends PureComponent {
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
            allTimeList:[],
        };
    this.onDayPress = this.onDayPress.bind(this);
    }
    componentWillMount(){
        this.setState({
            allTimeList:timeMores(this.props.navigation.state.params.chooseTime)
        })
    }
    render() {
        let dataSelect = {};
        debugger;
        if(this.state.allTimeList!=null && this.state.allTimeList!='' && this.state.allTimeList.length>0){
            this.state.allTimeList.map((item,key)=>{
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
        this.setState({
            allTimeList:timeMores(chooseDays)
        });
        this._timeLongs(timeMores(chooseDays));
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
        debugger;
        if(starttime!='' && endtime!='' && starttime!=endtime){
               //state:0 未核实 2核实
        if(this.props.navigation.state.params.state=='2'){
            this.props.dispatch(createAction('alarm/GetDoneFeedData')({
                starttime,
                endtime,
            }));
        }else{
            this.props.dispatch(createAction('alarm/GetNoFeedData')({
                starttime,
                endtime,
            }));
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
export default AlarmCalendar;
