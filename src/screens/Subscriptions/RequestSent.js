import * as React from 'react';
import {Alert, Button, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {APPROX_STATUSBAR_HEIGHT} from "react-native-paper/src/constants";


export default class RequestSentSubscription extends React.Component {
    constructor(props){
        super(props);
        const {state} = props.navigation;
    }
    componentDidMount(){
        this.RequestSent();
    }
    RequestSent=(StartOver=()=>this.props.navigation.navigate('Subscriptions'))=>{
        setTimeout(function () {
            StartOver();
        },3000)
    };

    render() {
        return (
            <ImageBackground source={require('../../../assets/Images/RequestSent.png')} style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Subscriptions')}>
                    <Icon name="times" size={22} color="#D8D9D4" />
                </TouchableOpacity >
            </ImageBackground>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    button: {
        alignSelf: 'flex-end',
        marginTop: 10,
        marginRight: 10
    },
    buttonsText: {
        fontSize: 12,
        color: "#5780D9",
        textTransform: "uppercase",
        textAlign: "center",
    },
});
