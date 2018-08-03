import { StackNavigator } from 'react-navigation';
import HomeNavigator from './Home'
import AlarmNoFeedbackDes from './AlarmNoFeedbackDes';
import AlarmNoFeedbackCheck from './AlarmNoFeedbackCheck';
import AlarmDoneFeedDes from './AlarmDoneFeedDes';
import AlarmDoneFeedbackCheck from './AlarmDoneFeedbackCheck';
import knowledgeBase from './KnowledgeBase';
import PointDetailsShow from './../../components/PointDetails/PointDetailsShow';
import AlarmNoFeedback from './../../components/Alarm/AlarmNoFeedback';
import AlarmDoneFeed from './../../components/Alarm/AlarmDoneFeed';
import MyCalendar from '../Main/MyCalendar';
export default StackNavigator(
    {
      HomeNavigator: { screen: HomeNavigator },
      AlarmNoFeedbackDes:{screen:AlarmNoFeedbackDes},
      AlarmNoFeedbackCheck:{screen:AlarmNoFeedbackCheck},
      AlarmDoneFeedDes:{screen:AlarmDoneFeedDes},
      AlarmDoneFeedbackCheck:{screen:AlarmDoneFeedbackCheck},
      knowledgeBase:{screen:knowledgeBase},
      PointDetailsShow:{screen:PointDetailsShow},
      AlarmNoFeedback:{screen:AlarmNoFeedback},
      AlarmDoneFeed:{screen:AlarmDoneFeed},
      MyCalendar:{screen:MyCalendar},
    }, {
      headerMode: 'float',
    }

  );