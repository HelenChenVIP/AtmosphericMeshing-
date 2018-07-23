import { post,upload, get ,posturl} from '../dvapack/request';
import {timeZC,timeCalculate} from '../utils/mathUtils';
// 全局api文件
import api from '../config/globalapi';
import moment from 'moment';
/**
 * 上传图片
 * @param {*} param 
 */
export const uploadimage = async (param) => {
    const body = [{
      ID: '',
      Img: param.Img,
      IsUploadSuccess: true,
      IsPc: false,
      FileName: 'uploadimage'
    }];

    const result = await upload(api.alarm.uploadimage, body, null);
    return result;
  };

  /**
   * 获取监测点类型
   * @param {*} param 
   */
  export const PointTypeList = async (param) => {
    const body = {
    };
    const result = await get(api.tool.PointTypeList, body, null);
    return result;
  };
  /**
   * 登录
   * @param {*} param 
   */
  export const login = async (param) => {
    const body = {
      userName: param.userName,
      passWord: param.passWord,
    };
    const result = await posturl(api.tool.login, body, null);
    return result === null ? { data: null } : result;
  };

   /**
   * 提交全部信息
   * pointname, pointdgmin,PollutantTypeCode,pickerValue, longitude,latitude
   * @param {*} param 
   */
  export const commitAll = async (param) => {
    const body = {
      stationCode:'',
      pointName: param.pointname,
      DGIMN: param.pointdgmin,
      pollutantType: param.PollutantTypeCode,
      pickerValue: param.pickerValue,
      longitude: param.longitude,
      latitude: param.latitude,
      regionCode:'北京市昌平区',
      photo:''
    };
    const result = await posturl(api.tool.PostCommonPoint, body, null);    
    return result === null ? { data: null } : result;
  };

  /**
   * 获取所有站点
   * @param {*} param 
   */
  export const GetAllPointList = async(param) => {
    const body={
      pollutantType:' '
    };
    const result=await get(api.tool.GetAllPointList,body,null);
    return result;
  }
  /**
   * 实时数据
   * @param {*} param 
   */
  export const GetGridRealTimeImgData = async(param) => {
    const body = {};
    const result = await post(api.tool.GetGridRealTimeImgDataAndroid,body,null);
    return result === null ? { data: null } : result;
  }
/**
 * 站点详情-小时数据
 * @param {*} param 
 */
  export const GethourAQIDatasColumn = async(param) => {
    let start='';
    let pageIndex=1;
    let pageSize=80;
    if(param.HourStartTime=='' || param.HourendTime==''){
      start=timeCalculate(param.HourendTime);
    }else{
      start=param.HourStartTime;
    }
    const body = {
      IsSupplyData:true,
      DGIMNs: param.dgimn,
      beginTime:start,
      endTime:param.HourendTime,
      pageIndex:pageIndex,
      pageSize:pageSize,
      isAsc:true
    };
    const result = await post(api.tool.GetHourData,body,null);
    return result === null ? { data: null } : result;
  }

/**
 * 站点详情-日数据
 * @param {*} param 
 */
export const GetDayAQIDatasColumn = async(param) => {
  let pageIndex=1;
  let pageSize=80;
  let lastTime=timeZC(param.DayendTime,param.DaystartTime);
  const body = {
    IsSupplyData:true,
    DGIMNs: param.dgimn,
    beginTime:lastTime,
    endTime:param.DayendTime,
    pageIndex:pageIndex,
    pageSize:pageSize,
    isAsc:true
  };
  const result = await post(api.tool.GetDayData,body,null);
  return result === null ? { data: null } : result;
}

   /**
   * 获取监测点基本信息
   * @param {*} param 
   */
  export const GetPointList = async(param) => {
    const body = {
      DGIMNs: param.dgimn,
    };
    const result = await post(api.tool.GetPointList,body,null);
    return result === null ? { data: null } : result;
  }

