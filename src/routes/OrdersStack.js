import { createStackNavigator } from 'react-navigation-stack';
import Orders from '../screens/Orders/Orders';
import RequestRoute from "../screens/Orders/RequestRoute";
import Header from "../shared/header";
import HeaderNone from "../shared/headerNone";
import React from 'react';

const screens = {
    Orders:{
        screen: Orders,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title='Orders'/>,
            }
        }
    },

};
const OrdersStack = createStackNavigator(screens);
export default OrdersStack;
