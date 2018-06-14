//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,  FlatList, } from 'react-native';
import {mapLengedBack,mapLengedFore} from '../../utils/mapconfig'
import { connect } from 'react-redux';
/**
 * 图例-数据状态
 * Helenchen
 * @class LengendStatBar
 * @extends {Component}
 */
@connect(({app})=>({mkindCode:app.mkindCode}))
class LengendStatBar extends PureComponent {
    constructor(props) {
        super(props); 
        this.state = {        
            lenData:[],
            pressPollutantCode:'AQI',
        }
        this.getDataInfos();
      }
      async getDataInfos() {
        let data = await require('../../config/configjson/mainmap.json');
        let jsonData = data.data;
        let lengendType=[];
        lengendType=jsonData[0].lengendType;
        this.setState({lenData:lengendType});
    }
    
   //图例-异常离线优良轻度中度重度严重爆表 item
    _renderItemLen = (item) => {
        return (
            <View style={{backgroundColor:mapLengedBack(item.item.lengendCode),flexDirection: 'row',height: 20,marginLeft:2,marginRight:2,justifyContent:'space-between',borderRadius:3,alignItems:'center'}}>
                <Text style={{fontSize: 11,alignSelf:'center',color:mapLengedFore(item.item.lengendCode),padding:3}}>
                    {item.item.lengendName}
                </Text>        
            </View>
        )
    }
    //FlatList key
     _extraUniqueKey=(item,index)=> `index${index}${item}`
    render() {
        return (
            <View>
                <FlatList  
                style={{marginLeft:50}}               
                horizontal={true}
                data={this.state.lenData}
                renderItem={this._renderItemLen}
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
export default LengendStatBar;
