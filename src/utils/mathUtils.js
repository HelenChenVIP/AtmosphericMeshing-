import moment from 'moment';

//排序
export const selectionSort=(arr)=>{
    let len = arr.length;
    let minIndex, temp;
    for (let i = 0; i < len - 1; i++) {
        minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if ((arr[j].chartYValue)*1 > (arr[minIndex].chartYValue)*1) {    
                minIndex = j;                 
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
    return arr;
}
//排序
export const selectionSortNew=(arr)=>{
    arr.sort(function(a, b) {
        if(a.chartYValue_new=='----'){
            return 1;
        }else if (b.chartYValue_new=='----'){
            return -100;
        }else{
            return b.chartYValue_new - a.chartYValue_new;
        }
      });
    return arr;
}
//隔5个随机取数
export const random5=(arr)=>{
    const k=8;
    let radow5=[];
    let zzArr=[];
    let len = arr.length;
    for(let i=0;i<len;i++){
        if(i%k==0){
            zzArr=arr[i].zz;
            radow5.push(arr[zzArr].chartXValue);
        }else{
            radow5.push(' ');
        }
    }
    return radow5;
}


//获取24h之前时间
export const timeCalculate=(currTime )=>{
    let mBeging24=moment(currTime).add(-1, 'd').format('YYYY-MM-DD HH:mm:ss');
    let starttime=moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss');
    return mBeging24;
}


export const timeAdd=(time)=>{
    if(time<9){
        time='0'+time;
    }
    return time;
}

//比较两个时间只差 currTime,lastTime
export const timeZC=(DayendTime,DaystartTime)=>{
    let lastTime;
    let endTime;
    if(DayendTime=='' || DaystartTime==''){
        endTime=moment().format('YYYY-MM-DD HH:mm:ss');
        lastTime=moment().add(-30, 'days').format('YYYY-MM-DD HH:mm:ss');
    }else{
        //当前时间
        let currdate=new Date(DaystartTime);
        let nowTimes = currdate.valueOf();
        //之前时间
        let lastdate=new Date(DayendTime);
        let lastTimes = lastdate.valueOf();
        //差值
        let czTime=lastTimes-nowTimes;
        let ctHour=czTime/24*3600*1000;
        if(ctHour<48){
            lastTime=moment().add(-30, 'days').format('YYYY-MM-DD HH:mm:ss');
        }else{
            lastTime=DaystartTime;
        }
        endTime=DayendTime;
    }
    return {lastTime,endTime};
}


//给定时间 按要求留几位
export const timeForm=(time,when)=>{
    let mTime;
    switch(when){
        case 'day':
        mTime=time.substring(0,11);
        break;
        case 'hour':
        mTime=time.substring(0,13)+':00';
        break;
    }
    return mTime;
}
//给定开始时间、结束时间 算取中间时间
export const timeMores=(chooseDays)=>{
        let mBeging='';
        let time='';
        mBeging=chooseDays[0];
        if(chooseDays.length<2){
            time=chooseDays[0];
        }else{
            time=chooseDays[1];
        }
        let mTimeList=[];
        let ff=[];
        if(time>mBeging){
            ff=[mBeging];
            while (time>mBeging)
            {
                mBeging=moment(mBeging).add(1, 'd').format('YYYY-MM-DD HH:mm:ss');
                mTimeList.push(mBeging);
            }
        }else if(time<mBeging){
            ff=[time];
            while (time<mBeging)
            {
                time=moment(time).add(1, 'd').format('YYYY-MM-DD HH:mm:ss');
                mTimeList.push(time);
            }
        }else{
            ff=[chooseDays[0]];
            mTimeList=chooseDays[0];
        }
        let allTimeList=ff.concat(mTimeList);
        return allTimeList;
}

//时间截取
export const timeJQ=(chooseTime)=>{
    let mStart;
    let mEnd;
    switch(chooseTime){
        case '最近24h':
        mStart=moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss');
        mEnd=moment().format('YYYY-MM-DD HH:mm:ss');
        break;
        case '最近30天':
        mStart=moment().add(-30, 'days').format('YYYY-MM-DD HH:mm:ss');
        mEnd=moment().format('YYYY-MM-DD HH:mm:ss');
        break;
        default:
        let timeList=chooseTime.split("至");
        mStart=moment(timeList[0]).format('YYYY-MM-DD HH:mm:ss');
        mEnd=moment(timeList[1]).format('YYYY-MM-DD HH:mm:ss');
        break;
    }
    return [mStart,mEnd];
}


