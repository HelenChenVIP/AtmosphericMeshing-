//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet ,StatusBar,Image,TextInput,TouchableOpacity,Dimensions} from 'react-native';
import { saveStorage, loadStorage } from '../dvapack/storage';
import { connect } from 'react-redux';
import { Button } from 'antd-mobile';
import { createAction } from '../utils';

const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
/**
 * 登录
 * Helenchen
 * @class login
 * @extends {Component}
 */
@connect(({ app }) => ({
  spinning: app.spinning,
 }))
class login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          username: '',
          password: '',
          isreminber: '',
          autologin: '',
        };
      }

      async componentWillMount() {
        const loginmsg = await loadStorage('loginmsg');
        if (loginmsg != null) {
          this.setState(loginmsg);
        }
      }
      /**
       * 登录
       */
      _userLogin = async () => {

        this.props.dispatch(createAction('app/login')({
          userName: this.state.username,
          passWord: this.state.password,
        }));
       await saveStorage('loginmsg', this.state);
      };

    render() {
        return (
            <View style={styles.LoginLayout}>
            <StatusBar
              barStyle="light-content"
            />
            <View style={{ flex: 1 }}>
              
                      
              <View style={styles.LoginForm}>
                <Image source={require('../images/bg_logo.png')} style={{ height: 80, width: 80, marginBottom: 20,marginTop:40 }} />
                <Text style={{ fontSize: 25, width: 270, color: 'white', marginBottom: 50, textAlign: 'center' }}></Text>
                <View style={[styles.TextInputStyle, { marginBottom: 10 }]}>
                  <Image source={require('../images/ueser_icon.png')} style={{ width: 20, height: 20, marginBottom: 8 }} />
                  <TextInput
                    keyboardType={'default'}
                    clearTextOnFocus
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
                      width: SCREEN_WIDTH - 120,
                      marginLeft: 10,
                      paddingTop: 1,
                      paddingBottom: 1,
                      color: 'white',
                      height: 20,
                    }}
                  />
                </View>
                <View style={[styles.TextInputStyle, { marginBottom: 20,marginTop:5 }]}>
                  <Image source={require('../images/password_icon.png')} style={{ width: 20, height: 20, marginBottom: 8 }} />
                  <TextInput
                    clearTextOnFocus
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
                        isreminber: !this.state.isreminber,
                      });
                    }}
                  >
                    <Image
                      source={this.state.isreminber ?
                        require('../images/checkbox_on.png') :
                        require('../images/checkbox_off.png')
                      }
                      style={{ width: 12, height: 12 }}
                    />
                    <Text style={{ fontSize: 11, color: 'white', marginLeft: 3 }}>记住密码</Text>
                  </TouchableOpacity>
                 
                </View>
                    
                <Button style={{ width: 280,backgroundColor:'white',height:40,marginTop:20}} className="btn" type="ghost" inline
                onClick={()=>this._userLogin()}>{this.props.spinning ? '正在登录':'登录'}</Button> 
                 
             
              </View>
            </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    checkStyleDetail: {
      flexDirection: 'row',
    },
    LoginForm: {
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.0)',
      paddingHorizontal: 0,
      width: SCREEN_WIDTH,
      height: 700,
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
      marginBottom: 20,
    },
    launchImageStyle: {
      flex: 1,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    },
    LoginLayout: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      backgroundColor:'#4782F5',
      ...StyleSheet.absoluteFillObject,
    },
  });

//make this component available to the app
export default login;
