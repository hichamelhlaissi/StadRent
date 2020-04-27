import { createStackNavigator } from 'react-navigation-stack';
import App from "../../App";
import React from 'react';

const screens = {
    App:{
        screen: App,
        navigationOptions: ({ navigation }) => {
            return {
                header: null,
                drawerLockMode: 'locked-closed',
            }
        }
    },
};
const AppStack = createStackNavigator(screens);
export default AppStack;
