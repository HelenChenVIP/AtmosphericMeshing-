import moment from 'moment';
import SplashScreen from 'react-native-splash-screen';
// import JPushModule from 'jpush-react-native';
import { NavigationActions, ShowToast, delay } from '../utils';
import * as authService from '../services/authService';
import * as homeService from '../services/homeService';
import * as systemConfig from '../services/systemService';
import { clearToken, saveToken, saveStorage, loadStorage } from '../dvapack/storage';
import { Model } from '../dvapack';
import {mapLengedBack,mapLengedFore,mapEuitmentImage,statusImage,IAQILevel,kindMRCode,kindCode,TVOCLevel,valueAQIColor,valueTVOCColor,valueAQIText,} from '../utils/mapconfig'
import mainmap from '../config/configjson/mainmap.json';

import {MapRankData,RankAscDescData,PointDeatilsHourData} from '../models/apputil';

export default Model.extend({
  namespace: 'app',
  state: {
    pointTypeList:[],
    choosePollutantCode:'',

    pointName:'',
    latitude:'',
    longitude:'',

  },
  
  subscriptions: {
    setupSubscriber({ dispatch, listen }) {
      listen({
      
      });
    },
    
  },
  reducers: {
   

  },


  effects: {
    /**
     * 获取全局变量
     * liz 2017.11.11
     * @param {any} { payload } 
     * @param {any} { call, put, update } 
     */
    * loadglobalvariable({ payload }, { call, put, update }) {
      const { user } = payload;
      // let globalConfig = yield loadStorage('globalconfig');
      if (user && user != null) {
        yield put(
          NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'MainNavigator', params: { } })],
          }),
        );
      }
      yield update({ user });
      // yield call(delay, 500);
      //等到添加闪屏之后再使用
      // if (SplashScreen) {
      //   SplashScreen.hide();
      // }
    },

    /**
     * 上传图片
     * Helenchen
     * @param {any} { payload: { image, callback } } 
     * @param {any} { call } 
     */
    * uploadimage({ payload: { image, callback } }, { call }) {
      if (!image.fileName) {
        image.fileName = image.uri.split('/')[image.uri.split('/').length - 1];
      }
      const { data } = yield call(homeService.uploadimage, { Img: image.data, FileType: `.${image.fileName.split('.')[1].toLowerCase()}` });
      image.uploadID = data;
      callback(image);
    },
     /**
     * 登录
     * HelenChen
     * @param {any} { payload: { username, password } } 
     * @param {any} { call, put } 
     */
    * login({ payload: { userName, passWord } }, { call, put }) {
      if (userName === '' || passWord === '') {
        ShowToast('用户名，密码不能为空');
      } else {
        const { data: user } = yield call(homeService.login, { userName, passWord });
        if (user !== null) {
          yield saveToken(user);
          yield put('loadglobalvariable', { user });
        } 
      }
    },
    /**
     * 获取监测点类型
     * Helenchen
     * @param {any} { payload } 
     * @param {any} { update, callWithLoading } 
     */
    * getPointTypeList({ payload }, { update, callWithLoading }) {
      const { data: pointTypeList } = yield callWithLoading(homeService.PointTypeList, {});
      yield update({ pointTypeList });
      payload.callback();
    },
  

 
  },

});


