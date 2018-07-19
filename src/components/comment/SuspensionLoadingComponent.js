import React, { Component } from 'react';
import { View, Text, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import globalcolor from '../../config/globalcolor';

export default class SuspensionLoadingComponent extends Component {
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
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  loadingBox: {
    // Loading居中
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明
  },
});
