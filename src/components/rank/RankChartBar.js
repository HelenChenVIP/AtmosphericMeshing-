//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,ScrollView,processColor,Dimensions } from 'react-native';
import { connect } from 'react-redux';
import {BarChart} from 'react-native-charts-wrapper';
import LoadingComponent from '../../components/comment/LoadingComponent'

const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
/**
 * 柱状图
 * HelenChen
 * @class RankChartBar
 * @extends {Component}
 */
@connect(({map,loading})=>({
    chartData:map.chartData,
    loading:loading.effects['map/GetGridRealTimeImgDataAndroid'],
    }),null,null,{withRef:true})
class RankChartBar extends Component {
    constructor() {
        super();
        this.state = {
          isReversedOrder:false,
          clicked: false,
          style: {
          },
          data: {
            dataSets: [{
              values: [],
              label: '实时排名',
              config: {
                drawValues: false,  
              }
            }],
          },
          xAxis: {
            drawLabels: true,
            granularityEnabled: true,
            granularity : 1,
            axisMinimum: 0, 
            drawGridLines: false,
          },
          yAxis:{
            drawGridLines: false,
            position: 'LEFT' ,
            left: {
              drawGridLines: false,
              axisMinimum: 0,
              // drawAxisLine: false,
              // drawLabels: true,
              // drawValueAboveBar:false,
              // gridColor: processColor('white')
            },
            right: {
              enabled: false,
              gridColor: processColor('white')
            }
          },
          legend: {
            enabled: false,
          },
          marker: {
            enabled: true,
            digits: 2,
            backgroundTint: processColor('#ef3344'),
            markerColor: processColor('rgba(240, 240, 240, 0.8)'),
            textColor: processColor('#666666'),
            markerFontSize: 14,
            borderWidth: 1,
          },
        };
      }
      componentWillReceiveProps(nextProps) {
        if (nextProps.chartData !== this.props.chartData) {
          let values=[];
          let valueFormatter=[];
          let colors=[];
          let axisMaximum=nextProps.chartData.length;
          nextProps.chartData.map((item,key)=>{
          values.push({y:item.chartYValue,marker:`时间:${item.chartXValue}\n值:${item.chartYValue}`});
          item.chartXValue.length>= valueFormatter.push(item.chartXValue.substring(0,4));
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
            axisMaximum,
            position: 'BOTTOM',
            drawGridLines: false,
          },
        })
        }
    }
      handleZoomDomainChange(domain) {
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

    _sort = () => {
      if (this.props.chartData!= null) {
        let values=[];
        let valueFormatter=[];
        let colors=[];
        let axisMaximum=this.props.chartData.length;
        this.props.chartData.map((item,key)=>{
        values.push({y:item.chartYValue,marker:`时间:${item.chartXValue}\n值:${item.chartYValue}`});
        item.chartXValue.length>= valueFormatter.push(item.chartXValue.substring(0,4));
        colors.push(processColor(item.chartColor));
        })
        if (this.state.isReversedOrder) {
          this.setState({'isReversedOrder':false});
        } else {
          values.reverse();
          valueFormatter.reverse();
          colors.reverse();
          this.setState({'isReversedOrder':true});
        }
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
          axisMaximum,
          position: 'BOTTOM',
          drawGridLines: false,
        },
      })
      }
    }

    render() {
        return (
          this.props.loading?
          <LoadingComponent Message={'正在加载数据...'} /> 
          :<BarChart
               style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT/3}}
                  data={this.state.data}
                  xAxis={this.state.xAxis}
                  yAxis={this.state.yAxis}
                  animation={{durationX: 2000}}
                  chartDescription={{text: ""}}
                  legend={this.state.legend}
                  onSelect={this.handleSelect.bind(this)}
                  marker={this.state.marker}
                  drawBarShadow={false}
                  drawValueAboveBar={true}
                  zoom=  {{scaleX:1, scaleY: 1, xValue: 0, yValue: 0}}
                  />
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    chart: {
        flex: 1
    }
});

//make this component available to the app
export default RankChartBar;
