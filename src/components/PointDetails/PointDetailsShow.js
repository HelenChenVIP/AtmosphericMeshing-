//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions,Image,TouchableOpacity,Modal,FlatList,TouchableWithoutFeedback } from 'react-native';
import { SegmentedControl } from 'antd-mobile';
import PointDetailsFlatList from '../PointDetails/PointDetailsFlatList';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 
import { connect } from 'react-redux';
import {kindCode,kindAndCode} from '../../utils/mapconfig';
import NoDataComponent from '../../components/comment/NoDataComponent';
import Calendar from 'react-native-calendar-select';
import moment from 'moment';
import LoadingComponent from '../../components/comment/LoadingComponent'
import {timeCalculate,timeForm} from '../../utils/mathUtils';
const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
/**
 * 站点详情--数据
 * HelenChen
 * @class PointDetailsShow
 * @extends {Component}
 */
@connect(({pointdetails,loading})=>({
    pointData:pointdetails.pointData,
    HourStartTime:pointdetails.HourStartTime,
    HourendTime:pointdetails.HourendTime,
    DaystartTime:pointdetails.DaystartTime,
    DayendTime:pointdetails.DayendTime,
    loading:loading.effects['pointdetails/PointBaseMsg'],}))
class PointDetailsShow extends PureComponent  {
    static navigationOptions = ({ navigation }) => ({
        title: '站点详情',
        tabBarLable: '站点详情',
        animationEnabled: false,
        headerBackTitle: null,
        headerTintColor: '#ffffff',
        headerTitleStyle: {alignSelf: 'center'},//标题居中
        headerStyle: { backgroundColor: '#5688f6',height:45 },
        labelStyle: {fontSize: 14},
        tabBarIcon: ({ focused, tintColor }) =>
          <Image source={focused ? require('../../images/ic_me_hover.png') : require('../../images/ic_me.png')} style={{height:20,width:20}}></Image>,
      })
    constructor(props) {
        super(props); 
        this.state = {        
            modalVisible:false,
            PagerIndex:'0',
            codeClickID:'',
            codeClickName:'',
            pointName:'----',
            region:'----',
            pollutantType:'----',
            linkman:'----',
            dgimn:'----',
            equitmentType:'----',
            mkindCode:'----',
            chooseTime:'----',
        }
    }
  
