import React, { Component } from 'react';
import {Alert, View, TextInput} from 'react-native';
import { Image, Text , StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


const myLocation = { description: 'MyLocation', geometry: { location: {} }};
export default class Path extends Component{

    constructor(props){
        super(props);
        this.state={
            myLocation,
            height: 50
        };

        if(props.departinfo){
            this.state.myLocation.geometry.location=props.departinfo
        }

    }

    onFocus() {
        this.setState({
            height: '100%'
        })
    }
    onBlur() {
        this.setState({
            height: 50
        })
    }


    render(){
        return(
            <View style={{height: this.state.height, zIndex: 1}}>
                <GooglePlacesAutocomplete
                    placeholder='Stadium location :'
                    minLength={2} // minimum length of text to search
                    // autoFocus={true}
                    returnKeyType={'search'} // Can be left out for default return key
                    listViewDisplayed={false}    // true/false/undefined
                    fetchDetails={true}
                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                        this.props.handledestination(details.geometry.location);
                        // console.log(data.place_id);
                        // console.log(details.geometry.location);
                    }}
                    textInputProps={{
                        onFocus: () => this.onFocus(),
                        onBlur: () => this.onBlur(),
                    }}
                    //getDefaultValue={() => myLocation.description}
                    query={{
                        key: 'AIzaSyCoIzI4JvkT0MjvaBXH-OSt6d6pYuU1dMg',
                        language: 'fr',
                        components:'country:mar'
                    }}
                    //backgroundColor: this.state.backgroundColor
                    styles={{
                        container: { width: '100%' , zIndex:1, backgroundColor: this.state.backgroundColor},
                        listView:{
                            position:'absolute',
                            zIndex:1001,
                            backgroundColor: '#FFF',
                            elevation: 1,
                            marginTop:50
                        },
                        textInputContainer: {
                            backgroundColor: 'rgba(0,0,0,0)',
                            borderTopWidth: 0,
                            borderBottomWidth:0
                        },
                        textInput: {
                            marginLeft: 5,
                            marginRight: 5,
                            height: 38,
                            color: '#5d5d5d',
                            fontSize: 16
                        },
                        description: {
                            fontWeight: 'bold'
                        },
                        predefinedPlacesDescription: {
                            color: '#1faadb'
                        }
                    }}
                    nearbyPlacesAPI='GooglePlacesSearch'
                    debounce={300}

                    // predefinedPlacesAlwaysVisible={true}
                />
            </View>

        )
    }
}

