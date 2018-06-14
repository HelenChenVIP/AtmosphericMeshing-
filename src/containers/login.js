//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image,ScrollView, TextInput, TouchableOpacity,Platform,StatusBar, } from 'react-native';
import { connect } from 'react-redux';
import { createAction, } from '../utils';
import {Button,} from 'antd-mobile';

import {SCREEN_WIDTH,WINDOW_HEIGHT} from '../config/globalsize';
import globalcolor from '../config/globalcolor';
import { saveStorage, loadStorage } from '../dvapack/storage';
// create a component
/**
 * 登录
 * 
 * @class Login
 * @extends {Component}
 */
@connect(({loading }) => ({
    loginLoading:loading.effects['app/login'],
    loadglobalvariable:loading.effects['app/loadglobalvariable'],
}))
class Login extends Component {

    /**
     * 构造方法
    */
    constructor(props){
        super(props);
        this.state ={
            username:'',
            password:'',
            loadingState:false,
            isremenber:false,
            contentHeight:WINDOW_HEIGHT,
        }
    }
    /**
     * 调整界面高度
    */
    _scrollViewLayout = (event) => {
        if(Platform.OS==='ios'){
            this.setState({contentHeight:WINDOW_HEIGHT});
        } else{
            if (this.state.contentHeight == WINDOW_HEIGHT) {
                this.setState({contentHeight:event.nativeEvent.layout.height});
            }
        }
    }
  
    async componentWillMount() {
        const loginmsg = await loadStorage('loginmsg');
        if (loginmsg != null) {
          this.setState(loginmsg);
        }
      }
    /**
     * 登录方法
    */
    login = async ()=>{
        let username = this.userNameInput.props.value;
        let password = this.passWordInput.props.value;

        this.props.dispatch(createAction('app/login')({
            'userName': username,
            'passWord': password,
        }));
        
        /**
         * 选中‘记住密码’则存储密码
        */
        if (this.state.isremenber) {
            this.state.username = username;
            this.state.password = password;
            await saveStorage('loginmsg', this.state);
        } else {
            let loginInfo = {
                'username':this.state.username,
                'password':password,
                'isremenber':false,
            };
            await saveStorage('loginmsg', loginInfo);
        }
    }
    render() {
        return (
            <ScrollView style={styles.container} onLayout={this._scrollViewLayout.bind(this)}>
                <Image source={require('../images/bg_login.jpg')} style={[styles.launchImageStyle,{height:this.state.contentHeight,}]}/>
                <StatusBar
                    barStyle="light-content"
                />
                <View style={[styles.LoginForm,{height:this.state.contentHeight,}]}>
                    <Image source={require('../images/bg_logo.png')} style={[{height:40,width:104,marginTop:120,}]}/>
                    <Text style={[{color:globalcolor.whiteFontColor, marginTop:21,fontSize:20,marginBottom:40,}]}>大气环境网格化监管系统</Text>
                    <View style={[styles.TextInputStyle, { marginBottom: 10 }]}>
                        <Image source={require('../images/ueser_icon.png')} style={{ width: 20, height: 20, marginBottom: 8 }} />
                        <TextInput
                        ref={ref => this.userNameInput = ref}
                        keyboardType={'default'}
                        clearTextOnFocus={false}
                        blurOnSubmit={true}
                        placeholderTextColor="white"
                        placeholder="请输入用户名"
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        underlineColorAndroid={'transparent'}
                        clearButtonMode={'always'}
                        onChangeText={(text) => {
                            // 动态更新组件内State记录用户名
                            this.setState({
                            username: text,
                            });
                        }}
                        value={this.state.username}
                        style={{
                            width: SCREEN_WIDTH - 120,
                            marginLeft: 10,
                            paddingTop: 1,
                            paddingBottom: 1,
                            color: 'white',
                            height: 20,
                        }}
                        />
                    </View>
                    <View style={[styles.TextInputStyle, { marginBottom: 20 }]}>
                        <Image source={require('../images/password_icon.png')} style={{ width: 20, height: 20, marginBottom: 8 }} />
                        <TextInput
                        ref={ref => this.passWordInput = ref}
                        clearTextOnFocus={false}
                        blurOnSubmit={true}
                        keyboardType={'default'}
                        placeholderTextColor="white"
                        placeholder="请输入密码"
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        underlineColorAndroid={'transparent'}
                        clearButtonMode={'always'}
                        secureTextEntry
                        onChangeText={(text) => {
                            // 动态更新组件内State记录密码
                            this.setState({
                            password: text,
                            });
                        }}
                        value={this.state.password}
                        style={{ width: SCREEN_WIDTH - 120,
                            marginLeft: 10,
                            paddingTop: 1,
                            paddingBottom: 1,
                            marginBottom: 8,
                            height: 21,
                            color: 'white' }}
                        />
                    </View>
                    <View style={styles.checkStyle}>
                        <TouchableOpacity
                            style={styles.checkStyleDetail}
                            onPress={() => {
                                // 动态更新组件内State记录记住我
                                this.setState({
                                    isremenber: !this.state.isremenber,
                                });
                            }}
                        >
                            <Image
                            source={this.state.isremenber ?
                                require('../images/checkbox_on.png') :
                                require('../images/checkbox_off.png')
                            }
                            style={{ width: 12, height: 12 }}
                            />
                            <Text style={{ fontSize: 11, color: 'white', marginLeft: 3 }}>记住密码</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        this.props.loginLoading
                        || this.props.loadglobalvariable ?
                            <Button type="primary" inline style={{width: SCREEN_WIDTH - 100,}} loading>正在登录</Button>:
                            <Button type="primary" inline style={{width: SCREEN_WIDTH - 100,}} onClick={this.login}>登录</Button>
                    }
                    <View style={{flex:1,}}></View>
                    <Text style={{ fontSize: 8, color: 'white',marginBottom:4,}}>{'v 1.0.2'}</Text>
                    <Text style={{ fontSize: 8, color: 'white',marginBottom:4,}}>{'北京雪迪龙科技股份有限公司'}</Text>
                    <Text style={{ fontSize: 8, color: 'white',marginBottom:8,}}>{'Copyright@2017 SDL.All Rights Reserved'}</Text>
                </View>
            </ScrollView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    launchImageStyle:{
        width:SCREEN_WIDTH,
    },
    LoginForm: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.0)',
        width: SCREEN_WIDTH,
        ...StyleSheet.absoluteFillObject,
      },
      TextInputStyle: {
        flexDirection: 'row',
        width: SCREEN_WIDTH - 100,
        borderBottomWidth: 0.5,
        borderBottomColor: 'white',
      },
      checkStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: SCREEN_WIDTH - 100,
      },
      checkStyleDetail: {
        flexDirection: 'row',
        width: SCREEN_WIDTH - 100,
        paddingBottom:20,
      },
});

//make this component available to the app
export default Login;
