import moment from 'moment';

//排序
export const selectionSort=(arr)=>{
    let len = arr.length;
    let minIndex, temp;
    for (let i = 0; i < len - 1; i++) {
        minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[j].chartYValue > arr[minIndex].chartYValue) {     //寻找最大的数
                minIndex = j;                 //将最大数的索引保存
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
    let len = arr.length;
    let minIndex, temp;
    for (let i = 0; i < len - 1; i++) {
        minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[j].chartYValue_new > arr[minIndex].chartYValue_new) {     //寻找最大的数
                minIndex = j;                 //将最大数的索引保存
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
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
    //当前时间
    let currdate=new Date(currTime);
    let nowTime = currdate.valueOf();
    //差值
    const JG=24*3600*1000;
    let beginTime=nowTime-JG;
    let mbeginTime = new Date(beginTime);
    let mm=mbeginTime.toString;
    let mBeging24=mbeginTime.getFullYear() + "-" +timeAdd(mbeginTime.getMonth() + 1) + "-" + timeAdd(mbeginTime.getDate()) + " " +timeAdd(mbeginTime.getHours()) + ":" + timeAdd(mbeginTime.getMinutes()) + ":" + timeAdd(mbeginTime.getSeconds());
    return mBeging24;
}

export const timeAdd=(time)=>{
    if(time<9){
        time='0'+time;
    }
    return time;
}

