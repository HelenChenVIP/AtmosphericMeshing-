var gk = "23";//国控点
var sk = "24";//省控点
var shik = "25";//市控点
var XX_KQZ = "26";//小型空气站
var EC = "27";//恶臭监测站
var VOC = "28";//VOC微型站
var yczs = "29";//扬尘噪声小型站
var lcs = "30";//六参数微型站
var YD_jcc = "32";//移动监测车
var DQ_CGZ = "34";//大气常规站
var lcs_VOC = "35";//六参数及VOC
var klw = "18";//颗粒物

/**
 * 图例背景色  异常 离线 优 良 轻度 中度 重度 严重 爆表
 * @param {*} lengendCode 
 */
export const mapLengedBack=(lengendCode)=>{
    switch(lengendCode){
        case 'l001':
        return '#489ae3';
        break;
        case 'l002':
        return '#ababab';
        break;
        case 'l003':
        return '#03d304';
        break;
        case 'l004':
        return '#efdc31';
        break;
        case 'l005':
        return '#ffaa00';
        break;
        case 'l006':
        return '#ff401a';
        break;
        case 'l007':
        return '#d20040';
        break;
        case 'l008':
        return '#9c0a4e';
        break;
        case 'l009':
        return '#16010b';
        break;
    }
};
/**
 * 图例前景色  异常 离线 优 良 轻度 中度 重度 严重 爆表 
 * @param {*} lengendCode 
 */
export const mapLengedFore=(lengendCode)=>{
    switch(lengendCode){
        case 'l001':
        case 'l002':
        case 'l003':
        case 'l004':
        case 'l005':
        return '#333333';
        break;
        case 'l006':
        case 'l007':
        case 'l008':      
        case 'l009':
        return '#eeeeee';
        break;
    }
}


/**
 * 地图设备类型 形状 颜色
 * @param {*} equitmentCode 
 */
