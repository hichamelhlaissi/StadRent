import { createStackNavigator } from 'react-navigation-stack';
import FavoriteStadiums from '../screens/FavoriteStadiums'
import Header from "../shared/header";
import React from 'react';
import {strings} from '../translations/translate';
const screens = {
    FavoriteStadiums:{
        screen: FavoriteStadiums,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title={strings('favoriteStadiumsPage.pageTitle')}/>,
            }
        }
    },

};
const FavoriteStadiumsStack = createStackNavigator(screens);
export default FavoriteStadiumsStack;
