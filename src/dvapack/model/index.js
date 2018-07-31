
import { ShowResult, ShowToast, ShowLoadingToast, CloseToast, Event, ShowAlert } from '../../utils/index';
const PATH_SUBSCRIBER_KEY = '_pathSubscriberKey';

const createNestedValueRecuder = (parentKey, value) => (state, { payload }) => {
  let parentState = state[parentKey];
  const { key } = payload;
  if (key) {
    parentState = typeof parentState === 'boolean'
      ? {}
      : parentState;
    parentState = {
      ...parentState,
      [key]: value
    };
  } else {
    // 兼容旧版本，如果type不存在，则直接对parent赋值
    parentState = value;
  }
  return {
    ...state,
    ...payload,
    [parentKey]: parentState
  };
};

const createNestedRecuder = parentKey => (state, { payload }) => {
  let parentState = state[parentKey];
  parentState = typeof parentState === 'boolean'
    ? {}
    : parentState;

  return {
    ...state,
    [parentKey]: {
      ...parentState,
      payload
    }
  };
};

const getDefaultModel = () => {
  return(({
    // 为了兼容旧版本，初始值依旧为false.如果应用中需要多个控制状态，则在model中覆盖初始属性
    state: {
      effectsloading:{},
    },
    subscriptions: {},
    effects: {},
    reducers: {
      show(state,{payload,actiontype}){
        return {
          ...state,
          ...payload,
          effectsloading:{...state.effectsloading,[actiontype]:true}
        }
      },
      hide(state,{payload,actiontype}){
        return {
          ...state,
          ...payload,
          effectsloading:{...state.effectsloading,[actiontype]:false}
        }
      },
      updateState(state, { payload }) {
        return {
          ...state,
          ...payload
        };
      }
    }
  }));
};

/**
 * 扩展subscription函数的参数,支持listen方法，方便监听path改变
 *
 * listen函数参数如下:
 * pathReg 需要监听的pathname
 * action 匹配path后的回调函数，action即可以是redux的action,也可以是回调函数
 * listen函数同时也支持对多个path的监听，参数为{ pathReg: action, ...} 格式的对象
 *
 * 示例:
 * subscription({ dispath, history, listen }) {
 *  listen('/user/list', { type: 'fetchUsers'});
 *  listen('/user/query', ({ query, params }) => {
 *    dispatch({
 *      type: 'fetchUsers',
 *      payload: params
 *    })
 *  });
 *  listen({
 *    '/user/list': ({ query, params }) => {},
 *    '/user/query': ({ query, params }) => {},
 *  });
 * }
 */
const enhanceSubscriptions = (subscriptions = {}) => {
  return Object
    .keys(subscriptions)
    .reduce((wrappedSubscriptions, key) => {
      wrappedSubscriptions[key] = createWrappedSubscriber(subscriptions[key]);
      return wrappedSubscriptions;
    }, {});

  function createWrappedSubscriber(subscriber) {
    return (props) => {
      const { dispatch, history } = props;

      const listen = (pathReg, action) => {
        let listeners = {};
        if (typeof pathReg === 'object') {
          listeners = pathReg;
        } else {
          listeners[pathReg] = action;
        }
        Event.on('RouterChange', ({ routeName, params, type }) => {
          Object
            .keys(listeners)
            .forEach((key) => {
              if (type.indexOf('BACK')==-1) {
                const _pathReg = key;
                const _action = listeners[key];
                if (routeName === _pathReg) {
                  if (typeof _action === 'object') {
                    dispatch(_action);
                  } else if (typeof _action === 'function') {
                    _action({
                      params
                    });
                  }
                }
              }
              
            });
        });
        // Event.on('RouterChange', ({ currentScreen, params, type }) => {
        //   Object
        //     .keys(listeners)
        //     .forEach((key) => {
        //       const _pathReg = key;
        //       const _action = listeners[key];
        //       if (currentScreen.routeName === _pathReg) {
        //         if (typeof _action === 'object') {
        //           dispatch(_action);
        //         } else if (typeof _action === 'function') {
        //           _action({
        //             params
        //           });
        //         }
        //       }
        //     });
        // });
      };
      subscriber({
        ...props,
        listen
      });
    };
  }
};

/**
 * 扩展effect函数中的sagaEffects参数
 * 支持:
 *  put 扩展put方法，支持双参数模式: put(type, payload)
 *  update 扩展自put方法，方便直接更新state数据，update({ item: item});
 *  callWithLoading,
 *  callWithConfirmLoading,
 *  callWithSpinning,
 *  callWithMessage,
 *  callWithExtra
 *  以上函数都支持第三个参数,message = { successMsg, errorMsg }
 */
const enhanceEffects = (effects = {},autoCancel=[]) => {
  const wrappedEffects = {};
  Object
    .keys(effects)
    .forEach((key) => {
      wrappedEffects[key] = function* (action, sagaEffects) {
        const extraSagaEffects = {
          ...sagaEffects,
          put: createPutEffect(sagaEffects),
          update: createUpdateEffect(sagaEffects),
          updateshow: createAutoEffect(sagaEffects,action.type,true),
          updatehide:createAutoEffect(sagaEffects,action.type,false),
        };
        const { put } = sagaEffects;
        yield put({ type: 'show', payload:{},actiontype:action.type});
        yield effects[key](action, extraSagaEffects);
        const index=autoCancel.find((item)=>{
          return action.type.split('/')[1]===item
        })
        if(index&&index!==-1)
        {
          yield put({ type: 'hide', payload:{},actiontype:action.type});
        }
      };
    });

  return wrappedEffects;

  function createPutEffect(sagaEffects) {
    const { put } = sagaEffects;
    return function* putEffect(type, payload) {
      let action = {
        type,
        payload
      };
      if (arguments.length === 1 && typeof type === 'object') {
        action = arguments[0];
      }
      yield put(action);
    };
  }
  function createAutoEffect(sagaEffects,actiontype,isshow) {
    const { put } = sagaEffects;
    return function* updateEffect(payload) {
      yield put({ type: isshow?'show':'hide', payload,actiontype });
    };
  }
  function createUpdateEffect(sagaEffects) {
    const { put } = sagaEffects;
    
    return function* updateEffect(payload) {
      yield put({ type: 'updateState', payload });
    };
  }
 
};

/**
 * 模型继承方法
 *
 * 如果参数只有一个，则继承默认model
 * @param defaults
 * @param properties
 */
function extend(defaults, properties) {
  if (!properties) {
    properties = defaults;
    defaults = null;
  }
  const model = defaults || getDefaultModel();
  const modelAssignKeys = ['state', 'subscriptions', 'effects', 'reducers'];
  const { namespace } = properties;
  modelAssignKeys.forEach((key) => {
    if (key === 'subscriptions') {
      properties[key] = enhanceSubscriptions(properties[key]);
    }
    if (key === 'effects') {
      properties[key] = enhanceEffects(properties[key],properties['autoCancel']);
    }
    Object.assign(model[key], properties[key]);
  });

  const initialState = {
    ...model.state
  };

  Object.assign(model.reducers, {
    resetState() {
      return {
        ...initialState
      };
    }
  });

  return Object.assign(model, { namespace });
}

export default {
  extend
};
