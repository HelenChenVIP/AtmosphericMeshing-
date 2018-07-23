//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,Image,FlatList,TouchableOpacity,Platform,Dimensions } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 
import {pollutantUnit} from '../../utils/alarm';
import NoDataComponent from '../../components/comment/NoDataComponent';
import LoadingComponent from '../../components/comment/LoadingComponent';

const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * Helenchen
 * 预警已经反馈记录
 * @class AlarmDoneFeedDes
 * @extends {Component}
 */
@connect(({alarm,loading})=>({NoAlarmDesData:alarm.NoAlarmDesData,
    PageIndex:alarm.PageIndex,
    alarmNoDesData:alarm.alarmNoDesData,
    loading:loading.effects['alarm/GetNoAlarmDes'],
}))
class AlarmDoneFeedDes extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        title: '反馈详情',
        tabBarLable: '反馈详情',
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
            mBeginTime:'',
            mEndTime:'',
            isRefreshing:false,
        };
      }
      componentWillMount(){
        this.setState({mBeginTime:this.props.alarmNoDesData.BeginTime,mEndTime:this.props.alarmNoDesData.EndTime});
        this.props.dispatch(createAction('alarm/updateState')({
            alarmNoDesData:{
                ...this.props.alarmNoDesData,
                        State:'2',
                        BeginTime:this.props.alarmNoDesData.BeginTime,
                        EndTime:this.props.alarmNoDesData.EndTime,
            }
        }
        ));
        this.props.dispatch(createAction('alarm/GetNoAlarmDes')({
            PageIndex:1,}));

    }    
     //FlatList key
     _extraUniqueKey=(item,index)=> `index44${index}${item}`
     //查看反馈
     lookFK=(item)=>{
        this.props.dispatch(NavigationActions.navigate({
            routeName: 'AlarmDoneFeedbackCheck',                        
            params: {
                ID:item.ID
            } }));

     }
     _renderItemList = (item) => {
             return(
                <View style={{backgroundColor:'#ffffff',flexDirection:'row',borderRadius:10,
                borderWidth:1,borderColor:'#d9dedf',marginLeft:10,marginRight:10,marginTop:10}}>
                    <Image source={require('../../images/icon_alarm_point.png')} style={{ width: 35, height: 35,marginLeft:10,marginTop:8}} />
                    <TouchableOpacity  style={{flexDirection:'column',marginLeft:5,marginTop:8,marginRight:10,flex:1}} onPress={() => {this.lookFK(item.item)}}>
                    <View >
                        <Text style={{fontSize:16,color:'#4c4c4c',marginLeft:5}}>{item.item.PointName}</Text>
                        <Text style={{fontSize:14,color:'#a2a2a2',marginTop:10}}>
                        {item.item.PollutantName+item.item.ExceptionTypeName+'，检测值'+item.item.AlarmValue+pollutantUnit(item.item.PollutantCode)+'，关联国控点：'+item.item.ControlName}</Text>
                        <View style={{flexDirection:'row',height:40,alignItems:'center'}}>
                            <Text style={{fontSize:12,color:'#959595',flex:1}}>{item.item.AlarmTime}</Text>
                            <Text style={{width:60,fontSize:13,color:'#ffffff',backgroundColor:'#568af5',borderRadius:10,textAlign:'center',textAlignVertical:'center',padding:2}}>查看反馈</Text>
                        </View>
                        <Text style={{fontSize:14,color:'#696c6c',marginBottom:10,}}>{'反馈人：'+item.item.VerifyName+' 反馈时间：'+item.item.VerifyTime}</Text>
                    </View>
                    </TouchableOpacity>
                </View>
             );
     }
    render() {
        return (
            <View style={styles.container}>
            {this.props.loading?
                <LoadingComponent Message={'正在加载数据'} /> :
                <FlatList           
                ListEmptyComponent={() => (this.props.NoAlarmDesData ? null : <View style={{ height: SCREEN_HEIGHT - 200 }}><NoDataComponent Message={'没有查询到数据'} /></View>)}
                data={this.props.NoAlarmDesData}
                renderItem={this._renderItemList}
                keyExtractor={this._extraUniqueKey}
                onEndReachedThreshold={0.1}
                initialNumToRender={12}
                refreshing={this.state.isRefreshing}
                onRefresh={() => {
                    this.setState({isRefreshing:false});
                    this.props.dispatch(createAction('alarm/updateState')({
                        alarmNoDesData:{
                            ...this.props.alarmNoDesData,
                            State:'2',
                            BeginTime:this.state.mBeginTime,
                            EndTime:this.state.mEndTime,
                        }
                        }));
                    this.props.dispatch(createAction('alarm/GetNoAlarmDes')({
                        PageIndex:1,}));
                }}
                onEndReached={(info) => {
                    let loadingpage=1;
                    if(this.props.PageIndex>=1){
                        loadingpage=this.props.PageIndex+1;
                    }else{
                        loadingpage=1;
                    }
                    this.props.dispatch(createAction('alarm/updateState')({
                        alarmNoDesData:{
                            ...this.props.alarmNoDesData,
                            State:'2',
                            BeginTime:this.state.mBeginTime,
                            EndTime:this.state.mEndTime,
                        }}));
                    this.props.dispatch(createAction('alarm/EndReached')({
                        PageIndex:loadingpage,}));

                    // this.props.dispatch(createAction('alarm/GetNoAlarmDes')({
                    //     PageIndex:loadingpage,}));
                }}/>
            }
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaf2f7',
        flexDirection:'column',
    },
});

//make this component available to the app
export default AlarmDoneFeedDes;