export const mapEuitment=(equitmentCode)=>{
   //"23"-国控点；"24"-省控点；"25"-市控点； "26"-小型空气站.；"27"-恶臭监测站；"28"-VOC微型站；
   //"29"-扬尘噪声小型站；"30"-六参数微型站；"32"-移动监测车；"34"-大气常规站； "35"-六参数及VOC； "18"-颗粒物；
    switch(equitmentCode){
        case '30':
        return [require('../images/equipment/lcs_l000.png'),require('../images/equipment/lcs_l001.png'),
                require('../images/equipment/lcs_l002.png'),require('../images/equipment/lcs_l003.png'),
                require('../images/equipment/lcs_l004.png'),require('../images/equipment/lcs_l005.png'),
                require('../images/equipment/lcs_l006.png'),require('../images/equipment/lcs_l007.png'),
                require('../images/equipment/lcs_l008.png'),require('../images/equipment/lcs_l009.png')];
        case '18':
        return [require('../images/equipment/klw_l000.png'),require('../images/equipment/klw_l001.png'),
                require('../images/equipment/klw_l002.png'),require('../images/equipment/klw_l003.png'),
                require('../images/equipment/klw_l004.png'),require('../images/equipment/klw_l005.png'),
                require('../images/equipment/klw_l006.png'),require('../images/equipment/klw_l007.png'),
                require('../images/equipment/klw_l008.png'),require('../images/equipment/klw_l009.png')];
        break;
        case '26':
        return [require('../images/equipment/xskqz_l000.png'),require('../images/equipment/xskqz_l001.png'),
                require('../images/equipment/xskqz_l002.png'),require('../images/equipment/xskqz_l003.png'),
                require('../images/equipment/xskqz_l004.png'),require('../images/equipment/xskqz_l005.png'),
                require('../images/equipment/xskqz_l006.png'),require('../images/equipment/xskqz_l007.png'),
                require('../images/equipment/xskqz_l008.png'),require('../images/equipment/xskqz_l009.png')];
        break;
        case '28':
        return [require('../images/equipment/voc_l000.png'),require('../images/equipment/voc_l001.png'),
                require('../images/equipment/voc_l002.png'),require('../images/equipment/voc_l003.png'),
                require('../images/equipment/voc_l004.png'),require('../images/equipment/voc_l005.png'),
                require('../images/equipment/voc_l006.png'),require('../images/equipment/voc_l007.png'),
                require('../images/equipment/voc_l008.png'),require('../images/equipment/voc_l009.png')];
        break;
        case '29':
        return [require('../images/equipment/yczs_l000.png'),require('../images/equipment/yczs_l001.png'),
                require('../images/equipment/yczs_l002.png'),require('../images/equipment/yczs_l003.png'),
                require('../images/equipment/yczs_l004.png'),require('../images/equipment/yczs_l005.png'),
                require('../images/equipment/yczs_l006.png'),require('../images/equipment/yczs_l007.png'),
                require('../images/equipment/yczs_l008.png'),require('../images/equipment/yczs_l009.png')];
        break;
        // case '32':
        // break;
        case '27':
        return [require('../images/equipment/ou_l000.png'),require('../images/equipment/ou_l001.png'),
                require('../images/equipment/ou_l002.png'),require('../images/equipment/ou_l003.png'),
                require('../images/equipment/ou_l004.png'),require('../images/equipment/ou_l005.png'),
                require('../images/equipment/ou_l006.png'),require('../images/equipment/ou_l007.png'),
                require('../images/equipment/ou_l008.png'),require('../images/equipment/ou_l009.png')];
        break;
        case '34':
        return [require('../images/equipment/cgkqz_l000.png'),require('../images/equipment/cgkqz_l001.png'),
                require('../images/equipment/cgkqz_l002.png'),require('../images/equipment/cgkqz_l003.png'),
                require('../images/equipment/cgkqz_l004.png'),require('../images/equipment/cgkqz_l005.png'),
                require('../images/equipment/cgkqz_l006.png'),require('../images/equipment/cgkqz_l007.png'),
                require('../images/equipment/cgkqz_l008.png'),require('../images/equipment/cgkqz_l009.png')];
        break;
        case '35':
        return [require('../images/equipment/lcs_voc_l000.png'),require('../images/equipment/lcs_voc_l001.png'),
                require('../images/equipment/lcs_voc_l002.png'),require('../images/equipment/lcs_voc_l003.png'),
                require('../images/equipment/lcs_voc_l004.png'),require('../images/equipment/lcs_voc_l005.png'),
                require('../images/equipment/lcs_voc_l006.png'),require('../images/equipment/lcs_voc_l007.png'),
                require('../images/equipment/lcs_voc_l008.png'),require('../images/equipment/lcs_voc_l009.png')];
        break;
        case '23':
        return [require('../images/equipment/gk_l000.png'),require('../images/equipment/gk_l001.png'),
                require('../images/equipment/gk_l002.png'),require('../images/equipment/gk_l003.png'),
                require('../images/equipment/gk_l004.png'),require('../images/equipment/gk_l005.png'),
                require('../images/equipment/gk_l006.png'),require('../images/equipment/gk_l007.png'),
                require('../images/equipment/gk_l008.png'),require('../images/equipment/gk_l009.png')];
        break;
        case '24':
        return [require('../images/equipment/sk_l000.png'),require('../images/equipment/sk_l001.png'),
                require('../images/equipment/sk_l002.png'),require('../images/equipment/sk_l003.png'),
                require('../images/equipment/sk_l004.png'),require('../images/equipment/sk_l005.png'),
                require('../images/equipment/sk_l006.png'),require('../images/equipment/sk_l007.png'),
                require('../images/equipment/sk_l008.png'),require('../images/equipment/sk_l009.png')];
        break;
        case '25':
        return [require('../images/equipment/shik_l000.png'),require('../images/equipment/shik_l001.png'),
                require('../images/equipment/shik_l002.png'),require('../images/equipment/shik_l003.png'),
                require('../images/equipment/shik_l004.png'),require('../images/equipment/shik_l005.png'),
                require('../images/equipment/shik_l006.png'),require('../images/equipment/shik_l007.png'),
                require('../images/equipment/shik_l008.png'),require('../images/equipment/shik_l009.png')];
        break;
    }    
}

/**
 * 地图设备类型 形状 颜色
 * @param {*} equitmentCode 
 */
