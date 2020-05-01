import { createStackNavigator } from 'react-navigation-stack';
import Subscriptions from '../screens/Subscriptions/Subscriptions'
import Header from "../shared/header";
import React from 'react';
import ChooseStadium from "../screens/Subscriptions/ChooseStadium";
import ChooseTime from "../screens/Subscriptions/ChooseTime";
import RequestSentSubscription from "../screens/Subscriptions/RequestSent";
import StaduimsOnListSubscription from "../screens/Subscriptions/StaduimsOnListSubscription";
import {strings} from '../translations/translate';
const screens = {
    Subscriptions:{
        screen: Subscriptions,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title={strings('subscriptionPage.pageTitle')}/>,
            }
        }
    },
    ChooseStadium: {
      screen: ChooseStadium,
      navigationOptions: {
        title: strings('subscriptionPage.chooseStaduim'),
      }
    },
    ChooseTime: {
        screen: ChooseTime,
        navigationOptions: {
            title: strings('chooseTimePage.pageTitle'),
        }
    },
    StaduimsOnListSubscription: {
        screen: StaduimsOnListSubscription,
        navigationOptions: {
            title: strings('homePage.staduimList'),
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
