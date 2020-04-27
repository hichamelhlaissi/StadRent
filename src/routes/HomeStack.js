import { createStackNavigator } from 'react-navigation-stack';
import Home from '../screens/Home'
import HeaderNone from "../shared/headerNone";
import Header from "../shared/header";
import Hour from "../screens/Choose/Hour";
import Order_Summary from "../screens/Order_Summary";
import RequestSent from "../screens/RequestSent";
import React from 'react';
import StaduimOnList from "../screens/StaduimsOnList";
const screens = {
  Home:{
      screen: Home,
    navigationOptions: ({ navigation }) => {
        return {
        headerTitle: () => <Header navigation={navigation} title='Home'/>,
        }
    }
  },

    Order_Summary: {
        screen: Order_Summary,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <HeaderNone navigation={navigation} title='Order Summary'/>,
            }
        }
    },
    Hour: {
        screen: Hour,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <HeaderNone navigation={navigation} title='Choose Hour'/>,
            }
        }
    },

    StaduimOnList: {
        screen: StaduimOnList,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <HeaderNone navigation={navigation} title='Staduim List'/>,
            }
        }
    },
    RequestSent: {
        screen: RequestSent,
        navigationOptions: ({ navigation }) => {
            return {
                header: null,
            }
        }
    },
};
const HomeStack = createStackNavigator(screens);
export default HomeStack;
