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
    namespace:'map',
    state:{
        whitchPage:'Map',
        pressPollutantCodeMap: mainmap.data[2].pollutantType[0].pollutantCode,
        pressPollutantCodeRank:'',
        allPointList:[],
        realTimeDataList:[],
        
       
        
        markerRealDatas:[],
        mallPointList:[],
        mkindCode:[],
        mtime:'',
        pressPollutantCode:'',
        chartData:[],
        listRankData:[],
        activecode:'',
    },
    subscriptions:{
        setupSubscriber({dispatch,listen}){
            listen({
                 //监测地图、排名界面 获取所有站点信息
                MainMap: ({ params }) => {
                    dispatch({ type: 'GetAllPointList',payload: {whitchPage:'Map'},});
                },
                MainRank: ({ params }) => {
                    dispatch({ type: 'GetAllPointList',payload: {whitchPage:'Rank'},});
                },
              
            })
        }
    },
    reducers:{
        mapAllRedures(state,{payload:{whitchPage,pressPollutantCodeMap,pressPollutantCodeRank}}){
            if(whitchPage=='Map'){
                pressPollutantCode=pressPollutantCodeMap;
            }else{
                pressPollutantCode=pressPollutantCodeRank;
            }
             //地图、排名Data
             let kindData=MapRankData(state.realTimeDataList,state.allPointList,pressPollutantCode);
             //排名Data排序
             if(kindData.chartData!=null && kindData.chartData.length>0){
                 let ascDescData=RankAscDescData(kindData.chartData,kindData.listRankData);
                 if(whitchPage=='Map'){
                     if(kindData.changeAllPointList.length>0){
                         state = {...state,...{markerRealDatas:kindData.markerRealDatas,mallPointList:kindData.changeAllPointList,mkindCode:kindData.mkindCode,mTime:kindData.mtime,pressPollutantCode:pressPollutantCode}};
                     }else{
                         state = {...state,...{markerRealDatas:kindData.markerRealDatas,mallPointList:state.allPointList,mkindCode:kindData.mkindCode,mTime:kindData.mtime,pressPollutantCode:pressPollutantCode}};
                     }
                 }else{
                     if(kindData.changeAllPointList.length>0){
                         state = {...state,...{chartData:ascDescData.sortchartDataAll,listRankData:ascDescData.sortListRankDataAll,pressPollutantCode:pressPollutantCode}};
                     }else{
                         state = {...state,...{chartData:ascDescData.sortchartDataAll,listRankData:ascDescData.sortListRankDataAll,pressPollutantCode:pressPollutantCode}};
                     }
                 }
             }
             return state;

        },

        },
    effects:{
        /**
         * 获取所有站点信息
         * Helenchen
         * @param {any} {payload:{pollutantType}} 
         * @param {any} {call,update} 
         */
        * GetAllPointList({payload:{whitchPage}}, {update, put, call}){
            const { data : allPointList }=yield call(homeService.GetAllPointList,{});
            if(allPointList !== null){
                yield update({allPointList});
            yield put('GetGridRealTimeImgDataAndroid',{
                whitchPage:whitchPage,
            });
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
        * GetGridRealTimeImgDataAndroid({payload:{whitchPage}},{update,put,call}){
            const {data:realTimeDataList}=yield call(homeService.GetGridRealTimeImgData,{});
            if(realTimeDataList!==null){
              yield update( {realTimeDataList} ); 
              yield put('mapAllRedures',{
                whitchPage:whitchPage,
                pressPollutantCodeMap:mainmap.data[2].pollutantType[0].pollutantCode,
                pressPollutantCodeRank:mainmap.data[2].pollutantType[0].pollutantCode,
              })
            }else{
              ShowToast('数据为空');
            }
          },
          
          *doSortchartDataAll({payload},{update,put,call,select}){
            let { listRankData:a } = yield select(state => state.map);
            let listRankData = [];
            if(a){
              for (let i = a.length - 1;i>=0;i--) {
                listRankData.push(a[i]);
              }
              yield update({listRankData});
            }
          },
    
          *setActivecode({payload:{activecode}},{update,put,call,select}){
            yield update({activecode});
          },
          

          

    },

  

})