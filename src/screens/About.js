import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {auth, db} from "../services/FireBaseConfig";
import {strings} from "../translations/translate";

export default class About extends React.Component{
     constructor(props){
         super(props);
     }
    render() {
        return (
            <View style={styles.container}>
                <Text>{strings('aboutPage.Text')}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
