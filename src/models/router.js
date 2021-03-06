import { delay, NavigationActions, getCurrentScreen, Event, getCurrentParams } from '../utils';
import { routerReducer } from '../router';

const actions = [
  NavigationActions.BACK,
  NavigationActions.INIT,
  NavigationActions.NAVIGATE,
  NavigationActions.RESET,
  NavigationActions.SET_PARAMS,
  NavigationActions.URI,
];

export default {
  namespace: 'router',
  state: {
    ...routerReducer(),
    modalVisible:false,
  },
  reducers: {
    apply(state, { payload: action }) {
      return routerReducer(state, action);
    },
    setModalVisible(state, { payload }) {
      return {...state,...payload};
    }
  },
  effects: {
    watch: [
      function* watch({ take, call, put, select }) {
        const loop = true;
        while (loop) {
          const payload = yield take(actions);
          const routerState = yield select(state => state.router);
          const navigateInfo = routerReducer(routerState, payload);
          const currentScreen = getCurrentScreen(navigateInfo);
          const params = getCurrentParams(navigateInfo);
          yield put({
            type: 'apply',
            payload,
          });
          // debounce, see https://github.com/react-community/react-navigation/issues/271
          if (payload.type === 'Navigation/NAVIGATE') {
            // yield call(delay, 500);
          }
        }
      },
      { type: 'watcher' },
    ],
  },
};
