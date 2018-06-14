import { Model } from '../dvapack';
import * as alarmService from '../services/alarmService';
import moment from 'moment';
import { createAction,ShowToast,NavigationActions} from '../utils'; 

export default Model.extend({
    namespace: 'alarm',
    state:{
      mainAlarmData:[],
      NoAlarmDesData:[],
      GetCheckEarlyWarningInfo:[],
      timeData:[],
      PageSize:1,
    },
    reducers:{},
    
    subscriptions: {
        setupSubscriber({ dispatch, listen }) {
          listen({
            
          });
        },
      },
    effects:{
        * GetMainAlarm({payload:{starttime,endtime,polluntCode,warnReason,RegionCode,pointName,state}}, {update, put, call}){
          const { data : mainAlarmData} = yield call(alarmService.GetMainAlarmService,
                    {starttime:starttime,
                    endtime:endtime,
                    polluntCode:'',
                    warnReason:'',
                    RegionCode:'',
                    pointName:'',
                    state:state});
            if(mainAlarmData!=null){
              let timeData=[];
              timeData.push({starttime,endtime});
              yield update({mainAlarmData,timeData});
            }
          },
          
          * GetNoAlarmDes({payload:{DGIMN,PointName,RegionCode,PolluntCode,BeginTime,EndTime,EarlyWaringType,State,PageIndex,PageSize,IsPc}}, {update, put, call, select}){
            let { data : NoAlarmDesData,total : allTotal}=yield call(alarmService.GetAllAlarmDataList,
                    {DGIMN:DGIMN,
                      PointName:PointName,
                      RegionCode:RegionCode,
                      PolluntCode:PolluntCode,
                      BeginTime:BeginTime,
                      EndTime:EndTime,
                      EarlyWaringType:EarlyWaringType,
                      State:State,
                      PageIndex:PageIndex,
                      PageSize:PageSize,
                      IsPc:IsPc,});
            if(NoAlarmDesData !== null){
              if(PageIndex>1){
                if(NoAlarmDesData.length>=allTotal){
                  ShowToast('没有更多数据...');
                }else{
                  let { NoAlarmDesData:NoAlarmDesDataFirst } = yield select(state => state.alarm);
                  NoAlarmDesData=NoAlarmDesDataFirst.concat(NoAlarmDesData);
                  yield update({NoAlarmDesData,PageIndex});
                }
               
              }else{ 
                yield update({NoAlarmDesData,PageIndex});
              }
            }else{
              ShowToast('数据为空');
            }
          },

          * SummitAll({ payload: { postjson, successCallback ,failCallback ,checkboxIndexmap } }, { callWithSpinning, update, put, call, select }) {
           
            const result = yield callWithSpinning(alarmService.AddEarlyWarningFeedback, postjson, { imagelist: [] });
            if (result&&result.requstresult==='1') {
              let {NoAlarmDesData,mainAlarmData} = yield select(state => state.alarm);
              console.log(mainAlarmData);
              const index=mainAlarmData.findIndex((item)=>{
                return item.dgimn==postjson.DGIMN;
              })
              
              let arr = [];
              checkboxIndexmap.forEach((item, key, mapObj)=>{
                  arr.push(item);
              });
              mainAlarmData[index].count = mainAlarmData[index].count - arr.length;
              let _mainAlarmData = mainAlarmData.slice(0)
              let _NoAlarmDesData = [];
              NoAlarmDesData.map((item,key)=>{
                if (arr.indexOf(key)==-1) {
                  _NoAlarmDesData.push(item);
                }
              });
              yield update({'NoAlarmDesData':_NoAlarmDesData,'mainAlarmData':_mainAlarmData});
              successCallback();
            } else {
              failCallback();
            }
          },

          * GetCheckEarlyWarningInfo({payload:{ID}}, {update, put, call}){
            const { data : CheckEarlyWarningInfoData}=yield call(alarmService.GetCheckEarlyWarningInfo,
                    {ID:ID});
            if(CheckEarlyWarningInfoData !== null){
              yield update({CheckEarlyWarningInfoData});
            }else{
              ShowToast('数据为空');
            }
          },
        
          * uploadimage({ payload: { image, callback } }, { call }) {
            if (!image.fileName) {
              image.fileName = image.uri.split('/')[image.uri.split('/').length - 1];
            }
           
            const { data } = yield call(alarmService.uploadimage, { Img: image.data, FileType: `.${image.fileName.split('.')[1].toLowerCase()}` });
            image.uploadID = data;
            callback(image);
          },

    },
   


});