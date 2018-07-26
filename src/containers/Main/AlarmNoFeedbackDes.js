//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,Dimensions,Image,TouchableOpacity,FlatList,StatusBar } from 'react-native';
import NoDataComponent from '../../components/comment/NoDataComponent';
import LoadingComponent from '../../components/comment/LoadingComponent';
import SimpleLoadingComponent from '../../components/comment/SimpleLoadingComponent';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 
import moment from 'moment';
import { connect } from 'react-redux';
import DateDesComponent from '../../components/Alarm/DateDesComponent';

const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
/**
 * 报警-未反馈二级
 * HelenChen
 * @class AlarmNoFeedback
 * @extends {Component}
 */
@connect(({alarm})=>({
    NoAlarmDesData:alarm.NoAlarmDesData,
    PageIndex:alarm.PageIndex,
    alarmNoDesData:alarm.alarmNoDesData,
    allTotal:alarm.allTotal,
    loading:alarm.effectsloading['alarm/FirstGetNoAlarmDes'],
    moreloading:alarm.effectsloading['alarm/GetNoAlarmDes'],
    submitLoading:alarm.effectsloading['alarm/SummitAll'],
    }))
class AlarmNoFeedbackDes extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        title: '预警反馈',
        tabBarLable: '预警反馈',
        animationEnabled: false,
        headerBackTitle: null,
        headerTintColor: '#ffffff',
        headerTitleStyle: {alignSelf: 'center'},//标题居中
        headerStyle: { backgroundColor: '#5688f6',height:45 },
        labelStyle: {fontSize: 14},
      })
    constructor(props) {
        super(props); 
        this.state = {
          isupdate: false,
          startDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          checkboxStatemap:(new Map(): Map<string, boolean>),
          checkboxIndexmap:(new Map(): Map<string, numbuer>),
          checkboxState:false,
          checkboxAlltv:'全选',
          mBeginTime:'',
          mEndTime:'',
          isRefreshing:false,
        };
    }
    componentWillMount(){
        const {DGIMN,PointName,BeginTime,EndTime}=this.props.navigation.state.params
        this.props.dispatch(createAction('alarm/FirstGetNoAlarmDes')({
            DGIMN,PointName,PageIndex:1,BeginTime:'',EndTime:''}));
    }
       
      //FlatList key
    _extraUniqueKey=(item,index)=> `index22${index}${item}`
      //FlatList key
      _extraUniqueKey33=(item,index)=> `index33${index}${item}`
      onChange = (val) => {
      }
    _renderItemList = (item) => {
        if(item!=null){
            return(
                <TouchableOpacity  onPress={() => {this._someChoose(item.item,item.index)}}>
                    <View style={{backgroundColor:'#ffffff',borderColor:'#d7dcdd',borderWidth:1,borderRadius:5,flexDirection:'column',height:70,marginTop:5,marginBottom:5,marginLeft:10,marginRight:10}}>
                        <View style={{flexDirection:'row',height:40,marginLeft:10,marginRight:10,alignItems:'center'}}> 
                            <View style={{flexDirection:'row',height:40,flex:1,alignItems:'center'}}> 
                                {this.state.checkboxStatemap.get(item.item.ID) ?
                                    <Image source={require('../../images/checkbox_pressed.png')} style={{ width: 17, height: 17 }} /> :
                                    <Image source={require('../../images/checkbox_normal.png')} style={{ width: 17, height: 17 }} />
                                }
                                <Text style={{fontSize:16,color:'#4c4c4c',marginLeft:5}}>{item.item.ExceptionTypeName}</Text>
                            </View>
                            <Text style={{fontSize:14,color:'#a2a2a2',marginRight:10}}>{item.item.AlarmTime.length>=16 ? item.item.AlarmTime.substring(5,16) : '时间'}</Text>
                        </View>
                            <Text style={{fontSize:12,color:'#979797',marginLeft:20,marginRight:10}}>{item.item.AlarmMsg}</Text>
                    </View>
                    </TouchableOpacity>
            )
        }{
            return(<NoDataComponent Message={'没有查询到数据'} />);
        }
    }
    //选择其中几项
    _someChoose=(item,index)=>{
        this.setState((state) => {
            const checkboxStatemap = new Map(state.checkboxStatemap);
            const checkboxIndexmap = new Map(state.checkboxIndexmap);
            if (checkboxStatemap.get(item.ID) === undefined) {
                checkboxStatemap.set(item.ID, true); 
            } else {
                checkboxStatemap.delete(item.ID);
            }
            if (checkboxIndexmap.get(item.ID) === undefined) {
                checkboxIndexmap.set(item.ID, index); 
            } else {
                checkboxIndexmap.delete(item.ID);
            }
            return { checkboxStatemap,checkboxIndexmap };
          });

    }
    //全选
    _allChoose=()=>{
        this.setState((state) => {
            // copy the map rather than modifying state.
            const checkboxStatemap = new Map(state.checkboxStatemap);
            const checkboxIndexmap = new Map(state.checkboxIndexmap);
            let checkboxAlltv='全选';
            this.props.NoAlarmDesData.map((item, key) => {
              if (checkboxStatemap.get(item.ID) === undefined) {
                checkboxStatemap.set(item.ID, true); // toggle
                checkboxIndexmap.set(item.ID, key); 
                checkboxAlltv='取消全选';
              } else {
                checkboxStatemap.set(item.ID, !checkboxStatemap.get(item.ID)); // toggle
                checkboxIndexmap.delete(item.ID);
                checkboxAlltv='全选';
              }
            });
            return { checkboxStatemap,checkboxAlltv,checkboxIndexmap };
          });
    }
    clearselect=() => {
        this.state.checkboxStatemap.clear();
      }
    //核实
    _check=()=>{
        if (this.state.checkboxStatemap.size !== 0) {
            this.props.dispatch(createAction('alarm/updateState')({
                alarmNoDesData:{ 
                    ...this.props.alarmNoDesData,
                    State:'0',
                    checkboxStatemap: this.state.checkboxStatemap,
                    checkboxIndexmap: this.state.checkboxIndexmap,
                    clearselect: this.clearselect
                    }
               }));
            this.props.dispatch(NavigationActions.navigate({
                routeName: 'AlarmNoFeedbackCheck',                        
                params: { }}));
          } else {
            ShowToast('请选择报警记录进行核实');
          }
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#5688f6"
                    barStyle="light-content"/>
                <DateDesComponent datachange={(starttime,endtime)=>{
                      const {DGIMN,PointName}=this.props.navigation.state.params
                      this.props.dispatch(createAction('alarm/FirstGetNoAlarmDes')({
                          DGIMN,PointName,PageIndex:1,BeginTime:'',EndTime:''}));
                }} />
                {this.props.loading ?
                <LoadingComponent Message={'正在加载数据...'} /> :
                <FlatList
                ListEmptyComponent={() => (this.props.NoAlarmDesData ? null : <View style={{ height: SCREEN_HEIGHT - 200 }}><NoDataComponent Message={'没有查询到数据'} /></View>)}
                data={this.props.NoAlarmDesData}
                renderItem={this._renderItemList}
                keyExtractor={this._extraUniqueKey}
                onEndReachedThreshold={0.1}
                initialNumToRender={12}
                refreshing={this.props.moreloading?this.props.moreloading:false}
                onRefresh={() => {
                    const {DGIMN,PointName}=this.props.navigation.state.params
                      this.props.dispatch(createAction('alarm/FirstGetNoAlarmDes')({
                          DGIMN,PointName,PageIndex:1,BeginTime:'',EndTime:''}));
                }}
                onEndReached={(info) => {
                    if(this.props.PageIndex<=(this.props.allTotal/10)){
                        this.props.dispatch(createAction('alarm/GetNoAlarmDes')({
                            PageIndex:this.props.PageIndex+1}));
                    }
                }}/>
            }
                <View style={{width:SCREEN_WIDTH,height:50,flexDirection:'row',alignItems:'center'}}>
                    <TouchableOpacity style={{height:50,backgroundColor:'#ffffff',flex:1,alignItems:'center', justifyContent: 'center',}} onPress={() => {this._allChoose()}}>
                        <Text style={{fontSize:18,color:'#333333',textAlign:'center',textAlignVertical:'center'}}>{this.state.checkboxAlltv}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{height:50,backgroundColor:'#4884f5',flex:1,alignItems:'center', justifyContent: 'center',}} onPress={() => {this._check()}}>
                        <Text style={{fontSize:18,color:'#ffffff',textAlign:'center',textAlignVertical:'center'}}>反馈</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.props.submitLoading?
                    <SimpleLoadingComponent message={'提交中'}/>
                    :(null)
                }
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#e8f3f8',
        flexDirection:'column'
    },
});

//make this component available to the app
export default AlarmNoFeedbackDes;
