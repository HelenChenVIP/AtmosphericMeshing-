//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,Dimensions,Image,TouchableOpacity } from 'react-native';
import Calendar from 'react-native-calendar-select';
import moment from 'moment';

import { connect } from 'react-redux';
const SCREEN_WIDTH=Dimensions.get('window').width;

/**
 * 报警-已反馈
 * HelenChen
 * @class AlarmNoFeedback
 * @extends {Component}
 */
@connect(({alarm})=>({
    timeData:alarm.timeData,
}))
class DateComponent extends PureComponent {

      confirmDate=({ startDate, endDate, startMoment, endMoment }) => {
          this.props.datachange(startMoment.format('YYYY-MM-DD HH:mm:ss'),
          endMoment.format('YYYY-MM-DD HH:mm:ss'),);
      } 
     
    render() {
         
        const color = {
            subColor: '#fff',
            mainColor: '#4c68ea'
          };
        return (
            <View style={styles.container}>
                <Calendar
                i18n="zh"
                ref={(calendar) => { this.calendar = calendar; }}
                color={color}
                format="YYYYMMDD"
                startDate={this.props.timeData[0]}
                endDate={this.props.timeData[1]}
                minDate={moment().format('YYYY0101')}
                maxDate={moment().format('YYYYMMDD')}
                onConfirm={this.confirmDate}/>
                <TouchableOpacity onPress={() => {this.calendar && this.calendar.open();}}>
                    <View style={{flexDirection:'row',width:SCREEN_WIDTH,height:30,backgroundColor:'#f3f3f3',alignItems:'center'}}>
                        <Image source={require('../../images/icon_alarm_time.png')} style={{ marginLeft: 10, height: 15, width: 15 }} />
                        <Text style={{fontSize:14,color:'#5285ed', marginLeft: 5}}>{`自${this.props.timeData[0]} 至 ${this.props.timeData[1]}`}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor:'#e8f3f8',
        flexDirection:'column'
    },
});

//make this component available to the app
export default DateComponent;
