import {mapLengedBack,mapLengedFore,mapEuitmentImage,statusImage,IAQILevel,kindMRCode,kindCode,TVOCLevel,valueAQIColor,valueTVOCColor,valueAQIText,CodeForName} from '../utils/mapconfig';
import {selectionSort,random5,selectionSortNew} from '../utils/mathUtils';
/**
 * 地图、排名 Data
 * @param {*} realTimeDataList 
 * @param {*} pressPollutantCode 
 */
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
    let listtv_new='';
    let kk=-1;
    let point_DGMIN='';
    //全部实时数据
    realTimeDataList.map((mitem,key1)=>{
        let real_DGMIN=mitem.DGIMN;
        if(pressPollutantCode!=null&&pressPollutantCode!=''){
          //选择的监测因子是否被包含在实时数据集合里，包含则展示此监测点不包含的话直接忽略该点
         // if(mitem[pressPollutantCode]!=null && mitem[pressPollutantCode]!=''){
              //全部站点
              allPointList.map((item,key2)=>{
                mtime=mitem.MonitorTime;
                point_DGMIN=item.dbo__T_Bas_CommonPoint__DGIMN;
                let pointName=item.dbo__T_Bas_CommonPoint__PointName;
                if(point_DGMIN!=null && point_DGMIN!='' && real_DGMIN!=null && real_DGMIN!=''){
                  if(point_DGMIN==real_DGMIN){
                    let equitmentCode=item.dbo__T_Bas_CommonPoint__PollutantType;//设备类型
                    mkindCode=kindCode(equitmentCode);//该设备类型下所有监测因子code
                    //绑定设备 与 监测因子
                    mkindCode[0].map((kinditem,key3)=>{
                      //选中的监测因子==设备可以监测的监测因子 展示 否则不展示
                      if(kinditem==pressPollutantCode){
                        kk++;
                        equitmentStatus=item.dbo__T_Bas_CommonPoint__Status;//设备状态
                        imageList=mapEuitmentImage(equitmentCode); 
                        //null是在线 超标；0,3离线 异常
                        let mValue;
                        let pollutantindex;
                        //status 0离线；3异常；(-1)1,2在线超标
                        if(statusImage(equitmentStatus)!=-1){
                          //离线 异常
                          fillIcon=imageList[statusImage(equitmentStatus)];
                          //离线
                          if(statusImage(equitmentStatus)==1){
                            mValue='----';
                            chartYValue_new=mValue;
                            chartColor='#ababab';
                            if(pressPollutantCode=='AQI'){
                              listtv='离线';
                            }
                          }else{
                            mValue='0';
                            chartYValue_new=mValue;
                            chartColor='#489ae3';
                            if(pressPollutantCode=='AQI'){
                              listtv='异常';
                            }
                          }
                          
                        }else{
                          //在线 超标
                          //若污染因子的code===AQI则取AQI的值，否则取XX_IQI的值
                          if(pressPollutantCode=='AQI'){                                                                               
                              mValue=mitem.AQI;
                              chartYValue_new=mValue;
                              
                          }else if(pressPollutantCode=='a99054'){
                            if(mitem.a99054!=undefined){
                              mValue=mitem.a99054;
                            chartYValue_new=mValue;
                            
                            }else{
                              mValue='';
                            chartYValue_new=mValue;
                            
                            }
                          }else{
                            let mCode=pressPollutantCode+'_IAQI';
                            mValue=mitem[mCode];
                            chartYValue_new=mValue;
                            
                          }
                          //数值 颜色渲染
                          if(mValue!=null && mValue!=''){
                              if(pressPollutantCode=='a99054'){
                                if(TVOCLevel(mValue)!=undefined){
                                  pollutantindex=TVOCLevel(mValue);
                                  fillIcon=imageList[pollutantindex];
                                  chartColor=valueTVOCColor(mValue);
                                  // if(mValue==0){
                                  //   listtv='异常';
                                  // }else if(mValue>0){
                                  //   listtv='';
                                  // }else{
                                  //   listtv='离线';
                                  // }
                                  
                                }else{
                                  fillIcon=imageList[2];
                                  chartColor='#333333';
                                  // listtv='离线';
                                }
                              }else{
                                if(IAQILevel(mValue)!=undefined){
                                  pollutantindex=IAQILevel(mValue);
                                  fillIcon=imageList[pollutantindex];
                                  if(pressPollutantCode=='AQI'){
                                    chartColor=valueAQIColor(mValue);
                                    listtv=valueAQIText(mValue);
                                  }else{
                                    chartColor=valueAQIColor(mValue);
                                    // listtv=valueAQIText(mValue);
                                  }
                                }else{
                                  fillIcon=imageList[2];
                                  chartColor='#333333';
                                  // listtv='离线';
                                }
                              }
                          }else{
                            fillIcon=imageList[1];
                            chartColor='#333333';
                            // listtv='离线';
                          }
                        
                        } 
                        item.fillIcon=fillIcon;
                        changeAllPointList.push(item);
                        chartXValue=pointName;
                        if(mitem[pressPollutantCode]!=undefined && mitem[pressPollutantCode]!=''){
                          chartYValue=parseFloat(mitem[pressPollutantCode]);
                          // chartYValue_new=parseFloat(mitem[pressPollutantCode]);
                        }else{
                          chartYValue=0;
                          // chartYValue_new='---';
                        } 
                          XValueList.push(kk);
                          chartData.push({chartXValue,chartYValue,chartColor,listtv});
                          listRankData.push({chartXValue,chartYValue_new,chartColor,listtv,point_DGMIN});
                      }else{
                        
                      }
                    })
                   
                  }
                }
              }) 
              mitem.mkindCode=mkindCode;
              markerRealDatas.push(mitem);
         // }
        }
      })
      return {chartData,listRankData,changeAllPointList,mkindCode,mtime,markerRealDatas};
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
  let mValue='';
  let chartColor='';
  let listtv='';
  let XValue='';
  let YValue='';
  let YValue_new='';
  hourDataList.map((item,key)=>{
    XValue=(item.MonitorTime).substring(5,16);
    if(item[choosePollutantCode]==null || item[choosePollutantCode]==''){
      YValue=0;
      YValue_new='-- --';
    }else{
      YValue=parseFloat(item[choosePollutantCode]);
      YValue_new=parseFloat(item[choosePollutantCode]);
    }
    //若污染因子的code===AQI则取AQI的值，否则取XX_IQI的值
    if(choosePollutantCode=='AQI'){                                                                               
        mValue=item.AQI;
    }else if(choosePollutantCode=='a99054'){
      if(item.a99054!=undefined){
        mValue=item.a99054;
      }else{
        mValue='';
      }
    }else{
      let mCode=choosePollutantCode+'_IAQI';
      mValue=item[mCode];
    }
    //数值 颜色渲染
    if(mValue!=null && mValue!=''){
      if(choosePollutantCode=='a99054'){
        if(TVOCLevel(mValue)!=undefined){
          chartColor=valueTVOCColor(mValue);
          // if(mValue==0){
          //   listtv='异常';
          // }else if(mValue>0){
          //   listtv='';
          // }else{
          //   listtv='无数据';
          // }
        }else{
          chartColor='#ffffff';
          // listtv='无数据';
        }
      }else{
        if(IAQILevel(mValue)!=undefined){
          if(choosePollutantCode=='AQI'){
            chartColor=valueAQIColor(mValue);
            listtv=valueAQIText(mValue);
          }else{
            chartColor=valueAQIColor(mValue);
            listtv=valueAQIText(mValue);
          }
        }else{
          chartColor='#ffffff';
          // listtv='无数据';
        }
      }
    }else{
      chartColor='#ffffff';
      // listtv='无数据';
    }
    let choosePollutantName=CodeForName(choosePollutantCode);
    ZXvaule.push({XValue,YValue,YValue_new,chartColor,listtv,choosePollutantName});
  })
  return ZXvaule;
}
