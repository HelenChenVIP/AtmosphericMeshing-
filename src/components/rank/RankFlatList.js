//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList,Dimensions } from 'react-native';
import { connect } from 'react-redux';
import RankChartBar from '../rank/RankChartBar';
import { createAction} from '../../utils'; 

const SCREEN_WIDTH=Dimensions.get('window').width;

/**
 * 排名-列表
 * 
 * @class RankFlatList
 * @extends {Component}
 */
@connect(({app})=>({listRankData:app.listRankData,
    pressPollutantCode:app.pressPollutantCode,
    }),null,null,{withRef:true})
class RankFlatList extends Component {
    render() {
        return (
           <FlatList                  
            data={this.props.listRankData}
            ListHeaderComponent={<View style={{height:240,width:SCREEN_WIDTH,backgroundColor:'#ffffff'}}><RankChartBar ref={ref=>this._rankChartBar = ref}/></View>}
            renderItem={this._renderItemList}
            keyExtractor={this._extraUniqueKey}
            />
        );
    }
    _sortRankChart = () => {
        this.props.dispatch(createAction('app/doSortchartDataAll')()); 
        this._rankChartBar.wrappedInstance._sort();
    }
    //FlatList key
   _extraUniqueKey=(item,index)=> `index11${index}${item}`
   _renderItemList = (item) => {
     if(item.item.listtv!=undefined)
     {
         return (
             <View style={{backgroundColor:'#ffffff',flexDirection: 'row',width:SCREEN_WIDTH,height: 40,justifyContent:'space-between'}}>
                 <Text style={{fontSize: 14,color:'#868686',padding:3,width:SCREEN_WIDTH/3,marginLeft:10}}>{item.item.chartXValue}</Text> 
                 <Text style={{fontSize: 14,color:'#333333',padding:3,width:SCREEN_WIDTH/4-20}}>{item.item.listtv}</Text> 
                 <Text style={{fontSize: 14,color:item.item.chartColor,padding:3,width:SCREEN_WIDTH/6}}>{item.item.chartYValue_new}</Text> 
             </View>
         )
     }
     else{
         return (
             <View style={{backgroundColor:'#ffffff',flexDirection: 'row',width:SCREEN_WIDTH,height: 40,marginLeft:10,marginRight:20,justifyContent:'space-between'}}>
                 <Text style={{fontSize: 14,color:'#868686',padding:3,width:SCREEN_WIDTH/3,marginLeft:10}}>{item.chartXValue}</Text> 
                 <Text style={{fontSize: 14,color:'#333333',padding:3,width:SCREEN_WIDTH/4-20}}>  </Text> 
                 <Text style={{fontSize: 14,color:item.item.chartColor,padding:3,width:SCREEN_WIDTH/6}}>{item.chartYValue_new}</Text> 
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
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default RankFlatList;
