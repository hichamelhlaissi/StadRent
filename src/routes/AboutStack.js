import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from '../screens/Home'
import About from '../screens/About'
import Header from "../shared/header";
import React from 'react';

const screens = {
    About:{
        screen: About,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title='About'/>,
            }
        }
    },

};
const AboutStack = createStackNavigator(screens);
export default AboutStack;
