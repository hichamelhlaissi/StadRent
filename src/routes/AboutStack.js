import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from '../screens/Home'
import About from '../screens/About'
import Header from "../shared/header";
import React from 'react';
import {strings} from '../translations/translate';
const screens = {
    About:{
        screen: About,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title={strings('aboutPage.pageTitle')}/>,
            }
        }
    },

};
const AboutStack = createStackNavigator(screens);
export default AboutStack;
