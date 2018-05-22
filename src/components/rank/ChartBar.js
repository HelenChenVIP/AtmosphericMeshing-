//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,Dimensions } from 'react-native';
import { VictoryChart,VictoryBar,Bar, VictoryAxis,VictoryZoomContainer,VictoryClipContainer,VictoryLabel,VictoryLine, VictoryGroup, VictoryScatter, VictoryTooltip, VictoryVoronoiContainer, VictoryCursorContainer } from 'victory-native';
import { VictoryTheme } from 'victory-core';
import { connect } from 'react-redux';
const SCREEN_WIDTH=Dimensions.get('window').width;

/**
 * 柱状图
 * HelenChen
 * @class ChartBar
 * @extends {Component}
 */
@connect(({app})=>({chartData:app.chartData,
    YZhou:app.YZhou,
    radom5:app.radom5,
    listRankData:app.listRankData,
    ishow:app.ishow}))
class ChartBar extends Component {
    render() {
        if(this.props.ishow)
        {
            return (
                <View><Text>{'正在加载中'}</Text></View>
            );
        }else{
            return (
                <View style={styles.container}>
                    <VictoryChart 
                    style={{
                    parent: {
                        justifyContent:'center',
                        alignItems:'center',
                    },
                    borderColor:'red',
                    borderWidth:1,
                    }}
                    height={200} width={SCREEN_WIDTH-10} padding={{ top: 10, bottom: 40, right: 5, left: 26 }}
                    containerComponent={
                    <VictoryVoronoiContainer
                    width={SCREEN_WIDTH-10}
                        voronoiDimension="x"
                        labels={(d) => {
                        return `${d.chartXValue}\n 值:${d.chartYValue}`;}}
                        labelComponent={
                        <VictoryTooltip
                            width={SCREEN_WIDTH/2-50}
                            cornerRadius={0}
                            flyoutStyle={{ fill: "white"}}/>}
                    />}
                    domainPadding={{ x: 15,y: 15 }}>{
                        <VictoryBar
                        alignment="start"
                        style={{
                            data: {
                            fill: (d) => d.chartColor?d.chartColor:'#489ae3',
                            width: 7,
                            fillOpacity: 0.9,
                            strokeWidth: 1
                            }
                        }}
                        data={this.props.chartData}
                        x={(d) => d.zz}
                        y={(d) => {
                        if(d.chartYValue=='---'){
                            return 0;
                        }
                        return d.chartYValue;}}/>
                    }
                    <VictoryAxis  
                    theme={VictoryTheme.material}
                    tickFormat={this.props.radom5}
                    style={{ axis: { stroke: '#A4A4A4' },
                    axisLabel: { fontSize: 12, fill: '#000' },
                    ticks: { stroke: '#A4A4A4',size:5 },
                    tickLabels: { fontSize: 12, fill: '#999', padding: 5, fontFamily: 'NunitoSans-Regular'},
                    }} />
                    <VictoryAxis
                    dependentAxis
                    domain={this.props.YZhou}
                    tickFormat={(x)=> x }
                    style={{ axis: { stroke: '#A4A4A4' },
                        axisLabel: { fontSize: 12, fill: '#000' },
                        ticks: { stroke: '#A4A4A4' },
                        tickLabels: { fontSize: 12, fill: '#999', padding: 5, fontFamily: 'NunitoSans-Regular'},
                    }} 
                    />
                    </VictoryChart>
                </View>
            );
        }
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
    },
});

//make this component available to the app
export default ChartBar;
