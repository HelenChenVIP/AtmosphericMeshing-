

/**
 * 根据pollutantCode选择单位
 * @param {*} value 
 */
export const pollutantUnit=(pollutantCode)=>{
    switch(pollutantCode){
        case 'AQI':
        case 'a340102':
        case '6':
        case 'a21089':
        return '';

        case 'a34004':
        case 'a34002':
        case 'a21004':
        case 'a21026':
        case 'a21005':
        case 'a05024':
        case 'm005':
        case 'a00017':
        case 'a00018':
        return 'ugm3';

        case 'a01015':
        return 'dB';

        case 'a01001':
        return '\u2103';

        case 'a01002':
        return '%';

        case 's0020':
        return 'hpa';

        case 'a01007':
        return 'm/s';

        case 'a01008':
        return '°';
     
    }

}
/**
 * 根据warningReasonCode获取图片
 * @param {*} warningReasonCode 
 */
export const warningReason=(warningReasonCode)=>{
    switch(warningReasonCode){
        case 'AQI':
        case 'a340102':
    }

}