import { createStackNavigator } from 'react-navigation-stack';
import MyStaduims from "../screens/ManageStaduim/MyStadiums/MyStaduims";
import Header from "../shared/header";
import React from 'react';
import addNewStadium from "../screens/ManageStaduim/MyStadiums/addNewStadium";
import TermsAndConditions from "../screens/ManageStaduim/MyStadiums/TermsAndConditions";
import stadiumLocation from '../screens/ManageStaduim/MyStadiums/stadiumLocation';
import stadiumProgram from "../screens/ManageStaduim/MyStadiums/nextWeekProgram/stadiumProgram";
import reserveToSomeone from "../screens/ManageStaduim/MyStadiums/reserveToSomeone/reserveToSomeone";
import {strings} from '../translations/translate';

const screens = {
    MyStaduim:{
        screen: MyStaduims,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title={strings('myStadiums.pageTitle1')}/>,
            }
        }
    },
    addNewStadium: {
        screen: addNewStadium,
        navigationOptions: {
            title: strings('myStadiums.pageTitle2'),
        }
    },
    TermsAndConditions: {
        screen: TermsAndConditions,
        navigationOptions: {
            title: strings('myStadiums.pageTitle3'),
        }
    },
    stadiumLocation: {
        screen: stadiumLocation,
        navigationOptions: {
            title: strings('myStadiums.pageTitle4'),
        }
    },
    stadiumProgram: {
        screen: stadiumProgram,
        navigationOptions: {
            title: strings('myStadiums.pageTitle5'),
        }
    },
    reserveToSomeone: {
        screen: reserveToSomeone,
        navigationOptions: {
            title: strings('myStadiums.pageTitle6'),
        }
    },

};
const MyStaduimsStack = createStackNavigator(screens);
export default MyStaduimsStack;
