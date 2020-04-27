import { createStackNavigator } from 'react-navigation-stack';
import FavoriteStadiums from '../screens/FavoriteStadiums'
import Header from "../shared/header";
import React from 'react';

const screens = {
    FavoriteStadiums:{
        screen: FavoriteStadiums,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title='Favorite Stadiums'/>,
            }
        }
    },

};
const FavoriteStadiumsStack = createStackNavigator(screens);
export default FavoriteStadiumsStack;
