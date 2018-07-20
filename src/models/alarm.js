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
      timeDesData:[],
      PageSize:12,
      alarmNoDesData:{
        DGIMN:'',
        PointName:'',
        BeginTime:'',
        EndTime:'',
        RegionCode:'',
        PolluntCode:'',
        EarlyWaringType:'',
        State:'0',
        IsPc:'false',
        PageIndex:1,
        checkboxStatemap: '',
        checkboxIndexmap: '',
        clearselect: '',
        allTotal:0,
      }

    },
    reducers:{
      
    },
    
    subscriptions: {
        setupSubscriber({ dispatch, listen }) {
          listen({
          });
        },
      },
    effects:{
      //报警一级界面数据
        * GetMainAlarm({payload:{starttime,endtime,polluntCode,warnReason,RegionCode,pointName,state}}, {update, put, call}){
          let nowTime = (new Date()).valueOf();
          if(starttime==''){
            starttime=moment().add(-3, 'days').format('YYYY-MM-DD');
            endtime=moment(nowTime).format('YYYY-MM-DD');
          }
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
          *EndReached({payload:{PageIndex}}, {update, put, call, select}){
            const {NoAlarmDesData,allTotal} = yield select(state => state.alarm);
            if (allTotal === 0) {
              yield put('GetNoAlarmDes',{'PageIndex':1});
            } else if (NoAlarmDesData.length<allTotal) {
              yield put('GetNoAlarmDes',{PageIndex});
            }
          },
          //报警二级界面数据
          * GetNoAlarmDes({payload:{PageIndex}}, {update, put, call, select}){
            const {alarmNoDesData:{DGIMN,PointName,RegionCode,PolluntCode,BeginTime,EndTime,EarlyWaringType,State,PageSize,IsPc}} = yield select(state => state.alarm);
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
            if(NoAlarmDesData){
              if(PageIndex>1){
                if(NoAlarmDesData.length>=allTotal){
                  ShowToast('没有更多数据...');
                }else{
                  let { NoAlarmDesData:NoAlarmDesDataFirst } = yield select(state => state.alarm);
                  NoAlarmDesData=NoAlarmDesDataFirst.concat(NoAlarmDesData);
                  let timeDesData=[];
                  timeDesData.push({BeginTime,EndTime});
                  yield update({NoAlarmDesData,PageIndex,timeDesData,allTotal});
                }
              }else{ 
                let timeDesData=[];
                timeDesData.push({BeginTime,EndTime});
                yield update({NoAlarmDesData,PageIndex,timeDesData,allTotal});
              }
            }else{
              ShowToast('暂无数据');
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