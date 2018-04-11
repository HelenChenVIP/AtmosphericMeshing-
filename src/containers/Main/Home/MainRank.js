//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,Image, Dimensions, TouchableOpacity,FlatList,ScrollView,processColor } from 'react-native';
import PollutantcodeBarRank from '../../../components/home/PollutantcodeBarRank';
import { connect } from 'react-redux';
import {BarChart} from 'react-native-charts-wrapper';
import RankChartBar from '../../../components/rank/RankChartBar';
const SCREEN_WIDTH=Dimensions.get('window').width;

/**
 * 主页-排名
 * Helenchen
 * @class MainRank
 * @extends {Component}
 */
@connect(({app})=>({chartData:app.chartData,
    YZhou:app.YZhou,
    listRankData:app.listRankData,
    ishow:app.ishow,
    pressPollutantCode:app.pressPollutantCode}))
class MainRank extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: '排名',
        tabBarLable: '实时排名',
        animationEnabled: false,
        headerBackTitle: null,
        headerTintColor: '#ffffff',
        headerTitleStyle: {alignSelf: 'center'},//标题居中
        headerStyle: { backgroundColor: '#5688f6',height:45 },
        labelStyle: {fontSize: 14},
        headerRight:(
            <TouchableOpacity style={{width:24,height:24,marginRight:10}}
            onPress={()=>{
              navigation.state.params.navigatePress();
            }}>
            <Text style={{ fontSize: 12,color: '#ffffff',width:50,height:24,marginRight:10}}>最高</Text>
            </TouchableOpacity>
            ),
        tabBarIcon: ({ focused, tintColor }) =>
          <Image source={focused ? require('../../../images/ic_sort_hover.png') : require('../../../images/ic_sort.png')} style={{height:20,width:20}}></Image>,
      })
      componentDidMount(){
        this.props.navigation.setParams({navigatePress:this.rankUpDown})
      }
      rankUpDown=()=>{
        this.props.navigation.dispatch(createAction('app/getpressCodeData')({
          whitchPage:'Rank',
          pressPollutantCodeRank: this.props.pressPollutantCode!=null ? this.props.pressPollutantCode : mainmap.data[2].pollutantType[0].pollutantCode,
          pressPollutantCodeMap: ''
        }));  
    }
    constructor() {
        super();
        this.state = {
          clicked: false,
          style: {
          },
          isshowloading:false,
          data: {
            dataSets: [{
              values: [{y: 100}, {y: 105}, {y: 102}, {y: 110}, {y: 114}, {y: 109}, {y: 105}, {y: 99}, {y: 95}],
              label: 'Bar dataSet',
              config: {
                colors: [processColor('red'), processColor('blue'), processColor('green')],
                barSpacePercent: 40,
                barShadowColor: processColor('lightgrey'),
                highlightAlpha: 90,
                highlightColor: processColor('red'),
              }
            }],
          },
          xAxis: {
            valueFormatter: ['1', '2', '3'],
            granularityEnabled: true,
            granularity : 1,
            axisMaximum: 13, 
            axisMinimum: 1, 
            centerAxisLabels: true, 
            position: 'BOTTOM' ,
            drawGridLines: false
          },
          yAxis:{
            left:{axisMinimum: 0},
            drawGridLines: false,
            position: 'LEFT' ,
            left: {
              drawLabels: true,
              drawAxisLine: true,
              drawGridLines: false,
              zeroLine: {
                enabled: true,
                lineWidth: 1.5
              }
            },
            right: {
              enabled: false
            }
          },
          legend: {
            enabled: true,
            textSize: 14,
            form: 'SQUARE',
            formSize: 14,
            xEntrySpace: 10,
            yEntrySpace: 5,
            formToTextSpace: 5,
            wordWrapEnabled: true,
            maxSizePercent: 0.5,
          },
          marker: {
            enabled: true,
            markerColor: processColor('#7fa7fa'),
            textColor: processColor('#333333'),
            markerFontSize: 14,
          },
          highlights: [{x: 0}, {x: 1}],
        };
      }
     
      componentWillReceiveProps(nextProps) {
        if (nextProps.chartData !== this.props.chartData) {
          let values=[];
          let valueFormatter=[];
          let colors=[];
          let axisMaximum=nextProps.chartData.length;
          nextProps.chartData.map((item,key)=>{
          values.push({y:item.chartYValue});
          valueFormatter.push(item.chartXValue);
          colors.push(processColor(item.chartColor));
          })
            this.setState({
                data: {
                    ...this.state.data,
                    dataSets: [{
                        ...this.state.data.dataSets[0],
                        values,
                        config:{
                          ...this.state.data.dataSets[0].config,
                          colors
                        }
                    }],
                },
             
              xAxis: {
                ...this.state.xAxis.valueFormatter,
                valueFormatter,
                axisMaximum,
                axisMaximum
              },
            })
        }
    }
      handleZoomDomainChange(domain) {
        //console.log('Domain change: ', domain.x);
        this.setState({ zoomedXDomain: domain.x });
      }
      
    handleSelect(event) {
      let entry = event.nativeEvent
      if (entry == null) {
        this.setState({...this.state, selectedEntry: null})
      } else {
        this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
      }

      console.log(event.nativeEvent)
    }
    //FlatList key
    _extraUniqueKey=(item,index)=> `index11${index}${item}`
    _renderItemList = (item) => {
      if(item.item.listtv!=undefined)
      {
          return (
              <View style={{backgroundColor:'#ffffff',flexDirection: 'row',width:SCREEN_WIDTH,height: 40,justifyContent:'space-between'}}>
                  <Text style={{fontSize: 14,color:'#868686',padding:3,width:SCREEN_WIDTH/3,marginLeft:10}}>{item.item.chartXValue}</Text> 
                  <Text style={{fontSize: 14,color:'#333333',padding:3,width:SCREEN_WIDTH/4-20}}>{item.item.listtv}</Text> 
                  <Text style={{fontSize: 14,color:item.item.chartColor,padding:3,width:SCREEN_WIDTH/6}}>{item.item.chartYValue_new}</Text> 
              </View>
          )
      }
      else{
          return (
              <View style={{backgroundColor:'#ffffff',flexDirection: 'row',width:SCREEN_WIDTH,height: 40,marginLeft:10,marginRight:20,justifyContent:'space-between'}}>
                  <Text style={{fontSize: 14,color:'#868686',padding:3,width:SCREEN_WIDTH/3,marginLeft:10}}>{item.chartXValue}</Text> 
                  <Text style={{fontSize: 14,color:'#333333',padding:3,width:SCREEN_WIDTH/4-20}}>  </Text> 
                  <Text style={{fontSize: 14,color:item.item.chartColor,padding:3,width:SCREEN_WIDTH/6}}>{item.chartYValue_new}</Text> 
              </View>
          )
      }
    }
   
    render() {
          return (
            <View style={{flexDirection:'column',flex:1,}}>
                <PollutantcodeBarRank style={{width:SCREEN_WIDTH,backgroundColor:'#ffffff'}}/> 
                <FlatList                  
                  data={this.props.listRankData}
                  ListHeaderComponent={<View style={{height:300,width:SCREEN_WIDTH,backgroundColor:'#ffffff'}}><RankChartBar/></View>}
                  renderItem={this._renderItemList}
                  keyExtractor={this._extraUniqueKey}/>
            </View>
            
        ); 
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        flexDirection:'column'
    },
    chart: {
      flex: 1
    },
    chartStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default MainRank;