export const mapEuitmentImage=(equitmentCode)=>{
        //"23"-国控点；"24"-省控点；"25"-市控点； "26"-小型空气站.；"27"-恶臭监测站；"28"-VOC微型站；
        //"29"-扬尘噪声小型站；"30"-六参数微型站；"32"-移动监测车；"34"-大气常规站； "35"-六参数及VOC； "18"-颗粒物；
         switch(equitmentCode){
             case '30':
             return [('lcs_l000'),('lcs_l001'),
                     ('lcs_l002'),('lcs_l003'),
                     ('lcs_l004'),('lcs_l005'),
                     ('lcs_l006'),('lcs_l007'),
                     ('lcs_l008'),('lcs_l009')];
             case '18':
             return [('klw_l000'),('klw_l001'),
                     ('klw_l002'),('klw_l003'),
                     ('klw_l004'),('klw_l005'),
                     ('klw_l006'),('klw_l007'),
                     ('klw_l008'),('klw_l009')];
             break;
             case '26':
             return [('xskqz_l000'),('xskqz_l001'),
                     ('xskqz_l002'),('xskqz_l003'),
                     ('xskqz_l004'),('xskqz_l005'),
                     ('xskqz_l006'),('xskqz_l007'),
                     ('xskqz_l008'),('xskqz_l009')];
             break;
             case '28':
             return [('voc_l000'),('voc_l001'),
                     ('voc_l002'),('voc_l003'),
                     ('voc_l004'),('voc_l005'),
                     ('voc_l006'),('voc_l007'),
                     ('voc_l008'),('voc_l009')];
             break;
             case '29':
             return [('yczs_l000'),('yczs_l001'),
                     ('yczs_l002'),('yczs_l003'),
                     ('yczs_l004'),('yczs_l005'),
                     ('yczs_l006'),('yczs_l007'),
                     ('yczs_l008'),('yczs_l009')];
             break;
             // case '32':
             // break;
             case '27':
             return [('ou_l000'),('ou_l001'),
                     ('ou_l002'),('ou_l003'),
                     ('ou_l004'),('ou_l005'),
                     ('ou_l006'),('ou_l007'),
                     ('ou_l008'),('ou_l009')];
             break;
             case '34':
             return [('cgkqz_l000'),('cgkqz_l001'),
                     ('cgkqz_l002'),('cgkqz_l003'),
                     ('cgkqz_l004'),('cgkqz_l005'),
                     ('cgkqz_l006'),('cgkqz_l007'),
                     ('cgkqz_l008'),('cgkqz_l009')];
             break;
             case '35':
             return [('lcs_voc_l000'),('lcs_voc_l001'),
                     ('lcs_voc_l002'),('lcs_voc_l003'),
                     ('lcs_voc_l004'),('lcs_voc_l005'),
                     ('lcs_voc_l006'),('lcs_voc_l007'),
                     ('lcs_voc_l008'),('lcs_voc_l009')];
             break;
             case '23':
             return [('gk_l000'),('gk_l001'),
                     ('gk_l002'),('gk_l003'),
                     ('gk_l004'),('gk_l005'),
                     ('gk_l006'),('gk_l007'),
                     ('gk_l008'),('gk_l009')];
             break;
             case '24':
             return [('sk_l000'),('sk_l001'),
                     ('sk_l002'),('sk_l003'),
                     ('sk_l004'),('sk_l005'),
                     ('sk_l006'),('sk_l007'),
                     ('sk_l008'),('sk_l009')];
             break;
             case '25':
             return [('shik_l000'),('shik_l001'),
                     ('shik_l002'),('shik_l003'),
                     ('shik_l004'),('shik_l005'),
                     ('shik_l006'),('shik_l007'),
                     ('shik_l008'),('shik_l009')];
             break;
         }    
     }
     /**
 *  AQI 级别对应污染描述  异常 离线 优 良 轻度 中度 重度 严重 爆表 
 * @param {*}  //0,50, 100, 150, 200, 300, 499 --0：异常
 */
export const valueAQIText=(value)=>{
        if(value==0){
                return '异常';
        }else if(value>0 && value<=50){
                return '优';
        }else if(value>50 && value<=100){
                return '良';
        }else if(value>100 && value<=150){
                return '轻度';
        }else if(value>150 && value<=200){
                return '中度';
        }else if(value>200 && value<=300){
                return '重度';
        }else if(value>300 && value<=499){
                return '严重';
        }else if(value>499){
                return '爆表';
        }          
    }
/**
 *  AQI 级别对应污染颜色  异常 离线 优 良 轻度 中度 重度 严重 爆表 
 * @param {*}  //0,50, 100, 150, 200, 300, 499 --0：异常
 */