    componentWillReceiveProps(nextProps) {
        if (nextProps.pointData !== this.props.pointData) {
            let pointName=nextProps.pointData[0].pointName;
            let region=nextProps.pointData[0].regionName;
            let pollutantType=nextProps.pointData[0].pollutantTypeName;
            let linkman=nextProps.pointData[0].linkman;
            let dgimn=nextProps.pointData[0].DGIMN;
            let equitmentType=nextProps.pointData[0].pollutantType;
            let mkindCode=kindAndCode(equitmentType);
            this.setState({pointName:pointName,region:region,pollutantType:pollutantType,
                linkman:linkman,dgimn:dgimn,equitmentType:equitmentType,
                mkindCode:mkindCode},
                ()=>{
                    if(this.state.PagerIndex=='0'){
                        this.props.dispatch(createAction('pointdetails/updateState')({
                            showIndex: this.state.PagerIndex,
                            codeClickID: this.state.codeClickID,
                            dgimn:this.state.dgimn,

                        }))
                    }else{
                        this.props.dispatch(createAction('pointdetails/updateState')({
                            showIndex: this.state.PagerIndex,
                            codeClickID: this.state.codeClickID,
                            dgimn:this.state.dgimn,
                        }))
                    }
                }
            );
        }
    }
   
    
    render() {
        const color = {
            subColor: '#fff',
            mainColor: '#4c68ea'
        };
        let chooseTime;
        if(this.state.PagerIndex=='0'){
            if(this.props.HourStartTime==''){
                chooseTime='最近24h'
            }else{

                chooseTime=timeForm(this.props.HourStartTime,'hour')+'至'+timeForm(this.props.HourendTime,'hour');
            }
        }else{
            if(this.props.DaystartTime==''){
                chooseTime='最近30天'
            }else{
                chooseTime=timeForm(this.props.DaystartTime,'day')+'至'+timeForm(this.props.DayendTime,'day');
            }
        }
        return (
            this.props.loading ? <LoadingComponent Message={'正在加载数据...'} /> 
            :
            <View style={styles.container}>
                <View style={{flexDirection:'row',height:40,marginTop:1,backgroundColor:'#ffffff',alignItems:'center',justifyContent: 'center',}}>
                    <Text style={{fontSize:16,color:'#4b66e4',marginLeft:10,marginRight:10,textAlignVertical:'center'}}>{this.state.pointName+'('+this.state.region+')'}</Text>
                </View>
                <View style={{flexDirection:'row',height:40,marginTop:1,backgroundColor:'#ffffff',alignItems:'center',justifyContent: 'center',}}>
                    <Text style={{fontSize:14,color:'#818181',marginLeft:10,flex:1,textAlignVertical:'center'}}>设备类型：</Text>
                    <Text style={{fontSize:16,color:'#4b66e4',marginRight:10,textAlignVertical:'center'}}>{this.state.pollutantType}</Text>
                </View>
                <View style={{flexDirection:'row',height:40,marginTop:1,backgroundColor:'#ffffff',alignItems:'center',justifyContent: 'center',}}>
                    <Text style={{fontSize:14,color:'#818181',marginLeft:10,flex:1,textAlignVertical:'center'}}>管理人员：</Text>
                    <Text style={{fontSize:16,color:'#4b66e4',marginRight:10,textAlignVertical:'center'}}>{this.state.linkman}</Text>
                </View>
                <SegmentedControl
                style={{height:38,marginTop: 10,borderRadius:0}}
                values={['小时数据', ' 日数据']}
                onChange={this.onChange}
                onValueChange={this.onValueChange}/>
                <View style={{flexDirection:'row',width:SCREEN_WIDTH,height:30,marginTop:1,backgroundColor:'#ffffff',alignItems:'center',justifyContent:'space-between'}}>
                    {
                        <TouchableOpacity onPress={()=>{this.chooseTime()}}>
                        <Image source={require('../../images/time.png')} style={{width:26,height:26,marginLeft:10}}/>
                        </TouchableOpacity>
                    }
                   
                    {
                        this.state.codeClickName=='PM25' ? <Text style={{flex:1,marginTop:5,backgroundColor:'#ffffff',fontSize:15,color:'#4b66e4',textAlign:'center',alignSelf:'center'}}>PM<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:'#4b66e4'}}>2.5</Text> </Text>
                        : this.state.codeClickName=='PM10' ? <Text style={{flex:1,marginTop:5,backgroundColor:'#ffffff',fontSize:15,color:'#4b66e4',textAlign:'center',alignSelf:'center'}}>PM<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:'#4b66e4'}}>10</Text> </Text> 
                        : this.state.codeClickName=='NO2' ? <Text style={{flex:1,marginTop:5,backgroundColor:'#ffffff',fontSize:15,color:'#4b66e4',textAlign:'center',alignSelf:'center'}}>NO<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:'#4b66e4'}}>2</Text> </Text>
                        : this.state.codeClickName=='SO2' ? <Text style={{flex:1,marginTop:5,backgroundColor:'#ffffff',fontSize:15,color:'#4b66e4',textAlign:'center',alignSelf:'center'}}>SO<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:'#4b66e4'}}>2</Text> </Text>
                        : this.state.codeClickName=='O3' ? <Text style={{flex:1,marginTop:5,backgroundColor:'#ffffff',fontSize:15,color:'#4b66e4',textAlign:'center',alignSelf:'center'}}>O<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:'#4b66e4'}}>3</Text> </Text>
                        :this.state.codeClickName!='' ? <Text style={{flex:1,marginTop:5,backgroundColor:'#ffffff',fontSize:15,color:'#4b66e4',textAlign:'center',alignSelf:'center'}}>{this.state.codeClickName}</Text> :<Text style={{flex:1,marginTop:5,backgroundColor:'#ffffff',fontSize:15,color:'#4b66e4',textAlign:'center',alignSelf:'center'}}>{'AQI'}</Text> 
                    }
                        <TouchableOpacity onPress={()=>{this.chooseCode()}}>
                        <Image source={require('../../images/pollution_type_on.png')} style={{width:26,height:26,marginRight:10}}/>
                        </TouchableOpacity>
                </View>
                <Text style={{width:SCREEN_WIDTH,backgroundColor:'#ffffff',fontSize:13,color:'#818181',textAlign:'center',alignSelf:'center'}}>{chooseTime}</Text>
                <PointDetailsFlatList/>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {alert("Modal has been closed.")}}>
                    <TouchableWithoutFeedback
                        onPress={()=>{this.setState({modalVisible:false})}}>
                        <View style={{backgroundColor:"#383838",opacity:0.8,position:"absolute",alignSelf:'center',flex:1,height:SCREEN_HEIGHT,width:SCREEN_WIDTH,alignItems:'center',justifyContent:'center',}}>
                            <View style={{minHeight: SCREEN_HEIGHT/3,width:SCREEN_WIDTH-40,flexDirection:'column',backgroundColor:'#ffffff',borderRadius:10,alignItems:'center',justifyContent: 'center', }}>
                                <View style={{width:SCREEN_WIDTH-40,height:40,alignSelf:'center'}}>
                                    <View style={{alignItems:'center',justifyContent: 'center',width:SCREEN_WIDTH-40,height:40,backgroundColor:'#568af5',borderTopLeftRadius:10,borderTopRightRadius:10  }}>
                                    <Text style={{fontSize:17,color:'#ffffff',textAlignVertical:'center'}}>监测因子选择</Text>
                                    </View>
                                    <TouchableOpacity style={{position:'absolute',right:2}} onPress={() => {this.setState({modalVisible:false})}}>
                                    <Image source={require('../../images/icon_close_red.png') } style={{width:25,height:25}} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{minHeight: SCREEN_HEIGHT/3-40,width:SCREEN_WIDTH-40,flexDirection:'row',justifyContent:'space-between'
                                    ,flexWrap:'wrap',backgroundColor:'#ffffff',borderBottomLeftRadius:10,borderBottomRightRadius:10,}}>
                                    <FlatList
                                    ListEmptyComponent={() => (this.state.mkindCode ? null : <View style={{ height: SCREEN_HEIGHT - 300 }}><NoDataComponent Message={'没有查询到数据'} /></View>)}
                                    keyExtractor={this.extraUniqueKey}
                                    data={this.state.mkindCode}
                                    renderItem={this.renderItem}
                                    numColumns={2}/>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        );
            
    }
           
    
    onChange = (e) => {
        const i = e.nativeEvent.selectedSegmentIndex;
        //小时数据 日数据
        if(i==0){
            this.setState({PagerIndex:'0'});
        }else{
            this.setState({PagerIndex:'1'});
        }
        if(e.nativeEvent.selectedSegmentIndex=='0'){
            this.props.dispatch(createAction('pointdetails/updateState')({
                // HourStartTime:this.state.HourStartTime,
                // HourendTime: this.state.HourendTime,
                showIndex: e.nativeEvent.selectedSegmentIndex,
            }))
            this.props.dispatch(createAction('pointdetails/GetHourDatas')({
            }));
        }else{
            this.props.dispatch(createAction('pointdetails/updateState')({
                // DaystartTime:this.state.DaystartTime,
                // DayendTime: this.state.DayendTime,
                showIndex: e.nativeEvent.selectedSegmentIndex,
            }))
            this.props.dispatch(createAction('pointdetails/GetDayDatas')({
            }));
        }
    }

    onValueChange = (value) => {
    }
    //选择监测因子
    chooseCode=()=>{
        this.setState({modalVisible:true});
    }
    //选择时间
    chooseTime=()=>{
        // this.calendar && this.calendar.open();
        this.props.dispatch(NavigationActions.navigate({
            routeName: 'MyCalendar',                        
            params: {
                PagerIndex:this.state.PagerIndex,
            } }));
    }


    extraUniqueKey=(item, index) => `index7${index}${item}`
   //渲染污染因子
   renderItem=({ item }) => {
    let codeName;
    if(item.pcode=='a34004'){
        codeName='PM25';
    }else{
        codeName=item.pname;
    }
    return (
        <TouchableOpacity onPress={()=>{this.codeClick(item)}}>
        {
            codeName=='PM25' ? <Text style={{width:SCREEN_WIDTH/2-60,height:40,fontSize:16,color:this.state.codeClickID==item.pcode ? '#f8850b' : '#333333',marginLeft:5,textAlign:'center',alignSelf:'center'}}>PM<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:this.state.codeClickID==item.pcode ? '#f8850b' : '#333333'}}>2.5</Text> </Text>
            : codeName=='PM10' ? <Text style={{width:SCREEN_WIDTH/2-60,height:40,fontSize:16,color:this.state.codeClickID==item.pcode ? '#f8850b' : '#333333',marginLeft:5,textAlign:'center',alignSelf:'center'}}>PM<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:this.state.codeClickID==item.pcode ? '#f8850b' : '#333333'}}>10</Text> </Text> 
            : codeName=='NO2' ? <Text style={{width:SCREEN_WIDTH/2-60,height:40,fontSize:16,color:this.state.codeClickID==item.pcode ? '#f8850b' : '#333333',marginLeft:5,textAlign:'center',alignSelf:'center'}}>NO<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:this.state.codeClickID==item.pcode ? '#f8850b' : '#333333'}}>2</Text> </Text>
            : codeName=='SO2' ? <Text style={{width:SCREEN_WIDTH/2-60,height:40,fontSize:16,color:this.state.codeClickID==item.pcode ? '#f8850b' : '#333333',marginLeft:5,textAlign:'center',alignSelf:'center'}}>SO<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:this.state.codeClickID==item.pcode ? '#f8850b' : '#333333'}}>2</Text> </Text>
            : codeName=='O3' ? <Text style={{width:SCREEN_WIDTH/2-60,height:40,fontSize:16,color:this.state.codeClickID==item.pcode ? '#f8850b' : '#333333',marginLeft:5,textAlign:'center',alignSelf:'center'}}>O<Text style={{fontSize: 8,alignSelf:'center',padding:5,color:this.state.codeClickID==item.pcode ? '#f8850b' : '#333333'}}>3</Text> </Text>
            : <Text style={{width:SCREEN_WIDTH/2-60,height:40,fontSize:16,color:this.state.codeClickID==item.pcode ? '#f8850b' : '#333333',marginLeft:5,textAlign:'center',alignSelf:'center'}}>{codeName}</Text>   
        }
         
          </TouchableOpacity>
    );
}
    //选择的code
    codeClick=(item)=>{
        this.setState({
            codeClickID:item.pcode,
            codeClickName:item.pname,
            modalVisible:false
        },
        ()=>{
            this.props.dispatch(createAction('pointdetails/updateState')({
                codeClickID: this.state.codeClickID,
            }))
            if(this.state.PagerIndex=='0'){
                this.props.dispatch(createAction('pointdetails/GetHourDatas')({
                }));
            }else{
                this.props.dispatch(createAction('pointdetails/GetDayDatas')({
                }));
            }
        });
        
    }

}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        height:SCREEN_HEIGHT,
        width:SCREEN_WIDTH
    },
});

//make this component available to the app
export default PointDetailsShow;
