//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 
import { connect } from 'react-redux';
import data from '../../config/configjson/mainmap.json';

const SCREEN_WIDTH=Dimensions.get('window').width;
/**
 * 污染因子bar
 * helenChen
 * @class PollutantcodeBar
 * @extends {Component}
 */
@connect(({})=>({}))
class PollutantcodeBar extends Component {
    constructor(props) {
        super(props); 
        this.state = {        
            pollutantData:data.data[2].pollutantType,
            pressPollutantCode:data.data[2].pollutantType[0].pollutantCode,
        }
      }
      //污染因子 item
      _renderItemPollutant = (item) => {
        let color=item.item.pollutantCode===this.state.pressPollutantCode?'#4B83F5':'#42403E';
        return (
            <View style={{backgroundColor:'#ffffff',flexDirection: 'row',height: 40,marginLeft:4,marginRight:4,justifyContent:'space-between',alignItems:'center'}}>
                <TouchableOpacity
                 onPress={()=>{
                    this.setState({pressPollutantCode:item.item.pollutantCode}); 
                    this.props.dispatch(createAction('app/getpressCodeData')({
                        whitchPage:'Map',
                        pressPollutantCodeMap: item.item.pollutantCode,
                        pressPollutantCodeRank:''
                      }));             
                }}>{
                    item.item.pollutantName=='PM25' ? <Text style={{fontSize: 14,alignSelf:'center',padding:5,color:color}}>PM<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:color}}>2.5</Text> </Text>
                    : item.item.pollutantName=='PM10' ? <Text style={{fontSize: 14,alignSelf:'center',padding:5,color:color}}>PM<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:color}}>10</Text> </Text> 
                    : item.item.pollutantName=='NO2' ? <Text style={{fontSize: 14,alignSelf:'center',padding:5,color:color}}>NO<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:color}}>2</Text> </Text>
                    : item.item.pollutantName=='SO2' ? <Text style={{fontSize: 14,alignSelf:'center',padding:5,color:color}}>SO<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:color}}>2</Text> </Text>
                    : item.item.pollutantName=='O3' ? <Text style={{fontSize: 14,alignSelf:'center',padding:5,color:color}}>O<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:color}}>3</Text> </Text>
                    : <Text style={{fontSize: 14,alignSelf:'center',padding:5,color:color}}>{item.item.pollutantName}</Text>   
                }
                </TouchableOpacity>                  
            </View>
        )
    }
    //FlatList key
    _extraUniqueKey=(item,index)=> `index${index}${item}`
    render() {
        return (
            <View style={{width:SCREEN_WIDTH,backgroundColor:'#ffffff',position:'absolute',top:0}}> 
                <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator= {false}
                extraData={this.state.pressPollutantCode}
                data={this.state.pollutantData}
                renderItem={this._renderItemPollutant}
                keyExtractor={this._extraUniqueKey}/>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
});

//make this component available to the app
export default PollutantcodeBar;
