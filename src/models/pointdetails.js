import moment from 'moment';
import SplashScreen from 'react-native-splash-screen';
// import JPushModule from 'jpush-react-native';
import { NavigationActions, ShowToast, delay } from '../utils';
import * as authService from '../services/authService';
import * as homeService from '../services/homeService';
import * as systemConfig from '../services/systemService';
import { Model } from '../dvapack';

import {PointDeatilsHourData} from '../models/apputil';

export default Model.extend({
  namespace: 'pointdetails',
  state: {
    choosePollutantCode:'',
    hourDataList:[],
    dayDataList:[],
    zxData:[],
    dgimn:'',
    showIndex: '0',
    codeClickID:'',
    HourStartTime:'',
    HourendTime:'',
    DaystartTime:'',
    DayendTime:'',
    mapRankDatas:{
        fillIcon:'',
        latitude:'',
        longitude:'',
        pointName_details:'',
        pollutantType:'',
        linkman:'',
        region:'',
        dgimn:'',
        equitmentType:'',
        
    },
  },
  
  subscriptions: {
    setupSubscriber({ dispatch, listen }) {
      listen({
        PointDetailsShow: ({ params }) => {
          dispatch({ type: 'PointBaseMsg',payload: {},});
        },
      
      });
    },
    
  },
  reducers: {
  },

  effects: {
      
        /**
         * 获取监测点基本信息
         * HelenChen
         * @param {any} {payload} 
         * @param {any} {update,call}
         */
        *PointBaseMsg({payload},{update,put,call,select}){
            const {mapRankDatas} = yield select(state => state.pointdetails);
            let dgimn=mapRankDatas.dgimn;
            const {data:pointData}=yield call(homeService.GetPointList,{dgimn});
            if(pointData!==null){
              yield update( {pointData} ); 
            }else{
              ShowToast('数据为空');
            }
          },

    /**
     * 站点详情-小时数据
     * @param {*} param0 
     * @param {*} param1 
     */
    * GetHourDatas({payload},{update,put,call,select}){
        const {dgimn,codeClickID,HourStartTime,HourendTime} = yield select(state => state.pointdetails);
        const {data:hourDataList}=yield call(homeService.GethourAQIDatasColumn,{dgimn,codeClickID,HourStartTime,HourendTime});
        if(hourDataList!=null&&hourDataList.length>0){
          yield update( {hourDataList} ); 
          yield put('HourDayDatas',{
              hourData:'hour',
              choosePollutantCode:codeClickID,
              mData:hourDataList,
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
        const {dgimn,codeClickID,DaystartTime,DayendTime} = yield select(state => state.pointdetails);
        const {data:dayDataList}=yield call(homeService.GetDayAQIDatasColumn,{dgimn,codeClickID,DaystartTime,DayendTime});
        if(dayDataList!=null&&dayDataList.length>0){
        yield update( {dayDataList} ); 
        yield put('HourDayDatas',{
            hourData:'day',
            choosePollutantCode:codeClickID,
            mData:dayDataList,
        })
        }else{
            ShowToast('数据为空');
        }
    },

    * HourDayDatas({payload:{hourData,choosePollutantCode,mData}},{update}){
      if(choosePollutantCode==''){
        choosePollutantCode='AQI';
      }
      if(hourData=='hour'){
        let hourVaule=PointDeatilsHourData(mData,choosePollutantCode);
        yield update( {zxData:hourVaule} ); 
      }else{
        let dayVaule=PointDeatilsHourData(mData,choosePollutantCode);
        yield update( {zxData:dayVaule} ); 
      }
    },


 
  },

});


