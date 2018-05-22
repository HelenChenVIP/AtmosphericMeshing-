// import { AppRegistry } from 'react-native';
// import App from './App';

// AppRegistry.registerComponent('RN_KLW', () => App);
global.__APP__ = true;
global.__ANDROID__ = true;
global.__IOS__ = false;

require('./src');
