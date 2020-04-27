import { createStackNavigator } from 'react-navigation-stack';
import Subscriptions from '../screens/Subscriptions/Subscriptions'
import Header from "../shared/header";
import React from 'react';
import ChooseStadium from "../screens/Subscriptions/ChooseStadium";
import ChooseTime from "../screens/Subscriptions/ChooseTime";
import RequestSentSubscription from "../screens/Subscriptions/RequestSent";
import StaduimsOnListSubscription from "../screens/Subscriptions/StaduimsOnListSubscription";
const screens = {
    Subscriptions:{
        screen: Subscriptions,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title='Subscriptions'/>,
            }
        }
    },
    ChooseStadium: {
      screen: ChooseStadium,
      navigationOptions: {
        title: 'Choose a stadium',
      }
    },
    ChooseTime: {
        screen: ChooseTime,
        navigationOptions: {
            title: 'Choose time',
        }
    },
    StaduimsOnListSubscription: {
        screen: StaduimsOnListSubscription,
        navigationOptions: {
            title: 'Choose stadium list',
        }
    },
    RequestSentSubscription: {
        screen: RequestSentSubscription,
        navigationOptions: ({ navigation }) => {
            return {
                header: null,
            }
        }
    },

};
const SubscriptionsStack = createStackNavigator(screens);
export default SubscriptionsStack;
