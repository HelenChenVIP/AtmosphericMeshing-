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
    hourDataList:[],
    dayDataList:[],
    zxData:[],
    pointName:'',
    latitude:'',
    longitude:'',
    dgimn:'',
    showIndex:'',
    codeClickID:'',
    startTime:'',
    endTime:'',
  },
  
  subscriptions: {
    setupSubscriber({ dispatch, listen }) {
      listen({
      
      });
    },
    
  },
  reducers: {
   
    //站点详情 小时数据 hourData:'hour',
    getchooseHourData(state,{payload:{hourData,choosePollutantCode}}){
      if(choosePollutantCode==''){
        choosePollutantCode='AQI';
      }
      if(hourData=='hour'){
        let hourVaule=PointDeatilsHourData(state.hourDataList,choosePollutantCode);
        state = {...state,...{zxData:hourVaule}};
      }else{
        let dayVaule=PointDeatilsHourData(state.dayDataList,choosePollutantCode);
        state = {...state,...{zxData:dayVaule}};
      }
      return state;
    },


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
      let globalConfig = yield loadStorage('globalconfig');
      if (globalConfig == null) {
        // const { data } = yield call(systemConfig.getsystemconfig);
        // yield saveStorage('globalconfig', data);
        // globalConfig = data;
      }
      if (user && user != null) {
        // const { data: alarmCount } = yield call(AlarmService.loadawaitcheck, { time: moment().format('YYYY-MM-DD') });
        // const { data: pollutanttype } = yield call(systemConfig.loadpollutanttype);
        // yield put('changebadge', { badge: alarmCount.length });
        // yield put('hideSpinning', { pollutanttype });
        // yield put(
        //   NavigationActions.reset({
        //     index: 0,
        //     actions: [NavigationActions.navigate({ routeName: 'MainNavigator', params: { unverifiedCount: alarmCount.length, pollutanttype } })],
        //   }),
        // );
        // yield put('hideSpinning', { });
        yield put(
          NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'MainNavigator', params: { } })],
          }),
        );
      }
      yield update({ globalConfig, user });
      yield call(delay, 500);
      //等到添加闪屏之后再使用
      if (SplashScreen) {
        SplashScreen.hide();
      }
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
      debugger;
      if (userName === '' || passWord === '') {
        ShowToast('用户名，密码不能为空');
      } else {
        yield put('showSpinning', {});
        const { data: user } = yield call(homeService.login, { userName, passWord });
        if (user !== null) {
          yield saveToken(user);
          yield put('loadglobalvariable', { user });
        } else {
          yield put('hideSpinning', { });
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
  
    /**
     *  提交全部信息
     * HelenChen
     * @param {any} { payload: { pointname, pointdgmin,PollutantTypeCode,pickerValue, longitude,latitude} } 
     * @param {any} { call, put } 
     */
    * commitAll({ payload: { pointname, pointdgmin,PollutantTypeCode,pickerValue, longitude,latitude} }, { call, put }) {
      if (pointname === '') {
        ShowToast('监测点名称不能为空');
      } else {
        yield put('showSpinning', {});        
        const { data: commitAllResult } = yield call(homeService.commitAll, { pointname, pointdgmin,PollutantTypeCode,pickerValue, longitude,latitude});
        if (commitAllResult !== null) {
          // yield saveToken(commitAllResult);
          yield put('loadglobalvariable', { commitAllResult });
          ShowToast('提交成功');
        } else {
          yield put('hideSpinning', { });
        }
      }
    },
  
  /**
   * 站点详情-小时数据
   * @param {*} param0 
   * @param {*} param1 
   */
  * GetHourDatas({payload},{update,put,call,select}){
    const {dgimn,codeClickID,startTime,endTime} = yield select(state => state.app);
    const {data:hourDataList}=yield call(homeService.GethourAQIDatasColumn,{dgimn,codeClickID,startTime,endTime});
    if(hourDataList!==null){
      yield update( {hourDataList} ); 
      yield put('getchooseHourData',{
        hourData:'hour',
        choosePollutantCode:codeClickID,
      })
    }else{
      ShowToast('数据为空');
    }
  },
 /**
   * 站点详情-日数据
   * @param {*} param0 
   * @param {*} param1 
   */
  * GetDayDatas({payload},{update,put,call,select}){
    const {dgimn,codeClickID,startTime,endTime} = yield select(state => state.app);
    const {data:dayDataList}=yield call(homeService.GetDayAQIDatasColumn,{dgimn,codeClickID,startTime,endTime});
    if(dayDataList!==null){
      yield update( {dayDataList} ); 
      yield put('getchooseHourData',{
        hourData:'day',
        choosePollutantCode:codeClickID,
      })
    }else{
      ShowToast('数据为空');
    }
  },

 
  }

});


