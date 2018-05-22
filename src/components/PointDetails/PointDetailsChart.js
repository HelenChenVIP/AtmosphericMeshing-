//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,processColor,Dimensions,TouchableOpacity } from 'react-native';
import {LineChart} from 'react-native-charts-wrapper';
import update from 'immutability-helper';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 
import { connect } from 'react-redux';
const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
/**
 * 站点详情 图表
 * Helenchen
 * @class PointDetailsChart
 * @extends {Component}
 */
@connect(({app})=>({zxData:app.zxData}))
class PointDetailsChart extends Component {
    constructor() {
        super();
        this.state = {
          data: {},
          xAxis:{},
          marker: {
            enabled: true,
            digits: 2,
            backgroundTint: processColor('#ef3344'),
            markerColor: processColor('rgba(240, 240, 240, 0.8)'),
            textColor: processColor('#666666'),
          }
        };
      }
      componentWillMount(){
        let dgimn=this.props.pointDetailsShow.dgimn;
        let codeClickID=this.props.pointDetailsShow.codeClickID;
        let startTime=this.props.pointDetailsShow.startTime;
        let endTime=this.props.pointDetailsShow.endTime;
        this.props.dispatch(createAction('app/GetHourDatas')({
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
        let axisMaximum=nextProps.zxData.length;
        nextProps.zxData.map((item,key)=>{
        values.push({y:item.YValue,marker:`时间:${item.XValue}\n值:${item.YValue}`});
        valueFormatter.push(item.XValue);
        })
        this.setState(
          update(this.state, {
            data: {
              $set: {
                dataSets: [{
                  'values': values,
                  label: 'LineChart',
                  config: {
                    drawValues: false,
                    lineWidth: 0.5,
                    drawCircles: false,
                    highlightColor: processColor('blue'),
                    color: processColor('blue'),
                    drawFilled: true,
                    fillColor: processColor('blue'),
                    fillAlpha: 60,
                    valueTextSize: 14,
                    valueFormatter: "##.000",
                  }
                }],
              }
            },
            xAxis: {
              $set: {
                textSize: 12,
                gridColor: processColor('#bfbfbf'),
                gridLineWidth: 1,
                axisLineColor: processColor('darkgray'),
                axisLineWidth: 1.5,
                avoidFirstLastClipping: false,
                position: 'BOTTOM',
                'valueFormatter':valueFormatter,
                'axisMaximum':valueFormatter.length,
                drawGridLines: false
              }
            },
            yAxis: {
              $set: {
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
              }
            },
          })
        );   
      }
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
        let dgimn=this.props.pointDetailsShow.dgimn;
        let mData=this.state.data;
        let xAxis=this.state.xAxis;
        return (
            <LineChart
            style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT/3}}
            data={this.state.data}
            xAxis={this.state.xAxis}
            marker={this.state.marker}
            chartDescription={{text: ''}}
            drawGridBackground={false}
            borderColor={processColor('teal')}
            animation={{durationX: 3000}}
            borderWidth={1}
            drawBorders={false}
            touchEnabled={true}
            dragEnabled={true}
            scaleEnabled={true}
            scaleXEnabled={true}
            scaleYEnabled={true}
            pinchZoom={false}
            doubleTapToZoomEnabled={true}
            dragDecelerationEnabled={false}
            dragDecelerationFrictionCoef={0.99}
            keepPositionOnRotation={false}
            onSelect={this.handleSelect.bind(this)}
            onChange={(event) => console.log(event.nativeEvent)}
          />
         
         
        );
    }
}

// define your styles
const styles = StyleSheet.create({
   
});

//make this component available to the app
export default PointDetailsChart;
