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
        this._isMounted = true
        const loginmsg = await loadStorage('loginmsg');
        if(this._isMounted){
            if (loginmsg != null) {
                this.setState(loginmsg);
              }
        }

       
      }
    componentWillUnmount() {
         this._isMounted = false
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
                <View  style={[styles.launchImageStyle,{height:this.state.contentHeight,}]}/>
                <StatusBar
                    barStyle="light-content"
                />
                <View style={[styles.LoginForm,{height:this.state.contentHeight,}]}>
                <Text style={[{color:globalcolor.whiteFontColor, marginTop:35,fontSize:15,marginBottom:40,}]}>用户登录</Text>
                    <Image source={require('../images/login_person.png')} style={[{height:60,width:104,marginTop:20,}]}/>
                    
                    <View style={[styles.TextInputStyle, { marginTop: 30,marginBottom: 10 }]}>
                       
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
                        
                        onChangeText={(text) => {
                            // 动态更新组件内State记录用户名
                            this.setState({
                            username: text,
                            });
                        }}
                        value={this.state.username}
                        style={{
                            width: SCREEN_WIDTH - 70,
                            marginLeft: 10,
                            paddingTop: 1,
                            paddingBottom: 1,
                            color: 'white',
                            height: 20,
                            textAlign :'center',
                        }}
                        />
                    </View>
                    <View style={[styles.TextInputStyle, { marginBottom: 20,marginTop :15 }]}>
                       
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
                        
                        secureTextEntry
                        onChangeText={(text) => {
                            // 动态更新组件内State记录密码
                            this.setState({
                            password: text,
                            });
                        }}
                        value={this.state.password}
                        style={{ width: SCREEN_WIDTH - 70,
                            marginLeft: 10,
                            paddingTop: 1,
                            paddingBottom: 1,
                            marginBottom: 2,
                            textAlign :'center',
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
                            <Button type="ghost" inline style={{width: SCREEN_WIDTH - 50,height:50,backgroundColor:'white',borderRadius:25,marginTop : 30}} loading>正在登录</Button>:
                            <Button type="ghost" inline style={{width: SCREEN_WIDTH - 50,height:50,backgroundColor:'white',borderRadius:25,marginTop : 30}} onClick={this.login}>登录</Button>
                    }
                   
                    <Text style={{ fontSize: 8, color: 'white',marginTop:15,}}>{'v 1.0.5'}</Text>
                    <Text style={{ fontSize: 8, color: 'white',marginTop:2,}}>{'北京雪迪龙科技股份有限公司'}</Text>
                    <Text style={{ fontSize: 8, color: 'white',marginTop:2,}}>{'Copyright@2017 SDL.All Rights Reserved'}</Text>
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
        backgroundColor: 'rgba(93,128,241,1.0)',
    },
    LoginForm: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.0)',
        width: SCREEN_WIDTH,
        ...StyleSheet.absoluteFillObject,
      },
      TextInputStyle: {
        flexDirection: 'row',
        width: SCREEN_WIDTH - 50,
        borderBottomWidth: 0.5,
        borderBottomColor: 'white',
      },
      checkStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: SCREEN_WIDTH ,
        marginTop:20
      },
      checkStyleDetail: {
        flexDirection: 'row',
        width: SCREEN_WIDTH - 100,
        paddingBottom:50,
        marginLeft : 25
      },
});

//make this component available to the app
export default Login;
