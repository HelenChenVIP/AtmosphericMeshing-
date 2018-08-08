import { Model } from '../dvapack';
import * as alarmService from '../services/alarmService';
import moment from 'moment';
import { createAction,ShowToast,NavigationActions} from '../utils'; 

export default Model.extend({
    namespace: 'alarm',
    state:{
      // mainAlarmData:[],
      NoFeedData:[],
      DoneFeedData:[],
      NoAlarmDesData:[],
      DoneAlarmDesData:[],
      GetCheckEarlyWarningInfo:[],
      timeData:[moment().add(-3, 'days').format('YYYY-MM-DD HH:mm:ss'),moment().format('YYYY-MM-DD HH:mm:ss')],
      timeDesData:[],
      DGIMN:'',
      PointName:'',
      PageSize:10,
      PageIndex:1,
      allTotal:0,

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
      *GetNoFeedData({payload:{starttime,endtime}},{updatehide,put,call,select}){
        const { data : NoFeedData} = yield call(alarmService.GetMainAlarmService,
          {starttime,
            endtime,
            polluntCode:'',
            warnReason:'',
            RegionCode:'',
            pointName:'',
            state:0});
        yield updatehide({NoFeedData,timeData:[starttime,endtime]});
      },
      *GetDoneFeedData({payload:{starttime,endtime}},{updatehide,put,call,select}){
        const { data : DoneFeedData} = yield call(alarmService.GetMainAlarmService,
          {starttime,
            endtime,
            polluntCode:'',
            warnReason:'',
            RegionCode:'',
            pointName:'',
            state:2});
        yield updatehide({DoneFeedData,timeData:[starttime,endtime]});
      },
          //避免重复加载
          *EndReached({payload:{PageIndex}}, {update, put, call, select}){
            const {NoAlarmDesData,allTotal} = yield select(state => state.alarm);
            if (allTotal === 0) {
              yield put('GetNoAlarmDes',{'PageIndex':1});
            } else if (NoAlarmDesData.length<allTotal) {
              yield put('GetNoAlarmDes',{PageIndex});
            }
          },
          //报警未反馈二级
          *FirstGetNoAlarmDes({payload:{DGIMN,PointName,BeginTime,EndTime}}, {updatehide, call, select}){
            const {timeData,timeDesData} = yield select(state => state.alarm);
            if(BeginTime==='')
            {
              BeginTime=timeData[0].substring(0,11)+'00:00:00';
              EndTime=timeData[1].substring(0,11)+'00:00:00';
            }
            let { data : NoAlarmDesData,total : allTotal}=yield call(alarmService.GetAllAlarmDataList,
                    {DGIMN:DGIMN,
                      PointName:PointName,
                      RegionCode:'',
                      PolluntCode:'',
                      BeginTime,
                      EndTime,
                      EarlyWaringType:'',
                      State:'0',
                      PageIndex:1,
                      PageSize:10,
                      IsPc:'false',});
              if(NoAlarmDesData){
                yield updatehide({NoAlarmDesData,PageIndex:1,timeDesData:[BeginTime,EndTime],allTotal});
              }else{
                ShowToast('暂无数据');
              }
          },
          //报警未反馈二级 加载更多
          * GetNoAlarmDes({payload:{PageIndex}}, {updatehide, put, call, select}){
            const {DGIMN,PointName,timeDesData}
             = yield select(state => state.alarm);
            let { data : NoAlarmDesData,total : allTotal}=yield call(alarmService.GetAllAlarmDataList,
                    {DGIMN:DGIMN,
                      PointName:PointName,
                      RegionCode:'',
                      PolluntCode:'',
                      BeginTime:timeDesData[0],
                      EndTime:timeDesData[1],
                      EarlyWaringType:'',
                      State:'0',
                      PageIndex:PageIndex,
                      PageSize:10,
                      IsPc:'false',});
            if(NoAlarmDesData){
              let { NoAlarmDesData:NoAlarmDesDataFirst } = yield select(state => state.alarm);
                  NoAlarmDesData=NoAlarmDesDataFirst.concat(NoAlarmDesData);
                  yield updatehide({NoAlarmDesData,PageIndex,allTotal});
            }else{
              ShowToast('没有更多数据');
            }
          },
          //报警已反馈二级
          *FirstGetDoneAlarmDes({payload:{DGIMN,PointName,BeginTime,EndTime}}, {updatehide, call, select}){
            const {timeData,timeDesData}
            = yield select(state => state.alarm);
            if(BeginTime==='')
            {
              BeginTime=timeData[0].substring(0,11)+'00:00:00';
              EndTime=timeData[1].substring(0,11)+'00:00:00';
            }
            let { data : DoneAlarmDesData,total : allTotal}=yield call(alarmService.GetAllAlarmDataList,
                    {DGIMN:DGIMN,
                      PointName:PointName,
                      RegionCode:'',
                      PolluntCode:'',
                      BeginTime,
                      EndTime,
                      EarlyWaringType:'',
                      State:'2',
                      PageIndex:1,
                      PageSize:10,
                      IsPc:'false',});
              if(DoneAlarmDesData){
                yield updatehide({DoneAlarmDesData,PageIndex:1,timeDesData:[BeginTime,EndTime],allTotal});
              }else{
                ShowToast('暂无数据');
              }
          },
          //报警已反馈二级 加载更多
          * GetDoneAlarmDes({payload:{PageIndex}}, {updatehide, put, call, select}){
            const {DGIMN,PointName,timeDesData}
             = yield select(state => state.alarm);
            let { data : DoneAlarmDesData,total : allTotal}=yield call(alarmService.GetAllAlarmDataList,
                    {DGIMN:DGIMN,
                      PointName:PointName,
                      RegionCode:'',
                      PolluntCode:'',
                      BeginTime:timeDesData[0],
                      EndTime:timeDesData[1],
                      EarlyWaringType:'',
                      State:'2',
                      PageIndex:PageIndex,
                      PageSize:10,
                      IsPc:'false',});
            if(DoneAlarmDesData){
              let { DoneAlarmDesData:DoneAlarmDesDataFirst } = yield select(state => state.alarm);
                  DoneAlarmDesData=DoneAlarmDesDataFirst.concat(DoneAlarmDesData);
                  yield updatehide({DoneAlarmDesData,PageIndex,allTotal});
            }else{
              ShowToast('没有更多数据');
            }
          },
          /**
           * 提交反馈
           * @param {any} { payload: { postjson, successCallback ,failCallback ,checkboxIndexmap } } 
           * @param {any} { callWithSpinning, update, put, call, select } 
           */
          * SummitAll({ payload: { postjson, successCallback ,failCallback ,checkboxIndexmap } }, { call, updatehide, put, select }) {
            const result = yield call(alarmService.AddEarlyWarningFeedback, postjson, { imagelist: [] });
            if (result&&result.requstresult==='1') {
              let {NoAlarmDesData,NoFeedData} = yield select(state => state.alarm);
              const index=NoFeedData.findIndex((item)=>{
                return item.dgimn==postjson.DGIMN;
              })
              let arr = [];
              checkboxIndexmap.forEach((item, key, mapObj)=>{
                  arr.push(item);
              });
              NoFeedData[index].count = NoFeedData[index].count - arr.length;
              let _NoFeedData = NoFeedData.slice(0)
              let _NoAlarmDesData = [];
              NoAlarmDesData.map((item,key)=>{
                if (arr.indexOf(key)==-1) {
                  _NoAlarmDesData.push(item);
                }
              });
              yield updatehide({'NoAlarmDesData':_NoAlarmDesData,'mainAlarmData':_NoFeedData});
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