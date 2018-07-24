//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList,Dimensions,TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import RankChartBar from '../rank/RankChartBar';
import mainmap from '../../config/configjson/mainmap.json';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 

const SCREEN_WIDTH=Dimensions.get('window').width;

/**
 * 排名-列表
 * 
 * @class RankFlatList
 * @extends {Component}
 */
@connect(({map,pointdetails})=>({listRankData:map.listRankData,
    pressPollutantCode:map.pressPollutantCode,
    mapRankDatas:map.mapRankDatas
    }),null,null,{withRef:true})
class RankFlatList extends Component {
    render() {
        return (
           <FlatList                  
            data={this.props.listRankData}
            ListHeaderComponent={<View style={{height:240,width:SCREEN_WIDTH,backgroundColor:'#ffffff'}}><RankChartBar ref={ref=>this._rankChartBar = ref}/></View>}
            renderItem={this._renderItemList}
            keyExtractor={this._extraUniqueKey}
            refreshing={false}
            onRefresh={() => {
                this.props.dispatch(createAction('map/mapAllRedures')({
                    whitchPage:'Rank',
                    pressPollutantCodeMap: this.props.pressPollutantCode!=null ? this.props.pressPollutantCode : mainmap.data[2].pollutantType[0].pollutantCode,
                    pressPollutantCodeMap: ''
                  }));      
            }}/>
        );
    }
    _sortRankChart = () => {
        this.props.dispatch(createAction('map/doSortchartDataAll')()); 
        this._rankChartBar.wrappedInstance._sort();
    }
    _resetReversedOrder = () => {
        this._rankChartBar.wrappedInstance.resetReversedOrder();
    }
    //FlatList key
   _extraUniqueKey=(item,index)=> `index11${index}${item}`
   _renderItemList = (item) => {
     if(item.item.listtv!=undefined)
     {
         return (
            <TouchableOpacity
                onPress={()=>{
                    this.props.dispatch(createAction('pointdetails/updateState')({
                        mapRankDatas:{
                            ...this.props.mapRankDatas,
                            dgimn:item.item.point_DGMIN,
                        }
                         }));
                this.props.dispatch(NavigationActions.navigate({routeName: 'PointDetailsShow', params: { }}))         
            }}>
                <View style={{backgroundColor:'#ffffff',flexDirection: 'row',width:SCREEN_WIDTH,height: 40,justifyContent:'space-between'}}>
                    <Text style={{marginLeft:10,fontSize: 14,color:'#868686',width:SCREEN_WIDTH/2}}>{item.item.chartXValue}</Text> 
                    <Text style={{marginLeft:10,fontSize: 14,color:'#333333',width:40}}>{item.item.listtv}</Text> 
                    <Text style={{marginLeft:20,marginRight:10,fontSize: 14,color:item.item.chartColor,padding:3,width:60}}>{item.item.chartYValue_new}</Text> 
                </View>
            </TouchableOpacity>
         )
     }else{
         return (
             <View style={{backgroundColor:'#ffffff',flexDirection: 'row',width:SCREEN_WIDTH,height: 40,justifyContent:'space-between'}}>
                 <Text style={{marginLeft:10,fontSize: 14,color:'#868686',width:SCREEN_WIDTH/2}}>{item.chartXValue}</Text> 
                 <Text style={{marginLeft:10,fontSize: 14,color:'#333333',width:40}}>  </Text> 
                 <Text style={{marginLeft:20,marginRight:10,fontSize: 14,color:item.item.chartColor,padding:3,width:60}}>{item.chartYValue_new}</Text> 
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
