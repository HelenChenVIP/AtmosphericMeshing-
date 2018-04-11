import { StackNavigator } from 'react-navigation';
import HomeNavigator from './Home'
import AlarmNoFeedbackDes from './AlarmNoFeedbackDes';
import AlarmNoFeedbackCheck from './AlarmNoFeedbackCheck';
import AlarmDoneFeedDes from './AlarmDoneFeedDes';
import AlarmDoneFeedbackCheck from './AlarmDoneFeedbackCheck';
import knowledgeBase from './KnowledgeBase';
export default StackNavigator(
    {
      HomeNavigator: { screen: HomeNavigator },
      AlarmNoFeedbackDes:{screen:AlarmNoFeedbackDes},
      AlarmNoFeedbackCheck:{screen:AlarmNoFeedbackCheck},
      AlarmDoneFeedDes:{screen:AlarmDoneFeedDes},
      AlarmDoneFeedbackCheck:{screen:AlarmDoneFeedbackCheck},
      knowledgeBase:{screen:knowledgeBase},
    }, {
      headerMode: 'float',
    }

  );