export const valueAQIColor=(value)=>{
        if(value==0){
                return '#489ae3';
        }else if(value>0 && value<=50){
                return '#03d304';
        }else if(value>50 && value<=100){
                return '#efdc31';
        }else if(value>100 && value<=150){
                return '#ffaa00';
        }else if(value>150 && value<=200){
                return '#ff401a';
        }else if(value>200 && value<=300){
                return '#d20040';
        }else if(value>300 && value<=499){
                return '#9c0a4e';
        }else if(value>499){
                return '#16010b';
        }          
    }
    /**
 * TVOC 对应颜色
 * @param {*} value 
 */
export const valueTVOCColor=(value)=>{
        //0,50, 100, 150, 200, 300, 499 --0：异常
       if(value==0){
        return '#489ae3';
       }else if(value>0 && value<=200){
        return '#03d304';
       }else if(value>200 && value<=300){
        return '#efdc31';
       }else if(value>300 && value<=400){
        return '#ffaa00';
       }else if(value>400 && value<=500){
        return '#ff401a';
       }else if(value>500 && value<=600){
        return '#d20040';
       }else if(value>600){
        return '#9c0a4e';
       }
}
/**
 * IAQI 级别对应污染程度-图标
 * @param {*} value 
 */
export const IAQILevel=(value)=>{
    //0,50, 100, 150, 200, 300, 499 --0：异常
   if(value==0){
    return 2;
   }else if(value>0 && value<=50){
    return 3;
   }else if(value>50 && value<=100){
    return 4;
   }else if(value>100 && value<=150){
    return 5;
   }else if(value>150 && value<=200){
    return 6;
   }else if(value>200 && value<=300){
    return 7;
   }else if(value>300 && value<=499){
    return 8;
   }else if(value>499){
    return 9;
   }
}
/**
 * TVOC 对应级别
 * @param {*} value 
 */
export const TVOCLevel=(value)=>{
        //0,50, 100, 150, 200, 300, 499 --0：异常
       if(value==0){
        return 2;
       }else if(value>0 && value<=200){
        return 3;
       }else if(value>200 && value<=300){
        return 4;
       }else if(value>300 && value<=400){
        return 5;
       }else if(value>400 && value<=500){
        return 6;
       }else if(value>500 && value<=600){
        return 7;
       }else if(value>600){
        return 8;
       }
}

/**
 * IAQI 级别对应污染程度-前景色 背景色
 * @param {*} value 
 */
export const IAQIColorLevel=(value)=>{
        //0,50, 100, 150, 200, 300, 499 --0：异常
       if(value==0){
        return ['#489ae3','#333333'];
       }else if(value>0 && value<=50){
        return ['#03d304','#333333'];
       }else if(value>50 && value<=100){
        return ['#efdc31','#333333'];
       }else if(value>100 && value<=150){
        return ['#ffaa00','#333333'];
       }else if(value>150 && value<=200){
        return ['#ff401a','#eeeeee'];
       }else if(value>200 && value<=300){
        return ['#d20040','#eeeeee'];
       }else if(value>300 && value<=499){
        return ['#9c0a4e','#eeeeee'];
       }else if(value>499){
        return ['#16010b','#eeeeee'];
       }else{
        return ['#ffffff','#333333'];
       }
    }
/**
 * 获取污染因子是 AQI 还是IAQI
 * @param {*} pollutantCode 
 */
