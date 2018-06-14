//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import {mapEuitment} from '../../utils/mapconfig'
/**
 * 图例-设备
 * HelenChen
 * @class LengendEquitmentBar
 * @extends {Component}
 */
class LengendEquitmentBar extends PureComponent {
    constructor(props) {
        super(props); 
        this.state = {        
            equitmentData:[],
        }
        this.getDataInfos();
      }
      async getDataInfos() {
        let data = await require('../../config/configjson/mainmap.json');
        let jsonData = data.data;
        let equitmentType=[];
        equitmentType=jsonData[1].equitmentType;
        this.setState({equitmentData:equitmentType});
    }
    //图例-设备类型 item
    _renderItemEquit = (item) => {
        const mapEquip=mapEuitment(item.item.equitmentCode); 
        if(mapEquip)
        {
            const a=mapEquip[0];
            return (
                <View style={{backgroundColor:'#ffffff',flexDirection: 'row',height: 26,marginLeft:2,marginRight:2,justifyContent:'space-between',alignItems:'center'}}>
                    <Image source={a} style={{width:20,height:20,alignSelf:'center'}}/>    
                     <Text style={{fontSize: 12,alignSelf:'center',color:'#333333',padding:3}}>{item.item.equitmentName}</Text>                           
                </View>
            )
        }
        else{
            return (
                <View style={{backgroundColor:'#ffffff',flexDirection: 'row',height: 26,marginLeft:2,marginRight:2,justifyContent:'space-between'}}>
                    <Text style={{fontSize: 12,alignSelf:'center',color:'#333333',padding:3}}>暂无数据</Text>
                </View>
            )
        }
    }
      //FlatList key
      _extraUniqueKey=(item,index)=> `index${index}${item}`
    render() {
        return (
            <View>
                <FlatList                  
                horizontal={true}
                data={this.state.equitmentData}
                renderItem={this._renderItemEquit}
                keyExtractor={this._extraUniqueKey}/>
            </View>
        );
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
export default LengendEquitmentBar;
