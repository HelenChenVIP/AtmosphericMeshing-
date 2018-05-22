//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,ScrollView,processColor,Dimensions } from 'react-native';
import { connect } from 'react-redux';
import {BarChart} from 'react-native-charts-wrapper';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 

const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
/**
 * 站点详情 柱状图表
 * Helenchen
 * @class PointDetailsChart
 * @extends {Component}
 */
@connect(({app})=>({zxData:app.zxData}))
class PointDetailsBar extends Component {
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
            digits: 2,
            backgroundTint: processColor('#ef3344'),
            markerColor: processColor('rgba(240, 240, 240, 0.8)'),
            textColor: processColor('#666666'),
            markerFontSize: 14,
          },
          highlights: [{x: 0}],
        };
      }
      componentWillMount(){
        let dgimn=this.props.pointDetailsShow.dgimn;
        let codeClickID=this.props.pointDetailsShow.codeClickID;
        let startTime=this.props.pointDetailsShow.startTime;
        let endTime=this.props.pointDetailsShow.endTime;
        this.props.dispatch(createAction('app/GetDayDatas')({
          dgimn:dgimn,
          codeClickID:codeClickID,
          startTime:startTime,
          endTime:endTime
           }));
      } 
      componentWillReceiveProps(nextProps) {
        if (nextProps.zxData !== this.props.zxData) {
          let values=[];
          let valueFormatter=[];
          let colors=[];
          let axisMaximum=nextProps.zxData.length;
          nextProps.zxData.map((item,key)=>{
          values.push({y:item.YValue,marker:`时间:${item.XValue}\n值:${item.YValue}`});
          valueFormatter.push(item.XValue);
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
            style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT/3}}
            data={this.state.data}
            xAxis={this.state.xAxis}
            yAxis={this.state.yAxis}
            animation={{durationX: 3000}}
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
});

//make this component available to the app
export default PointDetailsBar;
