//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,Dimensions,FlatList,} from 'react-native';
import { connect } from 'react-redux';
import PointDetailsChart from '../PointDetails/PointDetailsChart';
import PointDetailsBar from '../PointDetails/PointDetailsBar';
import NoDataComponent from '../comment/NoDataComponent';
import LoadingComponent from '../../components/comment/LoadingComponent'
import moment from 'moment';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 

const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
/**
 * 站点详情-列表
 * HelenChen
 * @class PointDetailsFlatList
 * @extends {Component}
 */
@connect(({pointdetails,loading})=>({
    zxData:pointdetails.zxData,
    showIndex:pointdetails.showIndex,
    PageIndex:pointdetails.PageIndex,
    allTotal:pointdetails.allTotal,
    loading:pointdetails.effectsloading['pointdetails/GetHourDatasFirst'] || pointdetails.effectsloading['pointdetails/GetDayDatasFirst'] ,
    moreloading:pointdetails.effectsloading['pointdetails/GetHourDatas'] || pointdetails.effectsloading['pointdetails/GetDayDatas'],
   }))
class PointDetailsFlatList extends PureComponent  {

    componentWillMount(){
        if (this.props.showIndex=='0') {
            this.props.dispatch(createAction('pointdetails/updateState')({
                PageIndex:1,
                showIndex: '0',
                HourStartTime:'',
                HourendTime: moment().format('YYYY-MM-DD HH:mm:ss')
            }))
            this.props.dispatch(createAction('pointdetails/GetHourDatasFirst')({
                }));
        } else {
            this.props.dispatch(createAction('pointdetails/updateState')({
                PageIndex:1,
                showIndex: '1',
                HourStartTime:'',
                HourendTime: moment().format('YYYY-MM-DD HH:mm:ss')
            }))
    
            this.props.dispatch(createAction('pointdetails/GetDayDatasFirst')({
                }));
        }
    }
    onRefresh=()=>{
        if (this.props.showIndex=='0') {
            this.props.dispatch(createAction('pointdetails/updateState')({
                PageIndex:1,
                showIndex: '0',
                HourStartTime:'',
                HourendTime: moment().format('YYYY-MM-DD HH:mm:ss')
            }))
            this.props.dispatch(createAction('pointdetails/GetHourDatasFirst')({
                }));
        } else {
            this.props.dispatch(createAction('pointdetails/updateState')({
                PageIndex:1,
                showIndex: '1',
                HourStartTime:'',
                HourendTime: moment().format('YYYY-MM-DD HH:mm:ss')
            }))
            this.props.dispatch(createAction('pointdetails/GetDayDatasFirst')({
                }));
        }
    }
    onEndReached=()=>{
        if(this.props.PageIndex<=(this.props.allTotal/10)){
            if (this.props.showIndex=='0') {
                this.props.dispatch(createAction('pointdetails/updateState')({
                    showIndex: '0',
                    PageIndex:this.props.PageIndex+1
                }))
                this.props.dispatch(createAction('pointdetails/GetHourDatas')({
                    }));
            } else {
                this.props.dispatch(createAction('pointdetails/updateState')({
                    showIndex: '1',
                    PageIndex:this.props.PageIndex+1
                }))
                this.props.dispatch(createAction('pointdetails/GetDayDatas')({
                    }));
            }
        }
    }

