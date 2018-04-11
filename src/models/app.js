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
import {selectionSort,random5,selectionSortNew} from '../utils/mathUtils';

export default Model.extend({
  namespace: 'app',
  state: {
    selectpointlist:[],
    pointTypeList:[],
    allPointList:[],
    realTimeDataList:[],
    choosePollutantCode:'',
    fillIcon:'',
    mkindCode:[],
    mallPointList:[],
    chartData:[],
    listRankData:[],
    chartYValue:'',
    chartYValue_new:'',
    chartXValue:'',
    ishow:false,
    pressPollutantCode:''
   
  },
  
  subscriptions: {
    setupSubscriber({ dispatch, listen }) {
      listen({
        //获取所有站点信息
        MainMap: ({ params }) => {
          dispatch({ type: 'GetAllPointList',payload: {},});
        },

      });
    },
    
  },
  reducers: {
    getpressCodeData(state,{payload:{whitchPage,pressPollutantCodeMap,pressPollutantCodeRank}}){
      let fillIcon='';
      let equitmentStatus='';
      let imageList;
      let changeAllPointList=[];
      let mkindCode=[];
      let mtime='';
      let chartYValue='';
      let chartYValue_new='';
      let chartXValue='';
      let chartData=[];
      let listRankData=[];
      let XValueList=[];
      let chartColor='';
      let listtv='';
      let listtv_new='';
      let kk=-1;
      let sortchartData=[];
      let sortListRankData=[];
       
      if(whitchPage=='Map'){
        pressPollutantCode=pressPollutantCodeMap;
      }else{
        pressPollutantCode=pressPollutantCodeRank;
      }
      //全部实时数据
      state.realTimeDataList.map((mitem,key1)=>{
        let real_DGMIN=mitem.DGIMN;
        if(pressPollutantCode!=null&&pressPollutantCode!=''){
          //选择的监测因子是否被包含在实时数据集合里，包含则展示此监测点不包含的话直接忽略该点
         // if(mitem[pressPollutantCode]!=null && mitem[pressPollutantCode]!=''){
              //全部站点
              state.allPointList.map((item,key2)=>{
                mtime=mitem.MonitorTime;
                let point_DGMIN=item.dbo__T_Bas_CommonPoint__DGIMN;
                let pointName=item.dbo__T_Bas_CommonPoint__PointName;
                if(point_DGMIN!=null && point_DGMIN!='' && real_DGMIN!=null && real_DGMIN!=''){
                  if(point_DGMIN==real_DGMIN){
                    let equitmentCode=item.dbo__T_Bas_CommonPoint__PollutantType;//设备类型
                    mkindCode=kindCode(equitmentCode);//该设备类型下所有监测因子code
                    //绑定设备 与 监测因子
                    mkindCode[0].map((kinditem,key3)=>{
                      if(kinditem==pressPollutantCode){
                        kk++;
                        equitmentStatus=kinditem.dbo__T_Bas_CommonPoint__Status;//设备状态
                        imageList=mapEuitmentImage(equitmentCode); 
                        //null是在线 超标；0,3离线 异常
                        let mValue;
                        let pollutantindex;
                        //status 0离线；3异常；(-1)1,2在线超标
                        if(statusImage(equitmentStatus)!=-1){
                          //离线 异常
                          fillIcon=imageList[statusImage(equitmentStatus)];
                        }else{
                          //在线 超标
                          //若污染因子的code===AQI则取AQI的值，否则取XX_IQI的值
                          if(pressPollutantCode=='AQI'){                                                                               
                              mValue=mitem.AQI;
                          }else if(pressPollutantCode=='a99054'){
                            if(mitem.a99054!=undefined){
                              mValue=mitem.a99054;
                            }else{
                              mValue='';
                            }
                          }else{
                            let mCode=pressPollutantCode+'_IAQI';
                            mValue=mitem[mCode];
                          }
                          //数值 颜色渲染
                          if(mValue!=null && mValue!=''){
                            if(pressPollutantCode=='a99054'){
                              if(TVOCLevel(mValue)!=undefined){
                                pollutantindex=TVOCLevel(mValue);
                                fillIcon=imageList[pollutantindex];
                                chartColor=valueTVOCColor(mValue);
                                if(mValue==0){
                                  listtv='异常';
                                }else if(mValue>0){
                                  listtv='';
                                }else{
                                  listtv='无数据';
                                }
                                
                              }else{
                                fillIcon=imageList[2];
                                chartColor='#333333';
                                listtv='无数据';
                              }
                            }else{
                              if(IAQILevel(mValue)!=undefined){
                                pollutantindex=IAQILevel(mValue);
                                fillIcon=imageList[pollutantindex];
                                if(pressPollutantCode=='AQI'){
                                  chartColor=valueAQIColor(mValue);
                                  listtv=valueAQIText(mValue);
                                }else{
                                  chartColor=valueAQIColor(mValue);
                                  listtv=valueAQIText(mValue);
                                }
                              }else{
                                fillIcon=imageList[2];
                                chartColor='#333333';
                                listtv='无数据';
                              }
                            }
                          }else{
                            fillIcon=imageList[1];
                            chartColor='#333333';
                            listtv='无数据';
                          }
                        
                        } 
                        item.fillIcon=fillIcon;
                        changeAllPointList.push(item);
                        chartXValue=pointName;
                        
                        if(mitem[pressPollutantCode]!=undefined && mitem[pressPollutantCode]!=''){
                          chartYValue=parseFloat(mitem[pressPollutantCode]);
                          chartYValue_new=parseFloat(mitem[pressPollutantCode]);
                        }else{
                          chartYValue=0;
                          chartYValue_new='---';
                        } 
                          XValueList.push(kk);
                          chartData.push({chartXValue,chartYValue,chartColor,listtv});
                          listRankData.push({chartXValue,chartYValue_new,chartColor,listtv});
                      }
                    })
                   
                  }
                }
              }) 
         // }
        }
      })
      let sortchartDataAll=[];
      let sortListRankDataAll=[];
      let YZhou=[];
      sortchartData=selectionSort(chartData);
      sortListRankData=selectionSortNew(listRankData);
      let zz=-1;
      let keyAll='';
      sortchartData.forEach((key)=>{
          zz++;
          key.zz=zz;
          sortchartDataAll.push(key);
        });
        let hh=-1;
        sortListRankData.forEach((key)=>{
          hh++;
          key.zz=zz;
          sortListRankDataAll.push(key);
        });
      
        let maxYValue=0;
        let minYValue=0;
        
        let radom5=random5(sortchartDataAll);
        chartData.map((item,key)=>{
          if(item.chartYValue>maxYValue){
            maxYValue=item.chartYValue;
          }
          return maxYValue;
          if(item.chartYValue<minYValue){
            minYValue=item.chartYValue;
          }
          return minYValue;
        })
        YZhou.push(minYValue,maxYValue);
      
      if(changeAllPointList.length>0){
        state = {...state,...{mallPointList:changeAllPointList,mkindCode:mkindCode,mTime:mtime,chartData:sortchartDataAll,listRankData:sortListRankDataAll,YZhou:YZhou,pressPollutantCode:pressPollutantCode}};
      }else{
        state = {...state,...{mallPointList:state.allPointList,mkindCode:mkindCode,mTime:mtime,chartData:sortchartDataAll,listRankData:sortListRankDataAll,YZhou:YZhou,pressPollutantCode:pressPollutantCode}};
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
        yield put('hideSpinning', { });
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
      SplashScreen.hide();
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
     * 获取所有站点信息
     * Helenchen
     * @param {any} {payload:{pollutantType}} 
     * @param {any} {call,update} 
     */
    * GetAllPointList({payload}, {update, put, call}){
      const { data : allPointList }=yield call(homeService.GetAllPointList,{});
      if(allPointList !== null){
        yield put('GetGridRealTimeImgDataAndroid',{
          allPointList:allPointList,
        });
        yield update({allPointList});
      }else{
        ShowToast('数据为空');
      }
    },
  /**
   * 获取地图实时数据
   * HelenChen
   * @param {any} {payload} 
   * @param {any} {update,call} 
   */
  * GetGridRealTimeImgDataAndroid({payload:allPointList},{update,put,call}){
      const {data:realTimeDataList}=yield call(homeService.GetGridRealTimeImgData,{});
      if(realTimeDataList!==null){
        yield update( {realTimeDataList} ); 
        yield put('getpressCodeData',{
          whitchPage:'Map',
          pressPollutantCodeMap:mainmap.data[2].pollutantType[0].pollutantCode,
          pressPollutantCodeRank:mainmap.data[2].pollutantType[0].pollutantCode,
        })
      }else{
        ShowToast('数据为空');
      }
    }

    
  
  }


});
