
import React, { Component } from 'react';
import { View, Text, StyleSheet,Dimensions,TouchableOpacity, Animated,Platform,Image } from 'react-native';
import PointDetailsMap from './../../components/PointDetails/PointDetailsMap';
import PointDetailsShow from '../../components/PointDetails/PointDetailsShow';
import { NavigationActions,createAction } from '../../utils';
import { connect } from 'react-redux';

const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * 站点详情
 * Helenchen
 * @class PointDetails
 * @extends {Component}
 */
@connect(({})=>({}))
class PointDetails extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: '站点详情',
        tabBarLable: '站点详情',
        animationEnabled: false,
        headerBackTitle: null,
        headerTintColor: '#ffffff',
        headerTitleStyle: {alignSelf: 'center'},//标题居中
        headerStyle: { backgroundColor: '#5688f6',height:45 },
        labelStyle: {fontSize: 14},
        tabBarIcon: ({ focused, tintColor }) =>
          <Image source={focused ? require('../../images/ic_me_hover.png') : require('../../images/ic_me.png')} style={{height:20,width:20}}></Image>,
      })

    constructor(props) {
        super(props);
        this.state = {
        };
      }
    render() {
        let fillIcon=this.props.navigation.state.params.fillIcon;
        let latitude=this.props.navigation.state.params.latitude;
        let longitude=this.props.navigation.state.params.longitude;

        let pointName=this.props.navigation.state.params.pointName;
        let pollutantType=this.props.navigation.state.params.pollutantType;
        let linkman=this.props.navigation.state.params.linkman;
        let region=this.props.navigation.state.params.region;
        let dgimn=this.props.navigation.state.params.dgimn;
        let equitmentType=this.props.navigation.state.params.equitmentType;
        return (
               <View style={styles.container}>
                    <PointDetailsShow pointDetails={{pointName,pollutantType,linkman,region,dgimn,equitmentType}}/>
               </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#efefef',
        flexDirection:'column'
    },
});


export default PointDetails;