    render() {
        let showIndex=this.props.showIndex;
        return (
            this.props.loading?
            <LoadingComponent Message={'正在加载数据...'} /> 
            :<FlatList   
            ListEmptyComponent={() => (this.props.zxData.ZXvaule ? null : <View style={{ height: SCREEN_HEIGHT - 600 }}><NoDataComponent Message={'暂无数据'} /></View>)}
            data={this.props.zxData.ZXvaule}
            ListHeaderComponent={<View style={{height:SCREEN_HEIGHT/3,width:SCREEN_WIDTH,backgroundColor:'#ffffff',marginBottom: 5,}}>
            {
                showIndex=='0' ? <PointDetailsChart/> : <PointDetailsBar/>
            }</View>}
            renderItem={this._renderItemList}
            keyExtractor={this._extraUniqueKey}
            onEndReachedThreshold={0.1}
            initialNumToRender={30}
            // refreshing={this.props.moreloading ? this.props.moreloading : false}
            // onRefresh={() => {
            //     this.onRefresh();
            // }}
            onEndReached={(info) => {
                this.onEndReached();
            }}
            />
        );
    }
    //FlatList key
 _extraUniqueKey=(item,index)=> `index10${index}${item}`
 _renderItemList = (item) => {
   if(item.item.listtv!=undefined)
   {
       return (
        <View style={{backgroundColor:'#ffffff',flexDirection: 'row',width:SCREEN_WIDTH,height: 40,justifyContent:'space-between',marginTop:1,borderBottomWidth:1,borderBottomColor:'#efefef'}}>
        <Text style={{fontSize: 14,color:'#868686',padding:3,width:SCREEN_WIDTH/3,marginLeft:10,textAlign:'center',alignSelf:'center'}}>{this.props.showIndex=='0' ? item.item.XValue:(item.item.XValue).substring(0,5)}</Text> 
        {
         item.item.choosePollutantName=='PM25' ? <Text style={{fontSize: 14,color:'#333333',padding:3,width:SCREEN_WIDTH/4-20,textAlign:'center',alignSelf:'center'}}>PM<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:'#333333'}}>2.5</Text> </Text>
         : item.item.choosePollutantName=='PM10' ? <Text style={{fontSize: 14,color:'#333333',padding:3,width:SCREEN_WIDTH/4-20,textAlign:'center',alignSelf:'center'}}>PM<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:'#333333'}}>10</Text> </Text> 
         : item.item.choosePollutantName=='NO2' ? <Text style={{fontSize: 14,color:'#333333',padding:3,width:SCREEN_WIDTH/4-20,textAlign:'center',alignSelf:'center'}}>NO<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:'#333333'}}>2</Text> </Text>
         : item.item.choosePollutantName=='SO2' ? <Text style={{fontSize: 14,color:'#333333',padding:3,width:SCREEN_WIDTH/4-20,textAlign:'center',alignSelf:'center'}}>SO<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:'#333333'}}>2</Text> </Text>
         : item.item.choosePollutantName=='O3' ? <Text style={{fontSize: 14,color:'#333333',padding:3,width:SCREEN_WIDTH/4-20,textAlign:'center',alignSelf:'center'}}>O<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:'#333333'}}>3</Text> </Text>
         : <Text style={{fontSize: 14,color:'#333333',padding:3,width:SCREEN_WIDTH/4-20,textAlign:'center',alignSelf:'center'}}>{item.item.choosePollutantName}</Text>   
     }
         
        <View style={{height:25,width:SCREEN_WIDTH/6,backgroundColor:item.item.chartColor == '#16010b' ? '#ffffff' : item.item.chartColor,alignSelf:'center'}}>
        <Text style={{color:'#333333',padding:3,fontSize: 14,textAlignVertical:'center',textAlign:'center'}}>{item.item.YValue_new}</Text> 
        </View>
        <Text style={{fontSize: 14,color:'#333333',padding:3,width:SCREEN_WIDTH/4-20,textAlign:'center',alignSelf:'center'}}>{item.item.listtv}</Text> 
    </View>
       )
   }
   else{
       return (
           <View style={{backgroundColor:'#ffffff',flexDirection: 'row',width:SCREEN_WIDTH,height: 40,justifyContent:'space-between',marginTop:1,borderBottomWidth:1,borderBottomColor:'#efefef'}}>
               <Text style={{fontSize: 14,color:'#868686',padding:3,width:SCREEN_WIDTH/3,marginLeft:10,textAlign:'center',alignSelf:'center'}}>{this.props.showIndex=='0' ? item.item.XValue:(item.item.XValue).substring(0,5)}</Text> 
               <Text style={{fontSize: 14,color:'#333333',padding:3,width:SCREEN_WIDTH/4-20,textAlign:'center',alignSelf:'center'}}>{item.item.choosePollutantName}</Text> 
               <View style={{height:25,width:SCREEN_WIDTH/6,backgroundColor:item.item.chartColor == '#16010b' ? '#ffffff' : item.item.chartColor,alignSelf:'center'}}>
               <Text style={{color:'#333333',padding:3,fontSize: 14,textAlignVertical:'center',textAlign:'center'}}>{item.item.YValue_new}</Text> 
               </View>
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
