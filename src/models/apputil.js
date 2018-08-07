import {mapLengedBack,mapLengedFore,mapEuitmentImage,statusImage,IAQILevel,kindMRCode,kindCode,TVOCLevel,valueAQIColor,valueTVOCColor,valueAQIText,CodeForName} from '../utils/mapconfig';
import {selectionSort,random5,selectionSortNew} from '../utils/mathUtils';
import { processColor } from 'react-native';
/**
 * 地图、排名 Data
 * @param {*} realTimeDataList 
 * @param {*} pressPollutantCode 
 */
const transparency = processColor('#ffffff00');
const chartBlue = processColor('blue');
export const MapRankData=(realTimeDataList,allPointList,pressPollutantCode)=>{
    let fillIcon='';
    let equitmentStatus='';
    let imageList;
    let changeAllPointList=[];
    let markerRealDatas=[];
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
    let kk=-1;
    let point_DGMIN='';
    let colorValue='';
    let pointName;
    //全部实时数据
    realTimeDataList.map((mitem,key1)=>{
        let mmtime=mitem.MonitorTime;
        if(pressPollutantCode!=null&&pressPollutantCode!=''){
              //选择的监测因子是否被包含在实时数据集合里，包含则展示此监测点不包含的话直接忽略该点
              let MyItem = allPointList.find((item)=>{
                return item.dbo__T_Bas_CommonPoint__DGIMN===mitem.DGIMN;
              })
              if(MyItem!=undefined){
                pointName=MyItem.dbo__T_Bas_CommonPoint__PointName;
                point_DGMIN=MyItem.dbo__T_Bas_CommonPoint__DGIMN;
                //绑定设备 与 监测因子
                mkindCode=kindCode(MyItem.dbo__T_Bas_CommonPoint__PollutantType);//该设备类型下所有监测因子code
                //选中的监测因子==设备可以监测的监测因子 展示 否则不展示
                let MyCodeItem = mkindCode[0].find((kinditem)=>{
                  return pressPollutantCode===kinditem;
                })
                if(MyCodeItem!=undefined){
                      kk++;
                      equitmentStatus=MyItem.dbo__T_Bas_CommonPoint__Status;//设备状态
                      imageList=mapEuitmentImage(MyItem.dbo__T_Bas_CommonPoint__PollutantType); 
                      //null是在线 超标；0,3离线 异常
                      let pollutantindex;
                      //status 0离线；3异常；(-1)1,2在线超标
                      if(statusImage(equitmentStatus)!=-1){
                          //离线 异常
                          fillIcon=imageList[statusImage(equitmentStatus)];
                          //离线
                          if(statusImage(equitmentStatus)==1){
                            chartYValue_new='----';
                            chartColor='#ababab';
                            if(pressPollutantCode=='AQI'){
                              listtv='离线';
                            }
                          }else{
                            chartYValue_new='0';
                            chartColor='#489ae3';
                            if(pressPollutantCode=='AQI'){
                              listtv='异常';
                            }
                          }
                      }else{
                          //在线 超标
                          //若污染因子的code===AQI则取AQI的值，否则取XX_IQI的值来【渲染】。值取的是浓度值
                          if(pressPollutantCode=='AQI'){  
                              if(mitem.AQI!=undefined){
                                chartYValue_new=mitem.AQI;
                                colorValue=mitem.AQI;
                                pollutantindex=IAQILevel(mitem.AQI);
                                fillIcon=imageList[pollutantindex];
                                chartColor=valueAQIColor(mitem.AQI);
                                listtv=valueAQIText(mitem.AQI);
                              }else{
                                fillIcon=imageList[1];
                                chartColor='#333333';
                              }                                                                            
                          }else if(pressPollutantCode=='a99054'){
                            if(mitem.a99054!=undefined){
                              chartYValue_new=mitem.a99054;
                              colorValue=mitem.a99054;
                              pollutantindex=TVOCLevel(mitem.a99054);
                              fillIcon=imageList[pollutantindex];
                              chartColor=valueTVOCColor(mitem.a99054);
                              }else{
                                chartYValue_new='----';
                                colorValue=0;
                                fillIcon=imageList[1];
                                chartColor='#333333';
                              }
                          }else{
                            if(mitem[pressPollutantCode]!=undefined){
                              let mCode=pressPollutantCode+'_IAQI';
                              chartYValue_new=mitem[pressPollutantCode];
                              colorValue=mitem[mCode];
                              pollutantindex=IAQILevel(colorValue);
                              fillIcon=imageList[pollutantindex];
                              chartColor=valueAQIColor(colorValue);
                            }else{
                              fillIcon=imageList[1];
                              chartColor='#333333';
                            }
                          }
                      } 
                      MyItem.fillIcon=fillIcon;
                      MyItem.mtime=mitem.MonitorTime;
                      changeAllPointList.push(MyItem);
                      chartXValue=pointName;
                      if(mitem[pressPollutantCode]!=undefined && mitem[pressPollutantCode]!=''){
                        chartYValue=parseFloat(mitem[pressPollutantCode]);
                      }else{
                        chartYValue=0;
                      } 
                      XValueList.push(kk);
                      chartData.push({chartXValue,chartYValue,chartColor,listtv});//柱状图data
                      listRankData.push({chartXValue,chartYValue_new,chartColor,listtv,point_DGMIN});//柱状图下方列表data
                }
                mitem.mkindCode=mkindCode;
                markerRealDatas.push(mitem);
              }
        }
      })
      return {chartData,listRankData,changeAllPointList,mkindCode,markerRealDatas};
}
//排名 正序反序
export const RankAscDescData=(chartData,listRankData)=>{
    let sortchartData=[];
    let sortListRankData=[];
    let sortchartDataAll=[];
    let sortListRankDataAll=[];
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
    return {sortchartDataAll,sortListRankDataAll};
}
//站点详情-折线图data
export const PointDeatilsHourData=(hourDataList,choosePollutantCode)=>{
  let ZXvaule=[];
  let chartColor='';
  let listtv='';
  let XValue='';
  let YValue='';
  let YValue_new='';
  let colors = [];
  let pointColors = [];
  hourDataList.map((item,key)=>{
    XValue=(item.MonitorTime).substring(5,16);
    if(item[choosePollutantCode]==null || item[choosePollutantCode]==''){
      YValue=0;
      YValue_new='-- --';
      chartColor='#ffffff'
      if (key === 0) {
        colors.push(transparency);
        pointColors.push(transparency);
      } else {
        colors[colors.length-1] = transparency;
        colors.push(transparency);
        pointColors.push(transparency);
      }
    }else{
      //若污染因子的code===AQI则取AQI的值，否则取XX_IQI的值
      if(choosePollutantCode=='AQI'){                                                                               
          chartColor=valueAQIColor(item.AQI);
          listtv=valueAQIText(item.AQI);
      }else if(choosePollutantCode=='a99054'){
          chartColor=valueTVOCColor(item.a99054);
      }else{
          let mCode=choosePollutantCode+'_IAQI';
          chartColor=valueAQIColor(item[mCode]);
          listtv=valueAQIText(item[mCode]);
      }
      YValue=parseFloat(item[choosePollutantCode]);
      YValue_new=parseFloat(item[choosePollutantCode]);
      colors.push(chartBlue);
      pointColors.push(chartBlue);
    }
    let choosePollutantName=CodeForName(choosePollutantCode);
    ZXvaule.push({XValue,YValue,YValue_new,chartColor,listtv,choosePollutantName});
  })
  return {ZXvaule,colors,pointColors};
}
