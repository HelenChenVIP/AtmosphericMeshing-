//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,Image,Dimensions,TouchableOpacity,StatusBar} from 'react-native';
import { connect } from 'react-redux';
import { createAction,ShowToast,NavigationActions} from '../../../utils'; 
import PollutantcodeBar from '../../../components/home/PollutantcodeBar';
import LengendStateBar from '../../../components/home/LengendStateBar';
import LengendEquitmentBar from '../../../components/home/LengendEquitmentBar';
import mainmap from '../../../config/configjson/mainmap.json';
import MapBase from '../../../components/home/MapBase';

const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * 主页-地图
 * Helenchen
 * @class MainMap
 * @extends {Component} 
 */
@connect(({})=>({}))
class MainMap extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '网格化',
        title: '地图',
        animationEnabled: false,
        headerBackTitle: null,
        headerTintColor: '#ffffff',
        headerTitleStyle: {alignSelf: 'center'},//标题居中
        headerStyle: { backgroundColor: '#5688f6',height:45 },
        labelStyle: {fontSize: 14},
        headerRight:(
        <TouchableOpacity style={{width:24,height:24,marginRight:10}}
        onPress={()=>{
           navigation.state.params.navigatePress();
        }}>
        <Image source={require('../../../images/ic_refresh.png')} style={{width:24,height:24,marginRight:10}}></Image>
        </TouchableOpacity>
        ),
        tabBarIcon: ({ focused, tintColor }) =>
        <Image source={focused ? require('../../../images/ic_map_hover.png') : require('../../../images/ic_map.png')} style={{height:20,width:20}}></Image>
        })
        componentWillMount(){
            this.props.dispatch(createAction('map/mapLoadAllPointList')({
                whitchPage:'Map',}))
        }

        componentDidMount(){
            this.props.navigation.setParams({navigatePress:this.refreshOn})
          }
          
        refreshOn=()=>{
            this.props.dispatch(createAction('map/mapLoadAllPointList')({
                whitchPage:'Map',}))

        }
        render() {
            return (
                <View style={styles.container}>
                <StatusBar barStyle="light-content"/>
                    <MapBase />
                    <PollutantcodeBar style={{width:SCREEN_WIDTH,backgroundColor:'#ffffff',position:'absolute',top:0}}/> 
                    <View style={styles.lengendStyle}>
                        <LengendStateBar style={{backgroundColor:'#ffffff',width:SCREEN_WIDTH}}/>
                        <Text style={{backgroundColor:'#efefef',width:SCREEN_WIDTH,height:1,marginTop:5}}/>
                        <LengendEquitmentBar style={{backgroundColor:'#ffffff',width:SCREEN_WIDTH}}/>
                    </View>
                    <Image source={require('../../../images/big_circle.png')} style={{width:50,height:50, position:'absolute',bottom:40,left:5}}/>
                </View>
            );
        }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        
    },
    lengendStyle:{
        flexDirection: 'column',
        position:'absolute',
        bottom:0,
        width:SCREEN_WIDTH,
        backgroundColor:'#ffffff',
        padding:5,
    },

});

//make this component available to the app
export default MainMap;
