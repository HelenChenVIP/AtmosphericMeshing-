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
    allTotal:0,
    dayDataList:[],
    zxData:[],
    dgimn:'',
    codeClickID:'',
    PageIndex:1,
    HourStartTime:'',
    HourendTime:'',
    showIndex: '0',
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
    *PointBaseMsg({payload},{updatehide,put,call,select}){
        const {mapRankDatas} = yield select(state => state.pointdetails);
        let dgimn=mapRankDatas.dgimn;
        const {data:pointData}=yield call(homeService.GetPointList,{dgimn});
        if(pointData!==null){
          yield updatehide( {pointData} ); 
        }
      },
  /**
     * 站点详情-小时数据-首次加载
     * @param {*} param0 
     * @param {*} param1 
     */
    * GetHourDatasFirst({payload},{updatehide,put,call,select}){
      const {dgimn,codeClickID,PageIndex,HourStartTime,HourendTime} = yield select(state => state.pointdetails);
      let {data:hourDataList, total : allTotal}=yield call(homeService.GethourAQIDatasColumn,{dgimn,codeClickID,PageIndex,HourStartTime,HourendTime, });
      yield updatehide( {hourDataList,allTotal,PageIndex:1} ); 
      yield put('HourDayDatas',{
          hourData:'hour',
          choosePollutantCode:codeClickID,
          mData:hourDataList,
      })
      },
    /**
     * 站点详情-小时数据-加载更多
     * @param {*} param0 
     * @param {*} param1 
     */
    * GetHourDatas({payload},{updatehide,put,call,select}){
        const {dgimn,codeClickID,PageIndex,HourStartTime,HourendTime} = yield select(state => state.pointdetails);
        let {data : hourDataList,total : allTotal}=yield call(homeService.GethourAQIDatasColumn,{dgimn,codeClickID,PageIndex,HourStartTime,HourendTime,});
        if(hourDataList!=null && hourDataList.length>0){
          let { hourDataList :hourDataListFirst} = yield select(state => state.pointdetails);
          hourDataList=hourDataListFirst.concat(hourDataList);
          yield updatehide({hourDataList,PageIndex,allTotal});
          yield put('HourDayDatas',{
              hourData:'hour',
              choosePollutantCode:codeClickID,
              mData:hourDataList,
          })
        }else{
          ShowToast('没有更多数据');
        }
    },
    /**
     * 站点详情-日数据-首次加载
     * @param {*} param0 
     * @param {*} param1 
     */
    * GetDayDatasFirst({payload},{updatehide,put,call,select}){
      const {dgimn,codeClickID,PageIndex,DaystartTime,DayendTime} = yield select(state => state.pointdetails);
      let {data : dayDataList,total : allTotal}=yield call(homeService.GetDayAQIDatasColumn,{dgimn,codeClickID,PageIndex,DaystartTime,DayendTime});
      yield updatehide( {dayDataList,allTotal,PageIndex:1} ); 
      yield put('HourDayDatas',{
          hourData:'day',
          choosePollutantCode:codeClickID,
          mData:dayDataList,
      })
   },

    /**
     * 站点详情-日数据-加载更多
     * @param {*} param0 
     * @param {*} param1 
     */
    * GetDayDatas({payload},{updatehide,put,call,select}){
        const {dgimn,codeClickID,PageIndex,DaystartTime,DayendTime} = yield select(state => state.pointdetails);
        let {data : dayDataList,total : allTotal}=yield call(homeService.GetDayAQIDatasColumn,{dgimn,codeClickID,PageIndex,DaystartTime,DayendTime});
        if(dayDataList!=null && dayDataList.length>0){
          let { dayDataList :dayDataListFirst} = yield select(state => state.pointdetails);
          dayDataList=dayDataListFirst.concat(dayDataList);
          yield updatehide({dayDataList,PageIndex,allTotal});
          yield put('HourDayDatas',{
            hourData:'day',
            choosePollutantCode:codeClickID,
            mData:dayDataList,
          })
        }else{
          ShowToast('没有更多数据');
        }
    },

    * HourDayDatas({payload:{hourData,choosePollutantCode,mData}},{updatehide}){
      if(choosePollutantCode==''){
        choosePollutantCode='AQI';
      }
      if(hourData=='hour'){
        let hourVaule=PointDeatilsHourData(mData,choosePollutantCode);
        yield updatehide( {zxData:hourVaule} ); 
      }else{
        let dayVaule=PointDeatilsHourData(mData,choosePollutantCode);
        yield updatehide( {zxData:dayVaule} ); 
      }
    },


 
  },

});


