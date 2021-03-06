//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,processColor,Dimensions,TouchableOpacity } from 'react-native';
import {LineChart} from 'react-native-charts-wrapper';
import update from 'immutability-helper';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 
import { connect } from 'react-redux';
import LoadingComponent from '../../components/comment/LoadingComponent'
import moment from 'moment';
const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * 站点详情 图表
 * Helenchen
 * @class PointDetailsChart
 * @extends {Component}
 */
@connect(({pointdetails,loading})=>({
  zxData:pointdetails.zxData,
}))
class PointDetailsChart extends PureComponent  {
    constructor() {
        super();
        this.state = {
          data: {},
          xAxis:{},
          yAxis: {},
          marker: {
            enabled: true,
            digits: 2,
            backgroundTint: processColor('#ef3344'),
            textColor: processColor('#666666'),
          }
        };
      }
      componentWillMount(){
      
      }    
   
    componentWillReceiveProps(nextProps) {
      if (nextProps.zxData !== this.props.zxData) {
        let values=[];
        let valueFormatter=[];
        let axisMaximum=nextProps.zxData.length;
        nextProps.zxData.ZXvaule.map((item,key)=>{
        values.push({y:item.YValue,marker:`时间:${item.XValue}\n值:${item.YValue}`});
        let time1=(item.XValue).substring(0,5);
        let time2=(item.XValue).substring(6,11);
        let valueXX=time1+'\n'+' '+time2;
        valueFormatter.push(time2);
        })
        this.setState(
          update(this.state, {
            data: {
              $set: {
                dataSets: [{
                  'values': values,
                  label: '',
                  config: {
                    drawValues: false,
                    lineWidth: 1.5,
                    drawCircles: false,
                    colors: nextProps.zxData.colors,
                    drawFilled: true,
                    fillColor: processColor('white'),
                    fillAlpha: 60,
                    valueTextSize: 14,
                    valueFormatter: "##.000",
                  }
                }],
              }
            },
            marker: {
              $set:{
                enabled: true,
            digits: 2,
            backgroundTint: processColor('#ef3344'),
            markerColor: processColor('rgba(240, 240, 240, 0.8)'),
            textColor: processColor('#666666'),
            markerFontSize: 14,
            borderWidth: 1,
              }
             
            },
            xAxis: {
              $set: {
                textSize: 12,
                gridColor: processColor('#ffffff'),
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
                left: {
                  drawGridLines: false
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
  
    }
    render() {
        return (
          <LineChart
            style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT/3,marginBottom:10}}
            data={this.state.data}
            xAxis={this.state.xAxis}
            yAxis={this.state.yAxis}
            marker={this.state.marker}
            drawGridBackground={false}
            borderColor={processColor('teal')}
            animation={{durationX: 2000}}
            borderWidth={1}
            scaleXEnabled={true}
            onSelect={this.handleSelect.bind(this)}
            legend={{enabled: false}}
            chartDescription={{text: ""}
            }
          />
        );
    }
}

// define your styles
const styles = StyleSheet.create({
   
});

//make this component available to the app
export default PointDetailsChart;
