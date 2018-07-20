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
            return -1;
        }else{
            return b.chartYValue_new - a.chartYValue_new;
        }
      });
    return arr;

    // let nullList=[];
    // let numArr=[];
    // let arrAll=[];
    // arr.map((item,i)=>{
    //     if(item.chartYValue_new=='----'){
    //         nullList.push(item.chartYValue_new);
    //     }else{
    //         let len = arr.length;
    //         let minIndex, temp;
          
    //         for (let i = 0; i < len - 1; i++) {
    //             minIndex = i;
    //             for (let j = i + 1; j < len; j++) {
    //                 if ((arr[j].chartYValue_new)*1 > (arr[minIndex].chartYValue_new)*1) {    
    //                     minIndex = j;                 
    //                 }
    //             }
    //             temp = arr[i];
    //             arr[i] = arr[minIndex];
    //             arr[minIndex] = temp;
    //         }
    //         numArr=arr;
            
    //     }
    //     arrAll=numArr.concat(nullList);
       
    // })
    // return arrAll;
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

