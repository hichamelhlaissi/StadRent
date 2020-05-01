import { createStackNavigator } from 'react-navigation-stack';
import Profile from '../screens/Profile'
import Header from "../shared/header";
import React from 'react';
import {strings} from '../translations/translate';
const screens = {
    Profile:{
        screen: Profile,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title={strings('profilePage.pageTitle')}/>,
            }
        }
    },
};
const ProfileStack = createStackNavigator(screens);
export default ProfileStack;
