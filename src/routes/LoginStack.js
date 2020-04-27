import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from '../Authentification/Login';
import Register from "../Authentification/Register";
import HeaderNone from "../shared/headerNone";
import React from 'react';
import MyStaduims from "../screens/ManageStaduim/MyStadiums/MyStaduims";
import Header from "../shared/header";
import Home from "../screens/Home";

const screens = {

    Login:{
        screen: Login,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <HeaderNone navigation={navigation} title='Login'/>,
                header: null,
                drawerLockMode: 'locked-closed',
            }
        }
    },
    Register:{
        screen: Register,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <HeaderNone navigation={navigation} title='Register'/>,
                drawerLockMode: 'locked-closed',
            }
        }
    },
    MyStaduim:{
        screen: MyStaduims,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title='My Staduims'/>,
                headerLeft: null
            }
        }
    },
    Home:{
        screen: Home,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title='Home'/>,
                headerLeft: null
            }
        }
    },

};
const LoginStack = createStackNavigator(screens);
export default LoginStack;
