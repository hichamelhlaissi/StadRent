import { createStackNavigator } from 'react-navigation-stack';
import MyStaduims from "../screens/ManageStaduim/MyStadiums/MyStaduims";
import Header from "../shared/header";
import React from 'react';
import addNewStadium from "../screens/ManageStaduim/MyStadiums/addNewStadium";
import TermsAndConditions from "../screens/ManageStaduim/MyStadiums/TermsAndConditions";
import stadiumLocation from '../screens/ManageStaduim/MyStadiums/stadiumLocation';
import stadiumProgram from "../screens/ManageStaduim/MyStadiums/nextWeekProgram/stadiumProgram";
import reserveToSomeone from "../screens/ManageStaduim/MyStadiums/reserveToSomeone/reserveToSomeone";

const screens = {
    MyStaduim:{
        screen: MyStaduims,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title='My Staduims'/>,
            }
        }
    },
    addNewStadium: {
        screen: addNewStadium,
        navigationOptions: {
            title: 'Add a new stadium',
        }
    },
    TermsAndConditions: {
        screen: TermsAndConditions,
        navigationOptions: {
            title: 'Terms & Conditions',
        }
    },
    stadiumLocation: {
        screen: stadiumLocation,
        navigationOptions: {
            title: 'Stadium location',
        }
    },
    stadiumProgram: {
        screen: stadiumProgram,
        navigationOptions: {
            title: 'Stadium Program',
        }
    },
    reserveToSomeone: {
        screen: reserveToSomeone,
        navigationOptions: {
            title: 'Reserve To Someone',
        }
    },

};
const MyStaduimsStack = createStackNavigator(screens);
export default MyStaduimsStack;
