import { post, upload, get ,posturl} from '../dvapack/request';
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
    let dgimn=param.dgimn;
    let start=param.startTime;
    let end=param.endTime;
    let pageIndex=1;
    let pageSize=10;
    let initLastDate=moment().add(-3, 'days').format('YYYY-MM-DD');
    if(start==end){
      start=initLastDate;
    }
    let dic="{\"MN\":\"" + dgimn + "\",\"BeginTime\":\"" + start + "\",\"EndTime\":\"" + end + "\",\"PageIndex\":\"" + pageIndex + "\",\"PageSize\":\"" + pageSize + "\"}";
    debugger;
    const body = {
      dic:dic,
    };
    const result = await get(api.tool.GethourAQIDatasColumn,body,null);
    return result === null ? { data: null } : result;
  }

/**
 * 站点详情-日数据
 * @param {*} param 
 */
export const GetDayAQIDatasColumn = async(param) => {
  let dgimn=param.dgimn;
  let start=param.startTime;
  let end=param.endTime;
  let pageIndex=1;
  let pageSize=10;
  let initLastDate=moment().add(-3, 'days').format('YYYY-MM-DD');
  if(start==end){
    start=initLastDate;
  }
  let dic="{\"MN\":\"" + param.dgimn + "\",\"BeginTime\":\"" + start + "\",\"EndTime\":\"" + end + "\",\"PageIndex\":\"" + pageIndex + "\",\"PageSize\":\"" + pageSize + "\"}";
  const body = {
    dic:dic,
  };
  const result = await get(api.tool.GetDayAQIDatasColumn,body,null);
  return result === null ? { data: null } : result;
}

