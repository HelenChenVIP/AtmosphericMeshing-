//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import {mapLengedBack,mapLengedFore} from '../../utils/mapconfig'
import { connect } from 'react-redux';

const SCREEN_WIDTH=Dimensions.get('window').width;
/**
 * 状态 图标
 * HelenChen
 * @class LengendStateBar
 * @extends {Component}
 */
@connect(({map})=>({pressPollutantCode:map.pressPollutantCode}))
class LengendStateBar extends PureComponent {
    constructor(props) {
        super(props); 
        this.state = {        
            lenData:[],
            lengendTypeTVOCData:[],
            pressPollutantCode:'AQI',
        }
        this.getDataInfos();
      }
      async getDataInfos() {
        let data = await require('../../config/configjson/mainmap.json');
        let jsonData = data.data;
        let lengendType=[];
        let lengendTypeTVOC=[];
        lengendType=jsonData[0].lengendType;
        lengendTypeTVOC=jsonData[4].lengendTypeTVOC;
        this.setState({lenData:lengendType,lengendTypeTVOCData:lengendTypeTVOC});
    }
    _renderItemView = (mData) =>{
        mData.map((item,key)=>{
            <View style={{backgroundColor:mapLengedBack(item.lengendCode),flexDirection: 'row',height: 20,marginLeft:2,marginRight:2,justifyContent:'space-between',borderRadius:3,alignItems:'center'}}>
                <Text style={{fontSize: 11,alignSelf:'center',color:mapLengedFore(item.lengendCode),padding:3}}>
                    {item.lengendName}
                </Text>        
            </View>
        })
    }
    render() {
        let mData;
        if(this.props.pressPollutantCode!=null && this.props.pressPollutantCode!=''){
            this.props.pressPollutantCode=='a99054' ?  mData=this.state.lengendTypeTVOCData : mData=this.state.lenData;
        }else{
            mData=this.state.lenData;
        }
        return (
            <View style={{flexDirection:'row',justifyContent:'space-around',marginLeft:50}}>
            {
                mData.map((item,key)=>{
                    return(
                    <View key={key}
                    style={{backgroundColor:mapLengedBack(item.lengendCode),flexDirection: 'row',height: 20,marginLeft:2,marginRight:2,justifyContent:'space-between',borderRadius:3,alignItems:'center'}}>
                        <Text style={{fontSize: 11,alignSelf:'center',color:mapLengedFore(item.lengendCode),padding:3}}>
                            {item.lengendName}
                        </Text>        
                    </View>)
                })
            }
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
  
});

//make this component available to the app
export default LengendStateBar;
