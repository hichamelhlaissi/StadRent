import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View, AppState} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Polygon, Circle, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as IntentLauncher from 'expo-intent-launcher';
import Path from '../../Subscriptions/Path'
import {Spinner} from "native-base";
import Constants from 'expo-constants';

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
        this.setState({
            initialPosition,
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
            return (
                <Marker
                    pinColor={'rgb(255,4,0)'}
                    coordinate={{latitude: this.state.destinationinfo.lat, longitude: this.state.destinationinfo.lng}}
                >
                    <Callout>
                        <Text>Stadium location</Text>
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
            Alert.alert('Attention!','Choose the location first');
        }
    };





    render() {

        return (
            <View style={styles.container}>
                <MapView style={styles.map}
                         provider={PROVIDER_GOOGLE}
                         ref={map => this._map = map}
                         showsUserLocation={true}
                         initialRegion={this.state.initialPosition}
                >
                    <MapView.Circle
                        center={this.state.LatLng}
                        radius={2000}
                        fillColor={'rgba(255,157,245,0.5)'}
                    />

                    {/* {
                        this.state.coordinates.map((marker, index) => (
                            <Marker
                                key={marker.name}
                                ref={ref => this.state.markers[index] = ref}
                                onPress={() => this.onMarkerPressed(marker, index)}
                                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                               // icon={require('../../assets/Images/taxi.png')}
                            >
                                <Callout>
                                    <Text>{marker.name}</Text>
                                </Callout>
                            </Marker>
                        ))
                    } */}

                    {/*{this.departmarker()}*/}
                    {this.destinationmarker()}
                    {/*{*/}
                    {/*    this.state.pathsShowing ? <Polyline*/}
                    {/*        coordinates={[*/}
                    {/*            { latitude:  this.state.departinfo.lat, longitude: this.state.departinfo.lng },*/}
                    {/*            { latitude:  this.state.destinationinfo.lat, longitude: this.state.destinationinfo.lng }*/}
                    {/*        ]}*/}
                    {/*        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider*/}
                    {/*        strokeColors={[*/}
                    {/*            '#7F0000',*/}
                    {/*            '#00000000', // no color, creates a "long" gradient between the previous and next coordinate*/}
                    {/*            '#B24112',*/}
                    {/*            '#E5845C',*/}
                    {/*            '#238C23',*/}
                    {/*            '#7F0000'*/}
                    {/*        ]}*/}
                    {/*        strokeWidth={6}*/}
                    {/*    />*/}
                    {/*    : <View></View>*/}
                    {/*}*/}
                </MapView>
                {this.searchInterface()}
                <TouchableOpacity style={styles.nextButton} onPress={() => this.goNext()}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity >
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    nextButton: {
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
