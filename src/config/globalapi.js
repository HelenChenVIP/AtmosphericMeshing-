

/**
 * 全局api
 * liz
 * 2016.12.19
 */
const api = {
    crawlerapi: 'http://172.16.12.35/WebApi/api/Values/',

    tool:{
    //监测点类型：
      PointTypeList:'/rest/CommonPointApi/PointTypeList/',
      login: '/rest/Author/IsLoginGrid', // 登陆
      PostCommonPoint:'/rest/CommonPointApi/PostCommonPoint',//提交全部
      GetAllPointList:'/rest/AutoForm/GetAllPointList',//获取全部站点
      GetGridRealTimeImgDataAndroid:'/rest/RealTime/GetGridRealTimeImgDataAndroid',//获取实时数据
      // GethourAQIDatasColumn:'/rest/APQI/GethourAQIDatasColumn',//站点-小时数据
      GetDayAQIDatasColumn:'/rest/APQI/GetDayAQIDatasColumn',//站点-日数据
      GetPointList:'/rest/AtmosphereApi/PointAndData/GetPointList',//新接口-获取监测点基本信息
      GetHourData:'/rest/AtmosphereApi/Hour/GetHourData',//新接口-站点详情-小时数据
    },
    alarm:{
      GetEarlyWarningGroupByDGIMN:'/rest/AlarmDealInfoApi/GetEarlyWarningGroupByDGIMN',//获取未反馈 反馈1级
      GetAllAlarmDataList:'/rest/AlarmDealInfoApi/GetAllAlarmDataList',//获取未核实2级
      AddEarlyWarningFeedback:'/rest/AlarmDealInfoApi/AddGridEarlyWarningFeedback',//反馈提交全部
      GetCheckEarlyWarningInfo:'/rest/AlarmDealInfoApi/GetCheckEarlyWarningInfo',//获取反馈单子
      uploadimage: '/rest/AlarmDealInfoApi/UploadImage/',//图片上传
    },
    // NOTE：用户相关api
    system: {
      
      resetpwd: '/rest/Author/ResetPwd', // 修改密码
      contactlist: '/rest/DirectoriesApi/getDirectories/',//通讯录
      nettest: '/rest/Author/SwitchNewWork/',
      systemconfig: '/rest/SysConfig/GetAppSettings/'
    },
    // NOTE: 全文检索相关api
    monitorpoint: {
      monitortype: '/rest/MenuInfo/GetPolluntType/',
      pointlist: '/rest/OutputAsPointApi/GetPointsByPollutantType/',
      singlepoint: '/rest/OutputAsPointApi/GetPointBaseInfo/', // 单个监测点查询
      CollectPoint: '/rest/OutputAsPointApi/CollectPointInfo/',
      collectpointlist: '/rest/OutputAsPointApi/GetCollectInfo/',
      uploadimage: '/rest/OutputAsPointApi/AddPointImg/',
      legend: '/rest/OutputAsPointApi/GetWaterLevels/',
      GetPointNewRealTimeDataByPollutantType:'/rest/OutputAsPointApi/GetPointNewRealTimeDataByPollutantType',    //数据一览 实时数据
      GetPointNewMinuteDataByPollutantType:'/rest/OutputAsPointApi/GetPointNewMinuteDataByPollutantType',    //数据一览 分钟数据
      GetPointNewHourDataByPollutantType:'/rest/OutputAsPointApi/GetPointNewHourDataByPollutantType',    //数据一览 小时数据
      GetPointNewDayDataByPollutantType:'/rest/OutputAsPointApi/GetPointNewRealTimeDataByPollutantType',    //数据一览 日数据
    },
    wholesearch: {
      fulltextsearch: '/rest/OutputAsPointApi/GetLxSearchResult/', // 全文检索
      searchhistory: '/rest/OutputAsPointApi/GetSearchContent/',
      savesearchtext: '/rest/OutputAsPointApi/AddSearchContent/',
    },
    monitortarget: {
      // targetbase:'/rest/OutputAsPointApi/GetEntBaseInfo/',
      targetother: '/rest/OutputAsPointApi/GetEntOtherInfo/',
      uploadimage: '/rest/OutputAsPointApi/AddEntImg/',
    },
    // NOTE: 监控相关api
    monitordata: {
      lastData: '/rest/OutputAsPointApi/GetPointNewRealTimeData/',
      realtimeData: '/rest/RealTime/GetRealTimeData/',
      minuteData: '/rest/Minute/GetMinuteData/',
      hourData: '/rest/Hour/GetHourSinglePollutantData/',
      dayData: '/rest/Day/GetDaySinglePollutantData/',
      pollutantCodes:'/rest/OutputAsPointApi/GetPollutantCodes',//获取污染源种类
    },
    // alarm: {
    //   awaitchecklist: '/rest/AlarmDealInfoApi/GetAllPointExceptionInfo/',
    //   verifiedlist: '/rest/AlarmDealInfoApi/GetVerifiedExceptionInfo/',
    //   alarmlist: '/rest/AlarmDealInfoApi/GetAllExceptionInfo/',
    //   postfeedback: '/rest/AlarmDealInfoApi/AddEarlyWarningFeedback/',
    //   uploadimage: '/AlarmDealInfoApi/UploadImage/',
    //   feedbackdetail: '/rest/AlarmDealInfoApi/GetEarlyWarningByVerify/',
    //   feddbackalarmdetail: '/rest/AlarmDealInfoApi/GetVerifyInfoByVerifyID/',
    // },
  };
  
  export default api;
  