import React, { Component } from 'react';
import { View, Text, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import globalcolor from '../../config/globalcolor';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config/globalsize';

export default class SimpleLoadingComponent extends Component {
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
  }

  render() {
    return (
      <Modal transparent={true} onRequestClose={() => this.onRequestClose()}>
        <View style={styles.loadingBox}>
          {/*<ProgressBarAndroid styleAttr='Inverse' color='#FF4500' />*/}
          <ActivityIndicator color={globalcolor.white} />
          <Text style={{color:'white',fontSize:14,}}>{this.props.message}</Text>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  loadingBox: {
    // Loading居中
    height:80,
    width:120,
    marginTop:SCREEN_HEIGHT/2-40,
    marginLeft:SCREEN_WIDTH/2-60,
    borderRadius:8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // 半透明 0.5
  },
});
