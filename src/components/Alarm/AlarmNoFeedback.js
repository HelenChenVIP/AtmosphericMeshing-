//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,Dimensions,Image,TouchableOpacity,FlatList } from 'react-native';
import NoDataComponent from '../comment/NoDataComponent';
import LoadingComponent from '../comment/LoadingComponent';
import { createAction,NavigationActions} from '../../utils'; 
import DateComponent from './DateComponent';
import { connect } from 'react-redux';

const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * 报警-未反馈
 * HelenChen
 * @class AlarmNoFeedback
 * @extends {Component}
 */
@connect(({alarm})=>({
    NoFeedData:alarm.NoFeedData,
    loading:alarm.effectsloading['alarm/GetNoFeedData'],
}))
class AlarmNoFeedback extends PureComponent {
      //FlatList key
    _extraUniqueKey=(item,index)=> `index22${index}${item}`
    _renderItemList = (item) => {
            return(
                <TouchableOpacity onPress={() => {
                    this.props.dispatch(NavigationActions.navigate({
                        routeName: 'AlarmNoFeedbackDes',                        
                        params: {
                            DGIMN:item.item.dgimn,
                            PointName:item.item.pointName,
                        } }));
                }}>
                    <View style={{backgroundColor:'#ffffff',borderColor:'#d7dcdd',borderWidth:1,borderRadius:5,flexDirection:'row',height:70,marginTop:5,marginBottom:5,marginLeft:10,marginRight:10}}>
                        <Image source={require('../../images/icon_alarm_point.png')} style={{width:40,height:40,marginLeft:10,alignSelf:'center'}}></Image>
                        <View style={{flexDirection:'column',alignItems:'center',marginLeft:10,alignSelf:'center',flex:1}}>
                            <Text style={{fontSize:14,color:'#333333',alignSelf:'flex-start'}}>{item.item.pointName}</Text>
                            <Text style={{fontSize:12,color:'#757575',marginTop:5,alignSelf:'flex-start'}}>{item.item.regionName}</Text>
                            
                        </View>
                        <View style={{flexDirection:'column',width:40,marginRight:10,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:12,color:'#969696'}}>{'未反馈'}</Text>
                            <View style={{backgroundColor:'red',width:30,height:20,borderColor:'red',borderRadius:10,marginTop:5,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:12,color:'white',textAlign:'center',textAlignVertical:'center'}}>{item.item.count}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        
    }
    render() {
        const color = {
            subColor: '#fff',
            mainColor: '#4c68ea'
          };
        return (
            <View style={styles.container}>
                <DateComponent datachange={(starttime,endtime)=>{
                      this.props.dispatch(createAction('alarm/GetNoFeedData')({
                        starttime,
                        endtime,
                        }));
                }} />
                {
                    this.props.loading ? 
                    <LoadingComponent Message={'正在加载数据'} /> :
                    <FlatList           
                    ListEmptyComponent={() => (this.props.NoFeedData.length>0 ? null : <View style={{ height: SCREEN_HEIGHT - 200 }}><NoDataComponent Message={'暂无数据'} /></View>)}
                    data={this.props.NoFeedData}
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
export default AlarmNoFeedback;
