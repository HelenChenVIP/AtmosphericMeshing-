//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,Dimensions,FlatList,} from 'react-native';
import { connect } from 'react-redux';
import PointDetailsChart from '../PointDetails/PointDetailsChart';
import PointDetailsBar from '../PointDetails/PointDetailsBar';
import NoDataComponent from '../comment/NoDataComponent';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 

const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
/**
 * 站点详情-列表
 * HelenChen
 * @class PointDetailsFlatList
 * @extends {Component}
 */
@connect(({app})=>({zxData:app.zxData}))
class PointDetailsFlatList extends Component {
    render() {
        let dgimn=this.props.pointDetailsShow.dgimn;
        let showIndex=this.props.pointDetailsShow.showIndex;
        let codeClickID=this.props.pointDetailsShow.codeClickID;
        let startTime=this.props.pointDetailsShow.startTime;
        let endTime=this.props.pointDetailsShow.endTime;
        return (
            <FlatList   
            style={{height:SCREEN_HEIGHT,width:SCREEN_WIDTH,backgroundColor:'#efefef',flex: 1,}}
            ListEmptyComponent={() => (this.props.zxData ? null : <View style={{ height: SCREEN_HEIGHT - 600 }}><NoDataComponent Message={'没有查询到数据'} /></View>)}
            data={this.props.zxData}
            ListHeaderComponent={<View style={{height:SCREEN_HEIGHT/3,width:SCREEN_WIDTH,backgroundColor:'#ffffff'}}>
            {
                showIndex=='0' ? <PointDetailsChart pointDetailsShow={{dgimn,codeClickID,startTime,endTime}}/> : <PointDetailsBar pointDetailsShow={{dgimn,codeClickID,startTime,endTime}}/>
            }</View>}
            renderItem={this._renderItemList}
            keyExtractor={this._extraUniqueKey}/>
        );
    }
    //FlatList key
 _extraUniqueKey=(item,index)=> `index10${index}${item}`
 _renderItemList = (item) => {
   if(item.item.listtv!=undefined)
   {
       return (
           <View style={{backgroundColor:'#ffffff',flexDirection: 'row',width:SCREEN_WIDTH,height: 40,justifyContent:'space-between',marginTop:1}}>
               <Text style={{fontSize: 14,color:'#868686',padding:3,width:SCREEN_WIDTH/3,marginLeft:10,textAlign:'center',alignSelf:'center'}}>{item.item.XValue}</Text> 
               <Text style={{fontSize: 14,color:'#333333',padding:3,width:SCREEN_WIDTH/4-20,textAlign:'center',alignSelf:'center'}}>{item.item.choosePollutantName}</Text> 
               <Text style={{height:25,fontSize: 14,color:'#333333',backgroundColor:item.item.chartColor == '#16010b' ? '#ffffff' : item.item.chartColor,padding:3,width:SCREEN_WIDTH/6,borderRadius:10,textAlign:'center',alignSelf:'center'}}>{item.item.YValue_new}</Text> 
               <Text style={{fontSize: 14,color:'#333333',padding:3,width:SCREEN_WIDTH/4-20,textAlign:'center',alignSelf:'center'}}>{item.item.listtv}</Text> 
           </View>
       )
   }
   else{
       return (
           <View style={{backgroundColor:'#ffffff',flexDirection: 'row',width:SCREEN_WIDTH,height: 40,justifyContent:'space-between',marginTop:1}}>
               <Text style={{fontSize: 14,color:'#868686',padding:3,width:SCREEN_WIDTH/3,marginLeft:10,textAlign:'center',alignSelf:'center'}}>{item.item.XValue}</Text> 
               <Text style={{fontSize: 14,color:'#333333',padding:3,width:SCREEN_WIDTH/4-20,textAlign:'center',alignSelf:'center'}}>{item.item.choosePollutantName}</Text> 
               <Text style={{height:25,fontSize: 14,color:'#333333',backgroundColor:item.item.chartColor == '#16010b' ? '#ffffff' : item.item.chartColor,padding:3,width:SCREEN_WIDTH/6,borderRadius:10,textAlign:'center',alignSelf:'center'}}>{item.item.YValue_new}</Text> 
               <Text style={{fontSize: 14,color:'#333333',padding:3,width:SCREEN_WIDTH/4-20,textAlign:'center',alignSelf:'center'}}>  </Text> 
           </View>
       )
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
    },
});

//make this component available to the app
export default PointDetailsFlatList;
