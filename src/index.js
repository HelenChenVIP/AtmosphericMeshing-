import { AppRegistry, AsyncStorage } from 'react-native';
import React from 'react'; 

import { createLogger } from 'redux-logger';
import { persistStore } from 'redux-persist';

import dva from './utils/dva';
import { ShowToast } from './utils';
import storage from './config/globalstorage';
import { registerModels } from './models';
import { getNetConfig, saveNetConfig, getUseNetConfig } from './dvapack/storage';
import { test } from './dvapack/request';
import createLoading from 'dva-loading';
import Router, { routerMiddleware, screenTracking } from './router';
import api from './config/globalapi';



const logger = createLogger();

if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    error: () => {}
  };
}

const dvaEnhancer = {
  onEffect: (effect, sagaEffects, model) => function * effectEnhancer(...args) {
    const config = getUseNetConfig();
    let url = `${config.neturl + api.system.nettest}`;
    let result = yield test(url, {}).then(async data => true, json => false);
    const CNConfig = [];
    const NetConfig = getNetConfig();
    if (result) {   
      yield effect(...args);
    } else {
      const configBak = NetConfig.find((value, index, arr) => value.isuse === false); 
      config.isuse = false; 
      configBak.isuse = true;
      CNConfig.push(config);
      CNConfig.push(configBak);
      //保存网络设置
      saveNetConfig(CNConfig);
       //拼接url
      url = `${configBak.neturl + api.system.nettest}`;
      result = yield test(url, {}).then(async data => true, json => false);
      if (result) {
        yield effect(...args);
      } else {
        ShowToast('网络断开');
      }
    }
  }
};

// const app = dva({
//   initialState: {},
//   models: [],
//   //  onError(e, dispatch) {
//   //    ShowToast('程序发生错误');
//   //  },
//   onAction: logger,
//   onEffect(effect, sagaEffects, model) {
//     return function* (...args) {
//       const config = getUseNetConfig();
//       let url = `${config.neturl + api.system.nettest}`;
//       let result = yield test(url, {}).then(async data => true, json => false);
//       const CNConfig = [];
//       const NetConfig = getNetConfig();
//       if (result) {   
//         yield effect(...args);
//       } else {
//         const configBak = NetConfig.find((value, index, arr) => value.isuse === false); 
//         config.isuse = false; 
//         configBak.isuse = true;
//         CNConfig.push(config);
//         CNConfig.push(configBak);
//         //保存网络设置
//         saveNetConfig(CNConfig);
//          //拼接url
//         url = `${configBak.neturl + api.system.nettest}`;
//         result = yield test(url, {}).then(async data => true, json => false);
//         if (result) {
//           yield effect(...args);
//         } else {
//           ShowToast('网络断开');
//         }
//       }
//     };
//   }
// });
const app = dva({
  initialState: {},
  models: [],
  ...createLoading({ effects: true }),
  onAction: [routerMiddleware, screenTracking, logger],
});
app.use(dvaEnhancer);
registerModels(app);
const App = app.start(<Router />);
// persistStore(app.getStore(), {
//   storage: AsyncStorage,
//   blacklist: ['router']
// });


// eslint-disable-next-line no-underscore-dangle
AppRegistry.registerComponent('GridTools', () => App);