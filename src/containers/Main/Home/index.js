import { TabNavigator,TabBarBottom } from 'react-navigation';
import MainMap from './MainMap';
import MainRank from './MainRank';
import MainAlarm from './MainAlarm';
import MainMy from './MainMy';

export default TabNavigator(
  {
    MainMap: { screen: MainMap },
    MainRank: { screen: MainRank },
    MainAlarm: { screen: MainAlarm },
    MainMy: { screen: MainMy }
  },
  {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    lazyLoad: true,
  }
);


