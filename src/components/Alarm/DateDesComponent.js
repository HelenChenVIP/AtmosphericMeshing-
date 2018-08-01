//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,Dimensions,Image,TouchableOpacity } from 'react-native';
import Calendar from 'react-native-calendar-select';
import moment from 'moment';
import {timeForm} from './../../utils/mathUtils'

import { connect } from 'react-redux';
const SCREEN_WIDTH=Dimensions.get('window').width;

/**
 * 报警-已反馈
 * HelenChen
 * @class AlarmNoFeedback
 * @extends {Component}
 */
@connect(({alarm})=>({
    timeDesData:alarm.timeDesData,
}))
class DateDesComponent extends PureComponent {

      confirmDate=({ startDate, endDate, startMoment, endMoment }) => {
          this.props.datachange(startMoment.format('YYYY-MM-DD HH:mm:ss'),
          endMoment.format('YYYY-MM-DD HH:mm:ss'),);
      } 
     
    render() {
         
        const color = {
            subColor: '#fff',
            mainColor: '#4c68ea'
          };
          if(this.props.timeDesData.length===0)
          {
              return (<View></View>);
          }
          
          let begin=timeForm(this.props.timeDesData[0],'day');
          let end=timeForm(this.props.timeDesData[1],'day');
        return (
            <View style={styles.container}>
                <Calendar
                i18n="zh"
                ref={(calendar) => { this.calendar = calendar; }}
                color={color}
                format="YYYYMMDD"
                startDate={this.props.timeDesData[0]}
                endDate={this.props.timeDesData[1]}
                minDate={moment().format('YYYY0101')}
                maxDate={moment().format('YYYYMMDD')}
                onConfirm={this.confirmDate}/>
                <TouchableOpacity onPress={() => {this.calendar && this.calendar.open();}}>
                    <View style={{flexDirection:'row',width:SCREEN_WIDTH,height:30,backgroundColor:'#f3f3f3',alignItems:'center'}}>
                        <Image source={require('../../images/icon_alarm_time.png')} style={{ marginLeft: 10, height: 15, width: 15 }} />
                        <Text style={{fontSize:14,color:'#5285ed', marginLeft: 5}}>{`自${begin} 至 ${end}`}</Text>
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
export default DateDesComponent;
