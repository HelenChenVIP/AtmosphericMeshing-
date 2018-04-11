//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,ScrollView,processColor } from 'react-native';
import { connect } from 'react-redux';
import {BarChart} from 'react-native-charts-wrapper';
/**
 * 柱状图
 * HelenChen
 * @class RankChartBar
 * @extends {Component}
 */
@connect(({app})=>({chartData:app.chartData,
    YZhou:app.YZhou,
    listRankData:app.listRankData,
    ishow:app.ishow,
    }))
class RankChartBar extends Component {
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
            valueFormatter: ['1', '2', '3'],
            granularityEnabled: true,
            granularity : 1,
            axisMaximum: 100, 
            axisMinimum: -0.5, 
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
            markerColor: processColor('#7fa7fa'),
            textColor: processColor('#333333'),
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

    render() {
        return (
                <BarChart
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
