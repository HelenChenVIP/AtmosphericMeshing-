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
            })
        }
    },
    reducers:{
        },
    effects:{
        *mapLoadAllPointList({payload:{whitchPage}}, {update, put, call,take}){
            yield put('GetAllPointList',{
                whitchPage:whitchPage,
            });
            yield take('GetAllPointList/@@end');
        },
        /**
         * 获取所有站点信息
         * Helenchen
         * @param {any} {payload:{pollutantType}} 
         * @param {any} {call,update} 
         */
        * GetAllPointList({payload:{whitchPage}}, {update, put, call,take}){
            const { data : allPointList }=yield call(homeService.GetAllPointList,{});
            if(allPointList !== null){
                yield update({allPointList});
                yield put('GetGridRealTimeImgDataAndroid',{
                    whitchPage:whitchPage,
                });
                yield take('GetGridRealTimeImgDataAndroid/@@end');
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
        * GetGridRealTimeImgDataAndroid({payload:{whitchPage}},{update,put,call,select,take}){
            const {data:realTimeDataList}=yield call(homeService.GetGridRealTimeImgData,{});
            const {pressPollutantCode} = yield select(state => state.map);
            if(realTimeDataList!==null){
              yield update( {realTimeDataList} ); 
              yield put('mapAllRedures',{
                whitchPage:whitchPage,
                pressPollutantCodeMap:pressPollutantCode!==''?pressPollutantCode:mainmap.data[2].pollutantType[0].pollutantCode,
                pressPollutantCodeRank:mainmap.data[2].pollutantType[0].pollutantCode,
              });
              yield take('mapAllRedures/@@end');
            }else{
                ShowToast('数据为空');
            }
          },
          
        /**
         * 
         * 整合站点数据、实时数据
         * @param {any} {payload} 
         * @param {any} {update,put,call,select} 
         */
        *mapAllRedures({payload:{whitchPage,pressPollutantCodeMap,pressPollutantCodeRank}},{update,put,call,select}){
            if(whitchPage=='Map'){
                //地图、排名Data
                const {realTimeDataList,allPointList} = yield select(state => state.map);
                let kindData=MapRankData(realTimeDataList,allPointList,pressPollutantCodeMap);
                //排名Data排序
                if(kindData.chartData!=null && kindData.chartData.length>0){
                    let ascDescData=RankAscDescData(kindData.chartData,kindData.listRankData);
                    if(kindData.changeAllPointList.length>0){
                        yield update( {markerRealDatas:kindData.markerRealDatas,mallPointList:kindData.changeAllPointList,mkindCode:kindData.mkindCode,mTime:kindData.mtime,pressPollutantCode:pressPollutantCodeMap} )
                    }
                }
            }else{
                 //地图、排名Data
                const {realTimeDataList,allPointList} = yield select(state => state.map);
                let kindData=MapRankData(realTimeDataList,allPointList,pressPollutantCodeRank);
                //排名Data排序
                if(kindData.chartData!=null && kindData.chartData.length>0){
                    let ascDescData=RankAscDescData(kindData.chartData,kindData.listRankData);
                    if(kindData.changeAllPointList.length>0){
                        yield update({chartData:ascDescData.sortchartDataAll,listRankData:ascDescData.sortListRankDataAll,pressPollutantCode:pressPollutantCodeRank})
                    }
                }
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