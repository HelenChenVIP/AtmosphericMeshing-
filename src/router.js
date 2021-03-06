import React, { PureComponent } from 'react';
import { BackHandler, Platform, View, StatusBar, Text,Modal } from 'react-native';
import {
  addNavigationHelpers
} from 'react-navigation';
// import JPushModule from 'jpush-react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import SplashScreen from 'react-native-splash-screen';
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import { loadToken, getNetConfig, saveNetConfig, loadNetConfig } from './dvapack/storage';
import { createAction, NavigationActions, getCurrentScreen, Event, getCurrentParams } from './utils';
import NetConfig from './config/NetConfig.json';
import api from './config/globalapi';
// import ScanNetConfig from './components/Common/ScanNetConfig';
import AppNavigator from './containers/';
// import DataPreview from './containers/Main/TabView/Home/DataPreview'
import {SCREEN_WIDTH,SCREEN_HEIGHT} from './config/globalsize'
// import Alert from './components/DataPreview/Alert'
import CodePush from "react-native-code-push";
import {doUpdate} from './utils/CodePushUtil'

export const routerMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.router
);
export const screenTracking = ({getState}) => next => async (action) => {
  if (action.type !== NavigationActions.NAVIGATE && action.type !== NavigationActions.BACK&& action.type !== NavigationActions.RESET) {
    return next(action);
  }
  if(!action.routeName)
  {
    const navigateInfo = routerReducer(getState().router, action);
          const currentScreen = getCurrentScreen(navigateInfo);
          const params = getCurrentParams(navigateInfo);
          action.routeName=currentScreen;
          action.params=params;
  }

  // routeName, params, type 
  let rcAction;
  if (action.type === NavigationActions.RESET) {
    rcAction = {
      'type':action.type,
      'routeName':action.routeName.routeName,
      'params':action.params,
    };
  } else {
    rcAction = action;
  }
  Event.emit('RouterChange', rcAction); 
  // await delay(500);
  const result = next(action); 
  return result;
};

const addListener = createReduxBoundAddListener('root');

@connect(({ router }) => ({ router,modalVisible:router.modalVisible }))
class Router extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      configload: true
    };
  }
  async componentWillMount() {
    let netconfig =await loadNetConfig(); 
    if (!netconfig && !netconfig != null) {
      if (NetConfig.isAutoLoad) {
        const newconfig = [];
        NetConfig.Config.map((item, key) => {
          const netitem = {};
          // netitem.neturl = `http://${item.configIp}:${item.configPort}`+api.appurl;
          netitem.neturl = `http://${item.configIp}:${item.configPort}`;
          if (key === 0) {
            netitem.isuse = true;
          } else {
            netitem.isuse = false;
          }
          newconfig.push(netitem);
        });
        saveNetConfig(newconfig);
        
      } else {
        this.setState({ configload: false });
        SplashScreen.hide();
      }
    }
    BackHandler.addEventListener('hardwareBackPress', this.backHandle);
  }
  async componentDidMount() {
    CodePush.notifyAppReady();
    doUpdate((syncStatus)=>{},(progress)=>{});
    const user = await loadToken();
    this.props.dispatch(createAction('app/loadglobalvariable')({ user }));
     
  }
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.backHandle);
      // JPushModule.removeReceiveCustomMsgListener(receiveCustomMsgEvent);
      // JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);
      // JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);
      // JPushModule.removeGetRegistrationIdListener(getRegistrationIdEvent);
      // JPushModule.clearAllNotifications();
    } else {
      DeviceEventEmitter.removeAllListeners();
      NativeAppEventEmitter.removeAllListeners();
    }
  }

  backHandle = () => {
    const currentScreen = getCurrentScreen(this.props.router);
    //登录
    if (currentScreen === 'Login') {
      return true;
    }
   
    if (currentScreen !== 'Home') {
      this.props.dispatch(NavigationActions.back());
      return true;
    }
  
    return false;
  }
  render() { 
    if (!this.state.configload) {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle="light-content"
          />
          {/* <ScanNetConfig ScanSuccess={() => {
            this.setState({ configload: true });
          }}
          /> */}
          <Text>ScanNetConfig</Text>
        </View>
      );
    } 
    const { dispatch, router } = this.props;
    const navigation = addNavigationHelpers({ dispatch, state: router }); 
    return (
      <View style={{ flex: 1 }}>
        <AppNavigator navigation={navigation} />
      </View>
    );
  }
}

export function routerReducer(state, action = {}) {
  return AppNavigator.router.getStateForAction(action, state);
}

export default Router;
