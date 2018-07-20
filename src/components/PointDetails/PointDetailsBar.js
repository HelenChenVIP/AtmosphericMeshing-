//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,ScrollView,processColor,Dimensions } from 'react-native';
import { connect } from 'react-redux';
import {BarChart} from 'react-native-charts-wrapper';
import { createAction,ShowToast,NavigationActions} from '../../utils'; 
import LoadingComponent from '../../components/comment/LoadingComponent'

const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
/**
 * 站点详情 柱状图表
 * Helenchen
 * @class PointDetailsChart
 * @extends {Component}
 */
@connect(({app,loading})=>({
  zxData:app.zxData,
  loading:loading.effects['app/GetDayDatas'],}))
class PointDetailsBar extends PureComponent  {
    constructor() {
        super();
        this.state = {
          clicked: false,
          data: {
            dataSets: [{
              values: [],
              label: '日数据',
              config: {
                drawValues: false,
                colors: [],
                barSpacePercent: 40,
                barShadowColor: processColor('lightgrey'),
                highlightAlpha: 90,
                highlightColor: processColor('red'),
              }
            }],
          },
          xAxis: {
            drawGridLines: false,
            valueFormatter: [],
            granularityEnabled: false,
            granularity : 1,
            centerAxisLabels: true, 
            position: 'BOTTOM' ,
            drawLabels: true,
          },
          yAxis:{
            drawGridLines: false,
            position: 'LEFT' ,
            left: {
              drawAxisLine: false,
              drawGridLines: false,
              axisMinimum: 0,
              drawLabels: true,
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
        this.props.dispatch(createAction('app/GetDayDatas')({
           }));
      } 
      componentWillReceiveProps(nextProps) {
        if (nextProps.zxData !== this.props.zxData) {
        
          let values=[];
          let valueFormatter=[];
          let colors=[];
          let axisMaximum=nextProps.zxData.length;
          nextProps.zxData.map((item,key)=>{
          values.push({y:item.YValue,marker:`时间:${(item.XValue).substring(0,5)}\n值:${item.YValue}`});
          valueFormatter.push((item.XValue).substring(0,5));
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
          this.props.loading?
          <LoadingComponent/>
            :<BarChart
            style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT/3}}
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
});

//make this component available to the app
export default PointDetailsBar;
