import { createStackNavigator } from 'react-navigation-stack';
import Schedule from "../screens/ManageStaduim/Schedule/Schedule";
import Header from "../shared/header";
import React from 'react';
import {strings} from "../translations/translate";

const screens = {
    Schedule:{
        screen: Schedule,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title={strings('schedule.pageTitle')}/>,
            }
        }
    },

};
const ScheduleStack = createStackNavigator(screens);
export default ScheduleStack;
