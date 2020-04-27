import { createStackNavigator } from 'react-navigation-stack';
import Schedule from "../screens/ManageStaduim/Schedule/Schedule";
import Header from "../shared/header";
import React from 'react';

const screens = {
    Schedule:{
        screen: Schedule,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title='Schedule'/>,
            }
        }
    },

};
const ScheduleStack = createStackNavigator(screens);
export default ScheduleStack;
