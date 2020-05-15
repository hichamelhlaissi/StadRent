import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View, AppState} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Polygon, Circle, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as IntentLauncher from 'expo-intent-launcher';
import Path from '../../Subscriptions/Path'
import {Spinner} from "native-base";
import Constants from 'expo-constants';
import {strings} from "../../../translations/translate";

export default class stadiumLocation extends React.Component{
    state = {
        locationpermission :false,
        departinfo:{},
        destinationinfo:{},
        location: null,
        errorMessage: null,
        markers: [],
        appState: AppState.currentState,
        LatLng:{
            latitude: 1,
            longitude: 1,
        },
    };
    constructor(props) {
        super(props);
        const {state} = props.navigation;

        // N’appelez pas `this.setState()` ici !
        if (Platform.OS === 'android' && !Constants.isDevice || Platform.OS === 'ios' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
        Location.hasServicesEnabledAsync().then(
            data=>{
                console.log(data)
            }
        )
    }


    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.requestlocation();
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });

        let initialPosition = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.035,
        };
        let markerCords ={
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
        this.setState({
            initialPosition,
            markerCords,
            locationpermission:true,
            departinfo:{
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            },
            pathsShowing: true,
        });


    };
    requestlocation =()=>{
        Alert.alert("alert Message", "Allow Location", [
            {
                text: 'Open Settings',
                onPress: () => this.goToSettings(),
                style: 'cancel',
            },
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
        ]);

    };
    goToSettings = () => {
        if (Platform.OS == 'ios') {
            // Linking for iOS
            Linking.openURL('app-settings:')

        } else {
            //   IntentLauncher for Android
            IntentLauncher.startActivityAsync(
                IntentLauncher.ACTION_MANAGE_ALL_APPLICATIONS_SETTINGS
            );
        }
    };
    departmarker=()=>{
        if(Object.keys(this.state.departinfo).length   != 0){
            return (
                <Marker
                    pinColor={'rgba(38, 114, 227, 1)'}
                    coordinate={{latitude: this.state.departinfo.lat, longitude: this.state.departinfo.lng}}
                >
                    <Callout>
                        <Text>My position</Text>
                    </Callout>
                </Marker>
            )
        }
    };
    destinationmarker=()=>{
        if(Object.keys(this.state.destinationinfo).length   != 0){
            let lat =this.state.destinationinfo.lat;
            let log = this.state.destinationinfo.lng;
            return (
                <Marker
                    pinColor={'rgb(255,4,0)'}
                    coordinate={{latitude: this.state.destinationinfo.lat, longitude: this.state.destinationinfo.lng}}
                    draggable
                    onDragEnd={event => console.log(event)}
                >
                    <Callout>
                        <Text>{strings('stadiumLocation.stadiumLocation')}</Text>
                    </Callout>
                </Marker>
            )
        }
    };
    searchInterface=()=>{
        if(this.state.locationpermission){
            return(<View style={styles.search}>
                <Path
                    departinfo={this.state.departinfo}
                    handledepart={this.notifydepart}
                    handledestination={this.notifydestination}>
                </Path>
            </View>)
        }else{
            return(
                <View style={styles.search}>
                    <Spinner color='black' />
                </View>
            )
        }
    };
    notifydestination=(destination)=>{
        if(destination){
            this.setState({destinationinfo:destination});
            this.state.LatLng = destination;
            //console.log(this.state.LatLng);
            this._map.animateToRegion({
                latitude: destination.lat,
                longitude: destination.lng,
                latitudeDelta: 0.09,
                longitudeDelta: 0.035
            });
        }
    };
    goNext=()=>{
        if (Object.keys(this.state.destinationinfo).length   !== 0){

            this.props.navigation.navigate('addNewStadium', {data2:this.state.destinationinfo});
            console.log(this.state.destinationinfo);
        }else {
            // Alert.alert('Attention!', strings('stadiumLocation.chooseLocationFirst'));
            this.props.navigation.navigate('addNewStadium', {data2:{
                    lat:this.state.markerCords.latitude,
                    lng:this.state.markerCords.longitude
                }});
        }
    };





    render() {
        let lat= 1;
        let log = 1;
        if (this.state.markerCords !== undefined)
        {
             lat =this.state.markerCords.latitude;
             log = this.state.markerCords.longitude;

        }

        return (
            <View style={styles.container}>
                <MapView style={styles.map}
                         provider={PROVIDER_GOOGLE}
                         ref={map => this._map = map}
                         showsUserLocation={true}
                         initialRegion={this.state.initialPosition}
                >
                    <Marker
                        pinColor={'rgb(255,4,0)'}
                        coordinate={{latitude: lat, longitude: log}}
                        draggable
                        onDragEnd={event =>this.setState({destinationinfo:{
                                lat:event.nativeEvent.coordinate.latitude,
                                lng:event.nativeEvent.coordinate.longitude
                            }})   }
                    >
                        <Callout>
                            <Text>{strings('stadiumLocation.stadiumLocation')}</Text>
                        </Callout>
                    </Marker>

                </MapView>
                <TouchableOpacity style={styles.nextButton} onPress={() => this.goNext()}>
                    <Text style={styles.nextButtonText}>{strings('stadiumLocation.next')}</Text>
                </TouchableOpacity >
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'column',
        flex: 1
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    nextButton: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 0,
        backgroundColor: "#5780D9",
        paddingLeft: 12,
        paddingRight: 12,
        marginTop: 5,
        width: '100%',
        height: 50,
        justifyContent: 'center',
    },
    nextButtonText: {
        fontSize: 14,
        color: "#ffffff",
        textTransform: "uppercase",
        textAlign: "center",
        fontWeight: 'bold',
    }
});