export const AQIorIAQI=(pollutantCode)=>{
        if(pollutantCode=='AQI'){
                return 'AQI';
        }else if(pollutantCode=='a99054'){
                return 'a99054';
        }else{
                return pollutantCode+'_IAQI';
        }

}
   /**
    * EquitmentStatus 设备状态
    * @param {*} status 0离线；3异常；1,2在线超标
    */
    export const statusImage=(status)=>{
        switch(status){
           case 0:
           return 1;
           break;
           case 3:
           return 2;
           break;
           default:
           return -1;
           break;
        }
   }
   /**
    * 根据设备类型找到所有监测名称以及监测因子
    * @param {*} equitmentCode 
    */
   export const kindCode=(equitmentCode)=>{
        //"23"-国控点；"24"-省控点；"25"-市控点； "26"-小型空气站.；"27"-恶臭监测站；"28"-VOC微型站；
   //"29"-扬尘噪声小型站；"30"-六参数微型站；"32"-移动监测车；"34"-大气常规站； "35"-六参数及VOC； "18"-颗粒物；
           switch(equitmentCode){
                   case '30':
                   return [['AQI', "a34004", "a34002", "a21004", "a21026", "a21005", "a05024","a01001", "a01002"],
                           ['AQI', 'PM25', 'PM10', 'NO2', 'SO2', "CO", 'O3',"温度", "相对湿度"]];
                   break;
                   case '18':
                   return [["a34004", "a34002"],
                           ['PM25', 'PM10']];   
                   break;
                   case '26':
                   return [['AQI', "a34004", "a34002", "a21004", "a21026", "a21005", "a05024"],
                           ['AQI', 'PM25', 'PM10', 'NO2', 'SO2', "CO", 'O3']]; 
                   case '28':
                   return [['a99054'],
                           ['TVOC']]; 
                   case '29':
                   return [["a34002", "a34004", "a340102", "a01015","a01001", "a01002", "s0020", "a01007", "a01008"],
                           ['PM10', 'PM25', "TSP", "噪声","温度", "相对湿度", "气压", "风速", "风向"]]; 
                   case '32':
                   return [['AQI', "a34004", "a34002", "a21004", "a21026", "a21005", "a05024","a00018", "a00017"],
                           ['AQI', 'PM25', 'PM10', 'NO2', 'SO2', "CO", 'O3',"H2S", "NH3"]]; 
                   case '27':
                   return [["ecdj", "a05", "a00017", "a06", "a21089", 'a99054'],
                           ["恶臭等级", "H2S", "NH3", "OU", "恶臭强度", 'TVOC']]; 
                   case '34':
                   case '23':
                   case '24':
                   case '25':
                   return [['AQI', "a34004", "a34002", "a21004", "a21026", "a21005", "a05024", "a01001", "a01002", "s0020", "a01007", "a01008"],
                           ['AQI', 'PM25', 'PM10', 'NO2', 'SO2', "CO", 'O3',"温度", "相对湿度", "气压", "风速", "风向"]];  
                   case '35':
                   return [['AQI', "a34004", "a34002", "a21004", "a21026", "a21005", "a05024","a01001", "a01002", 'a99054'],
                           ['AQI', 'PM25', 'PM10', 'NO2', 'SO2', "CO", 'O3',"温度", "相对湿度", 'TVOC']];     
           }

   }
   /**
    * 根据设备类型找到默认监测因子
    * @param {*} equitmentCode 
    */
   export const kindMRCode=(equitmentCode)=>{
             //"23"-国控点；"24"-省控点；"25"-市控点； "26"-小型空气站.；"27"-恶臭监测站；"28"-VOC微型站；
   //"29"-扬尘噪声小型站；"30"-六参数微型站；"32"-移动监测车；"34"-大气常规站； "35"-六参数及VOC； "18"-颗粒物；
           switch(equitmentCode){
                   case '30':
                   return 'AQI';  
                   case '18':
                   return 'a34004';
                   case '26':
                   return 'AQI';
                   case '28':
                   return 'a99054';
                   case '29':
                   return 'a34002';
                   case '32':
                   return 'AQI';
                   case '27':
                   return 'ecdj';
                   case '34':
                   case '23':
                   case '24':
                   case '25':
                   return 'AQI';
                   case '35':
                   return 'AQI';     
           }
   }
   /**
    * 监测因子对应监测名称
    * @param {*} equitmentCode 
    */
   export const CodeForName=(pollutantCode)=>{
        switch(pollutantCode){
                case 'AQI':
                return 'AQI';

                case 'a34004':
                return 'PM25';

                case 'a34002':
                return 'PM10';

                case 'a21004':
                return 'NO2';

                case 'a21026':
                return 'SO2';

                case 'a21005':
                return 'CO';

                case 'a05024':
                return 'O3';

                case 'a99054':
                return 'TVOC';

                case 'a01015':
                return '噪声';

                case 'a340102':
                return 'TSP';

                case 'a01001':
                return '温度';

                case 'a01002':
                return '相对湿度';

                case 's0020':
                return '气压';

                case 'a01007':
                return '风速';

                case 'a01008':
                return '风向';

                case 'a00017':
                return 'NH3';

                case 'a00018':
                return 'H2S';

                case '6':
                return 'OU';

                case 'a21089':
                return '恶臭强度';
        }
   }
