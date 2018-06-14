//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,Image,Dimensions,TouchableOpacity} from 'react-native';
import CustomTabBar from '../../../components/comment/CustomTabBar';
import AlarmNoFeedback from '../../../components/Alarm/AlarmNoFeedback';
import AlarmDoneFeed from '../../../components/Alarm/AlarmDoneFeed';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { createAction,ShowToast,NavigationActions} from '../../../utils'; 
import moment from 'moment';
const SCREEN_WIDTH=Dimensions.get('window').width;
/**
 * 主页-预警
 * HelenChen
 * @class MainAlarm
 * @extends {Component}
 */

@connect()
class MainAlarm extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '预警监管',
        title: '预警',
        animationEnabled: false,
        headerBackTitle: null,
        headerTintColor: '#ffffff',
        headerTitleStyle: {alignSelf: 'center'},//标题居中
        headerStyle: { backgroundColor: '#5688f6',height:44 },
        labelStyle: {fontSize: 14},
        tabBarIcon: ({ focused, tintColor }) =>
          <Image source={focused ? require('../../../images/ic_alarm_hover.png') : require('../../../images/ic_alarm.png')} style={{height:20,width:20}}></Image>,
      })
      handleChangeTab=({ i }) => {
          let mState=0;
          if(i==0){
            mState=0;
          }else{
            mState=2;
          }
        let nowTime = (new Date()).valueOf();
        let initCurrenDate=moment(nowTime).format('YYYY-MM-DD');
        let initLastDate=moment().add(-3, 'days').format('YYYY-MM-DD');
        this.props.dispatch(createAction('alarm/updateState')({
            starttime:initLastDate,
            endtime:initCurrenDate,
            polluntCode:'',
            warnReason:'',
            RegionCode:'',
            pointName:'',
            state:mState
            }));
        // this.props.dispatch(createAction('alarm/GetMainAlarm')({
        //     starttime:initLastDate,
        //     endtime:initCurrenDate,
        //     polluntCode:'',
        //     warnReason:'',
        //     RegionCode:'',
        //     pointName:'',
        //     state:mState
        //     }));
      }
      
    render() {
        return (
            <ScrollableTabView
            // 指定单个选项卡的渲染组件
            renderTabBar={() => <CustomTabBar tabNames={['未反馈', '已反馈']} />}
            initialPage={0}
            onChangeTab={this.handleChangeTab}
            prerenderingSiblingsNumber={0}>
                <AlarmNoFeedback tabLabel="未反馈" />
                <AlarmDoneFeed tabLabel="已反馈" />
            </ScrollableTabView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
      },
});

//make this component available to the app
export default MainAlarm;
