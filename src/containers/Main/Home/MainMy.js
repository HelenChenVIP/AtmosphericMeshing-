//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,Image,Dimensions, TouchableOpacity ,WebView} from 'react-native';
import { connect } from 'react-redux';
import { clearToken,  } from '../../../dvapack/storage';
import { NavigationActions } from '../../../utils';
import { Toast, WhiteSpace, WingBlank, Button } from 'antd-mobile';
const SCREEN_WIDTH=Dimensions.get('window').width;

/**
 * 主页-我的
 * HelenChen
 * @class MainMy
 * @extends {Component}
 */
@connect()
class MainMy extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        title: '我的',
        tabBarLable: '我的',
        animationEnabled: false,
        headerBackTitle: null,
        headerTintColor: '#ffffff',
        headerTitleStyle: {alignSelf: 'center'},//标题居中
        headerStyle: { backgroundColor: '#5688f6',height:45 },
        labelStyle: {fontSize: 14},
        tabBarIcon: ({ focused, tintColor }) =>
          <Image source={focused ? require('../../../images/ic_me_hover.png') : require('../../../images/ic_me.png')} style={{height:20,width:20}}></Image>,
      })
  

      constructor () {
        super();
        this.state = {
                value: 0,
        }
       
        
      }
      showToast() {
        Toast.info('清理成功', 1);
      }
         //退出
    doLogout = () => {
            //清除记录
          clearToken();
          // JPushModule.deleteAlias((result) => {});
          this.props.dispatch(NavigationActions.navigate({ routeName: 'Login' }));
    }
    render() {
        return (
            <View style={{flexDirection:'column',backgroundColor:'#efefef'}}>
            <Image source={require('../../../images/bg_user.png')} style={{height:SCREEN_WIDTH/2-30}}></Image>
            <View style={{flexDirection:'column',alignItems:'center',height:SCREEN_WIDTH/2-30,backgroundColor:'#00000000',justifyContent:'center',...StyleSheet.absoluteFillObject}}>
                 <Image source={require('../../../images/userlogo.png')} style={{width:70,height:70}}></Image>
                 <Text style={{fontSize:17,color:'#ffffff',marginTop:10}}>管理员</Text>
            </View>
            <TouchableOpacity style={{flexDirection:'row',height:40,backgroundColor:'#ffffff',alignItems:'center',marginTop:20}} 
            onPress={()=>{
                this.props.dispatch(NavigationActions.navigate({ routeName: 'knowledgeBase' , params: { }}));
            }}>
                <Image source={require('../../../images/ic_knowledge.png')} style={styles.itemImageStyle}></Image>
                <Text style={styles.itemTextView}>知识库</Text>
            </TouchableOpacity> 
            <TouchableOpacity style={{flexDirection:'row',height:40,backgroundColor:'#ffffff',alignItems:'center',marginTop:1}} 
            onPress={()=>{
              
            }}>
                <Image source={require('../../../images/ic_updata.png')} style={styles.itemImageStyle}></Image>
                <Text style={styles.itemTextView}>版本更新</Text>
            </TouchableOpacity> 
            <TouchableOpacity style={{flexDirection:'row',height:40,backgroundColor:'#ffffff',alignItems:'center',marginTop:1}} 
            onPress={()=>{
               this.showToast();
                
            }}>
                <Image source={require('../../../images/ic_clean.png')} style={styles.itemImageStyle}></Image>
                <Text style={styles.itemTextView}>清理缓存</Text>
            </TouchableOpacity> 

            <TouchableOpacity style={{flexDirection:'row',height:40,backgroundColor:'#ffffff',alignItems:'center',marginTop:20}} 
            onPress={()=>{
                this.doLogout()
            }}>
                <Image source={require('../../../images/ic_logon.png')} style={styles.itemImageStyle}></Image>
                <Text style={styles.itemTextView}>退出登录</Text>
            </TouchableOpacity> 

            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#efda44'
    },
    itemViewStyle:{
        flexDirection:'row',
        height:40,
        backgroundColor:'#ffffff',
        alignItems:'center',
        marginTop:1
    },
    itemImageStyle:{
        width:15,
        height:15,
        marginLeft:10
    },
    itemRightStyle:{
        width:15,
        height:15,
        marginRight:10
    },
    itemTextView:{
        fontSize:13,
        color:"#222222",
        marginLeft:10,
        flex:1
    }
});

//make this component available to the app
export default MainMy;
