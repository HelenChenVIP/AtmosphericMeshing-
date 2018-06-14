//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,ScrollView,processColor } from 'react-native';
import { connect } from 'react-redux';
import {BarChart} from 'react-native-charts-wrapper';
import LoadingComponent from '../../components/comment/LoadingComponent'

/**
 * 柱状图
 * HelenChen
 * @class RankChartBar
 * @extends {Component}
 */
@connect(({app,loading})=>({chartData:app.chartData,
    YZhou:app.YZhou,
    listRankData:app.listRankData,
    ishow:app.ishow,
    loading:loading.effects['app/GetGridRealTimeImgDataAndroid'],
    }),null,null,{withRef:true})
class RankChartBar extends Component {
    constructor() {
        super();
        this.state = {
          isReversedOrder:false,
          clicked: false,
          style: {
          },
          isshowloading:false,
          data: {
            dataSets: [{
              values: [],
              label: 'Bar dataSet',
              config: {
                drawValues: false,
                colors: [processColor('red'), processColor('blue'), processColor('green')],
                barSpacePercent: 40,
                barShadowColor: processColor('lightgrey'),
                highlightAlpha: 90,
                highlightColor: processColor('red'),
              }
            }],
          },
          xAxis: {
            valueFormatter: [],
            granularityEnabled: true,
            granularity : 1,
            axisMaximum: 100, 
            axisMinimum: -0.5, 
            centerAxisLabels: true, 
            position: 'BOTTOM' ,
            drawGridLines: false
          },
          yAxis:{
            drawGridLines: false,
            position: 'LEFT' ,
            left: {
              axisMinimum: 0,
              drawLabels: true,
              drawAxisLine: true,
              drawValueAboveBar:false,
              zeroLine: {
                enabled: true,
                lineWidth: 1
              }
            },
            right: {
              enabled: false
            }
          },
          legend: {
            enabled: false,
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
            digits: 2,
            backgroundTint: processColor('#ef3344'),
            markerColor: processColor('rgba(240, 240, 240, 0.8)'),
            textColor: processColor('#666666'),
            markerFontSize: 14,
          },
          highlights: [{x: 0}],
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

    _sort = () => {
      if (this.props.chartData!= null) {
        let values=[];
        let valueFormatter=[];
        let colors=[];
        let axisMaximum=this.props.chartData.length;
        this.props.chartData.map((item,key)=>{
        values.push({y:item.chartYValue,marker:`时间:${item.chartXValue}\n值:${item.chartYValue}`});
        valueFormatter.push(item.chartXValue);
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
          axisMaximum
        },
      })
      }
    }

    render() {
        return (
          this.props.loading?
          <LoadingComponent/>
          :<BarChart
                  style={styles.chart}
                  data={this.state.data}
                  xAxis={this.state.xAxis}
                  yAxis={this.state.yAxis}
                  animation={{durationX: 2000}}
                  legend={this.state.legend}
                  gridBackgroundColor={processColor('#ffffff')}
                  drawBarShadow={false}
                  drawValueAboveBar={false}
                  drawHighlightArrow={false}
                  drawGridBackground={false}
                  onSelect={this.handleSelect.bind(this)}
                  highlights={this.state.highlights}
                  onChange={(event) => console.log(event.nativeEvent)}
                  marker={this.state.marker}/>
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
