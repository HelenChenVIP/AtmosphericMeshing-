//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,Image, Dimensions, TouchableOpacity } from 'react-native';
import PollutantcodeBarRank from '../../../components/rank/PollutantcodeBarRank';
import { connect } from 'react-redux';
import {BarChart} from 'react-native-charts-wrapper';
import { createAction,ShowToast,NavigationActions} from '../../../utils'; 
import RankFlatList from '../../../components/rank/RankFlatList';
const SCREEN_WIDTH=Dimensions.get('window').width;

/**
 * 主页-排名
 * Helenchen
 * @class MainRank
 * @extends {Component}
 */
@connect(({app})=>({pressPollutantCode:app.pressPollutantCode}))
class MainRank extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '实时排名',
        title: '排名',
        animationEnabled: false,
        headerBackTitle: null,
        headerTintColor: '#ffffff',
        headerTitleStyle: {alignSelf: 'center'},//标题居中
        headerStyle: { backgroundColor: '#5688f6',height:45 },
        labelStyle: {fontSize: 14},
        tabBarIcon: ({ focused, tintColor }) =>
          <Image source={focused ? require('../../../images/ic_sort_hover.png') : require('../../../images/ic_sort.png')} style={{height:20,width:20}}></Image>,
      })

      componentDidMount(){
        this.props.navigation.setParams({navigatePress:this.rankUpDown})
      }
      rankUpDown=()=>{
        this.props.navigation.dispatch(createAction('app/getpressCodeData')({
          whitchPage:'Rank',
          pressPollutantCodeRank: this.props.pressPollutantCode!=null ? this.props.pressPollutantCode : mainmap.data[2].pollutantType[0].pollutantCode,
          pressPollutantCodeMap: ''
        }));  
    }
   
    render() {
          return (
            <View style={{flexDirection:'column',flex:1,}}>
                <PollutantcodeBarRank style={{width:SCREEN_WIDTH,backgroundColor:'#ffffff'}}/> 
                <RankFlatList/>
            </View>
            
        ); 
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        flexDirection:'column'
    },
    chart: {
      flex: 1
    },
    chartStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default MainRank;
