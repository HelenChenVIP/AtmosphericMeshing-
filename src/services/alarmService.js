import { post, upload, get ,posturl} from '../dvapack/request';
// 全局api文件
import api from '../config/globalapi';
import { loadToken } from '../dvapack/storage';
import moment from 'moment';

 //获取未核实1级 state:0 未核实 2核实
export const GetMainAlarmService = async(param) => {
  let start=param.starttime.substring(0,11)+'00:00:00';
    const body={
        starttime:start,
        endtime:param.endtime,
        polluntCode:param.polluntCode,
        warnReason:param.warnReason,
        RegionCode:param.RegionCode,
        pointName:param.pointName,
        state:param.state,
    };
    const result=await get(api.alarm.GetEarlyWarningGroupByDGIMN,body,null);
    if (!result.data) {
      return{'data':[]};
    }
    return result;
  }
  //获取未核实2级
  export const GetAllAlarmDataList = async(param) => {
    //let dic=param.DGIMN+param.PointName+param.RegionCode+param.PolluntCode+param.BeginTime+param.EndTime+param.EarlyWaringType+param.State+param.PageIndex+param.PageSize+param.IsPc;
    let nowTime = (new Date()).valueOf();
    let BeginTime;
    let EndTime;
    if(param.BeginTime==''){
      let Begin=moment().add(-3, 'days').format('YYYY-MM-DD HH:mm:ss');
      BeginTime=Begin.substring(0,11)+'00:00:00';
      EndTime=moment(nowTime).format('YYYY-MM-DD HH:mm:ss');
    }else{
      let Begin=param.BeginTime;
      BeginTime=Begin.substring(0,11)+'00:00:00';
      EndTime=param.EndTime;
    }
    let dic="{" +
    "\"DGIMN\":\"" + param.DGIMN + "\"," +
    "\"PointName\":\"" + param.PointName + "\"," +
    "\"RegionCode\":\"" + param.RegionCode + "\"," +
    "\"PolluntCode\":\"" + param.PolluntCode + "\"," +
    "\"BeginTime\":\"" + BeginTime + "\"," +
    "\"EndTime\":\"" + EndTime + "\"," +
    "\"EarlyWaringType\":\"" + param.EarlyWaringType + "\"," +
    "\"State\":\"" + param.State + "\"," +
    "\"PageIndex\":\"" + param.PageIndex + "\"," +
    "\"PageSize\":\"" + param.PageSize + "\"," +
    "\"IsPc\":\"" + "false" + "\"}"
    const body={
        dic:dic,
    };
    const result=await get(api.alarm.GetAllAlarmDataList,body,null);
    return result;
  }
  //反馈全部
  export const AddEarlyWarningFeedback = async (param) => {
    const user = await loadToken();
    const body = {
      DGIMN: param.DGIMN,
      ExceptionProcessingID: param.ExceptionProcessingID,
      WarningReason: param.WarningReason,
      sceneDescription: param.sceneDescription,
      ImageID: param.ImageID,
      personalFeedback: user.UserName,
      feedbackTime: param.feedbackTime,
      RecoveryTime: param.RecoveryTime,
      longitude: param.longitude,
      latitude: param.latitude,
      isRecord:1
    };
    const result = await post(api.alarm.AddEarlyWarningFeedback, body, null);
    return result;
  };
  //获取核实单
  export const GetCheckEarlyWarningInfo = async(param) => {
    const body={
      exceptionID:param.ID
    };
    const result=await get(api.alarm.GetCheckEarlyWarningInfo,body,null);
    return result;
  }
  export const uploadimage = async (param) => {
    const body = [{
      ID: '',
      FileType: param.FileType,
      Img: param.Img,
      IsUploadSuccess: true,
      IsPc: false,
      FileName: 'uploadimage'
    }];
    const result = await upload(api.alarm.uploadimage, body, null);
   
    return result;
  };