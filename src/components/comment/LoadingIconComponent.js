

import React, { PureComponent } from 'react';
import { ActivityIndicator, WingBlank, WhiteSpace, Button } from 'antd-mobile';
import {
  View,
} from 'react-native';
class LoadingIconComponent extends PureComponent {
  render() {
    return (
        <ActivityIndicator
        text="加载中..."
      />
    );
  }
}


export default LoadingIconComponent;
