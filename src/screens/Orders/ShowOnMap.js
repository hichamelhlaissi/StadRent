import React from 'react';
import {ActivityIndicator, Alert, AppState, Button, StyleSheet, Text, View} from 'react-native';
import {auth, db} from "../../services/FireBaseConfig";
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import {Linking} from 'expo';
import * as IntentLauncher from "expo-intent-launcher";
import TouchableOpacity from "react-native-web/dist/exports/TouchableOpacity";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import StarRating from "react-native-star-rating";



export default class ShowOnMap extends React.Component{
    constructor(props){
        super(props);
        this.state={
            starField: 3.5,
            starCount: 5,
            locationPermission :false,
            isLoading:true,
            location: null,
            Data:[],
            appState: AppState.currentState,
        };
        if (Platform.OS === 'android' && !Constants.isDevice || Platform.OS === 'ios' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
        Location.hasServicesEnabledAsync();
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
            locationPermission:true});

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
        if (Platform.OS === 'ios') {
            // Linking for iOS
            Linking.openURL('app-settings:')

        } else {
            //   IntentLauncher for Android
            IntentLauncher.startActivityAsync(
                IntentLauncher.ACTION_MANAGE_ALL_APPLICATIONS_SETTINGS
            );
        }
    };
    onStarRatingPress(rating) {
        this.setState({
            starCount: 5
        });
    }
    onStarRatingPressField(rating) {
        this.setState({
            starField: 3.5
        });
    }
    getData=(Data,Change=()=>{this.setState({Data: Data, isLoading:false})})=>{
        let Key =  this.props.IdStaduimm;
        setTimeout(function(){
            let ref = db.ref("/stadiums");
            let query = ref.orderByKey().equalTo(Key);
            query.once("value", function (snapshot) {
                snapshot.forEach(function (child) {
                    Data = child.val();
                    Change();
                });
            }).then( r =>console.log('success'));
        }, 200);
    };

    componentDidMount() {
        this.getData();
    }



    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator size={50}/>
                </View>
            );
        }

        const MarkerData=()=>{
            return(
                <Marker coordinate={{ latitude: this.state.Data.latitude, longitude: this.state.Data.longitude }}>
                    <View style={styles.cardStyle}>
                        <Callout>
                            <Text style={styles.subscriptionName}><MaterialCommunityIcons name='soccer-field' size={20} style={{marginTop:5}} color="#9b9b9b"/>  {this.state.Data.stadiumName}</Text>
                            <View style={styles.feedbacksView}>
                                <StarRating
                                    disabled={false}
                                    maxStars={5}
                                    containerStyle={styles.starsView}
                                    starSize={17}
                                    rating={this.state.starField}
                                    selectedStar={(rating) => this.onStarRatingPressField(rating)}
                                    fullStarColor={'#1db700'}
                                    emptyStarColor={'#1db700'}
                                />
                                <Text style={styles.feedbacksNumber}>(22)</Text>
                            </View>
                            <View style={styles.infos}>
                                <Text>Address : <Text style={{color: '#9b9b9b'}}>{this.state.Data.stadiumAddress}</Text></Text>
                                <Text>Phone Number: <Text style={{color: '#9b9b9b'}}>{this.state.Data.phoneNumber}</Text></Text>
                                <Text>City: <Text style={{color: '#9b9b9b'}}>{this.state.Data.city}</Text></Text>
                                <Text>Last Feedback :</Text>
                                <View style={styles.feedbacksView}>
                                    <StarRating
                                        disabled={false}
                                        maxStars={5}
                                        containerStyle={styles.starsView}
                                        starSize={17}
                                        rating={this.state.starCount}
                                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                                        fullStarColor={'#1db700'}
                                        emptyStarColor={'#1db700'}
                                    />
                                    <Text style={styles.feedbacksNumber}>Nice</Text>
                                </View>

                            </View>
                        </Callout>
                    </View>
                </Marker>
            )
        };
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    ref={map => this._map = map}
                    showsUserLocation={true}
                    initialRegion={this.state.initialPosition}
                >
                    <MarkerData/>

                </MapView>
                <View style={{marginTop:700}}>
                    <Button title='Close' onPress={() => this.props.CloseModal()}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        textAlign: 'center',
    },
    feedbacksNumber: {
        color: 'rgba(32,5,13,0.96)',
        fontSize: 12,
    },
    textStyle: {
        width: 100,
        height: 1000,
    },
    starsView: {
        width: 80,
        marginLeft: 15,
        marginRight: 10,
    },
    feedbacksView: {
        flexDirection: 'row',
    },
    cardStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        height: 2000,
        width: 300,
        marginTop: 10,
        borderRadius: 30/2,
    },
    subscriptionName: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
        marginLeft: 15
    },
    infos: {
        flexDirection: 'column',
        marginTop: 8,
    },
    buttonsView: {
        width:100,
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 80,
        marginTop:20,
    },
    buttons: {
        borderRadius: 30/2,
        backgroundColor: "#E8F7FF",
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 12,
        paddingRight: 12,
    },

    buttonsText: {
        fontSize: 12,
        color: "#5780D9",
        textTransform: "uppercase",
        textAlign: "center",
    },
});
