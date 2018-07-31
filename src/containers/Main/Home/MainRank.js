//import liraries
import React, { PureComponent } from 'react';
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
@connect(({map})=>({pressPollutantCode:map.pressPollutantCode}))
class MainRank extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '实时排名',
        title: '排名',
        headerRight:(<TouchableOpacity onPress={()=>{
            _me._rankFlatList.wrappedInstance._sortRankChart();
        }}>
                <Text style={[{color:'white',marginRight:8}]}>{'反序'}</Text>
            </TouchableOpacity>),
        animationEnabled: false,
        headerBackTitle: null,
        headerTintColor: '#ffffff',
        headerTitleStyle: {alignSelf: 'center'},//标题居中
        headerStyle: { backgroundColor: '#5688f6',height:45 },
        labelStyle: {fontSize: 14},
        tabBarIcon: ({ focused, tintColor }) =>
          <Image source={focused ? require('../../../images/ic_sort_hover.png') : require('../../../images/ic_sort.png')} style={{height:20,width:20}}></Image>,
      })

      
      constructor(props){
        super(props);
        _me = this;
      }
      componentWillMount(){
        this.props.dispatch(createAction('map/GetAllPointList')({
        whitchPage:'Rank',}))
    }
      componentDidMount(){
        this.props.navigation.setParams({navigatePress:this.rankUpDown})
      }
      rankUpDown=()=>{
        this.props.navigation.dispatch(createAction('map/mapAllRedures')({
          whitchPage:'Rank',
          pressPollutantCodeRank: this.props.pressPollutantCode!=null ? this.props.pressPollutantCode : mainmap.data[2].pollutantType[0].pollutantCode,
          pressPollutantCodeMap: ''
        }));  
    }
   
    render() {
          return (
            <View style={{flexDirection:'column',flex:1,backgroundColor:'#ffffff'}}>
                <PollutantcodeBarRank _resetReversedOrder= {()=>{_me._rankFlatList.wrappedInstance._resetReversedOrder()}} style={{width:SCREEN_WIDTH,backgroundColor:'#ffffff'}}/>
                <RankFlatList ref = {ref=>{_me._rankFlatList = ref}}/>
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
