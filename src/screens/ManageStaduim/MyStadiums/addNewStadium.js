import React, {useState} from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Button,
    Image,
    ScrollView,
    KeyboardAvoidingView, Picker, Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as  ImagePicker from 'expo-image-picker';
import {auth, db, storage} from './../../../services/FireBaseConfig';
import CheckBox from 'react-native-check-box'
import Geocoder from "react-native-geocoding";
import {APPROX_STATUSBAR_HEIGHT} from "react-native-paper/src/constants";
import Spinner from 'react-native-loading-spinner-overlay';
import Autocomplete from "react-native-autocomplete-input";
import Register from "../../../Authentification/Register";
import ModalWrapper from "react-native-modal-wrapper";


export default class addNewStadium extends React.Component{
    state = {
        images: [],
        imagesDb: [],
        imageName: "",
        isChecked: false,
        description: "",
        stadiumName: "",
        responsibleName: "",
        phoneNumber: "",
        stadiumAddress: "",
        test: {
            lat: 1,
            lng: 1,
        },
        Data:{},
        user:{},
        longitude: null,
        latitude: null,
        isLoading: false,
        status: "On pending",
        payment: "Monthly",
        cities: [],
        query: '',
        city: '',
        modalVisible: false,
    };
    constructor(props) {
        super(props);
        const {state} = props.navigation;
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    getCities=  (Data,Change=()=>{this.state.cities.push(Data)})=> {
        let ref = db.ref("/cities");
        let query = ref.orderByChild("City");
        query.once("value", function (snapshot) {
            snapshot.forEach(function (child) {
                Data = child.val();
                Change();
            });
        });
    };

    findCity(query) {
        if (query === '') {
            return [];
        }

        const { cities } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return cities.filter(city => city.City.search(regex) >= 0);
    }


    componentDidMount() {
        this.getCities();
        this.GetUserData();
    }


    onChooseImagePress = async () => {
        if (Object.keys(this.state.images).length === 5){
            Alert.alert("Attention!!", "Maximum of documents to add is 5..");
        }else if (this.state.imageName === ""){
            Alert.alert("Attention!!", "Please give the image a name before uploading it..");
        }else{
            //let result = await ImagePicker.launchCameraAsync();
            let result = await ImagePicker.launchImageLibraryAsync();
            this.state.images.push({uri: result.uri, name: this.state.imageName});
            this.setState({imageName: ""})

            // if (!result.cancelled) {
            //     this.uploadImage(result.uri, this.state.imageName)
            //         .then(() => {
            //             Alert.alert("Success");
            //             this.state.images.push(this.state.imageName);
            //             this.setState({imageName: ""});
            //             console.log(this.state.images);
            //             console.log(this.state.imageName)
            //         })
            //         .catch((error) => {
            //             Alert.alert(error);
            //         });
            // }
        }
    };

    uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = storage.ref().child("images/" + imageName);
        return ref.put(blob);
    };
    termsAndConditions(){
        return <View style={{marginLeft: 8}}><Text>I accept all <Text style={{textDecorationLine: 'underline'}} onPress={() => this.props.navigation.navigate('TermsAndConditions')}>Terms & Conditions</Text></Text></View>
    };
    handleDelete = imageUri => {
        const images = this.state.images.filter(image => image.uri !== imageUri);
        this.setState({ images: images });
    };
    handleStadiumName(value){
        this.setState({stadiumName: value})
    };
    handleResponsibleName(value){
        this.setState({responsibleName: value})
    };
    handlePhoneNumber(value){
        let newText = '';
        let numbers = '0123456789';
        for (var i=0; i < value.length; i++) {
            if(numbers.indexOf(value[i]) > -1 ) {
                newText = newText + value[i];
            }
            else {
                // your call back function
                Alert.alert("Attention", "please enter numbers only");
            }
        }
        this.setState({phoneNumber: newText})
    };
    goChooseStadiumLocation(){
        this.props.navigation.navigate('stadiumLocation');
    };
    GetUserData =(dataUser,isEmailVerified, Change=()=>this.setState({Data:dataUser,isLoading:false}))=>{
        this.state.user = auth.currentUser;
        let userCon = this.state.user.uid;
        let ref = db.ref("/users");
        let query = ref.orderByChild("uid").equalTo(userCon);
        query.once("value", function(snapshot, dataU) {
            snapshot.forEach(function(child) {
                dataU = child.val();
                dataUser = dataU;
                Change();
            });
        });
    };
    onAllDone(){
        this.state.user = auth.currentUser;
        if (this.state.stadiumName === ""|| this.state.city === "" || this.state.responsibleName === "" || this.state.phoneNumber === "" || this.state.stadiumAddress === "" || Object.keys(this.state.images).length   === 0){
            Alert.alert('Attention!!', 'Please fill the required fields.. All the fields are required except: description');
        }else if(!this.state.isChecked){
            Alert.alert('Please accept our terms and conditions to continue');
        } else {

            if ((this.state.Data.FirstName === "") || (this.state.Data.LastName === "") || (this.state.Data.Phone_Number === "") || (!this.state.user.emailVerified)){
                this.props.navigation.navigate('Profile');
                this.setState({isLoading:false});
            }else {
                this.state.isLoading = true;
                for (let image of this.state.images){
                    this.uploadImage(image.uri, image.name);
                    this.state.imagesDb.push({file: image.name+auth.currentUser.uid});
                }
                db.ref('/stadiums').push({
                    uid: auth.currentUser.uid,
                    stadiumName: this.state.stadiumName,
                    responsibleName: this.state.responsibleName,
                    phoneNumber: this.state.phoneNumber,
                    stadiumAddress: this.state.stadiumAddress,
                    description: this.state.description,
                    status: this.state.status,
                    images: this.state.imagesDb,
                    payment: this.state.payment,
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    city: this.state.city,
                    stadiumId: ""
                }).then(data => {
                    this.state.isLoading = false;
                    this.props.navigation.navigate('MyStaduim')
                });
            }

        }
    };
    render() {
        let citiesKeys = Object.keys(this.state.cities);
        if (this.props.navigation.getParam('data2') !== undefined){
            let data2 = this.props.navigation.getParam('data2');
            this.state.longitude = data2.lng;
            this.state.latitude = data2.lat;
            //this.state.test = data2;
            Geocoder.init("AIzaSyCoIzI4JvkT0MjvaBXH-OSt6d6pYuU1dMg");
            Geocoder.from(data2.lat, data2.lng).then(json => {
                this.state.street_number = json.results[0].address_components[0].long_name;
                this.state.route = json.results[0].address_components[1].long_name;
                this.state.subLocality = json.results[0].address_components[2].long_name;
                this.state.locality = json.results[0].address_components[3].long_name;
                this.setState({stadiumAddress: this.state.street_number+", "+this.state.route+", "+this.state.subLocality+", "+this.state.locality});

            });
        }
        const { query } = this.state;
        const cities = this.findCity(query);
        const CloseModal =()=>{
            this.setModalVisible(false);
        };
        return (
            <View style={styles.container}>
                <ModalWrapper
                    animationType="slide"
                    style={{ width: 280, height: 400, paddingLeft: 24, paddingRight: 24 }}
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View style={{flexDirection: 'column', justifyContent: 'space-between'}}>
                    <View style={styles.inputContainer}>
                        <Autocomplete
                            autoCapitalize="none"
                            autoCorrect={false}
                            containerStyle={styles.autocompleteContainer}
                            data={cities}
                            value={this.state.query}
                            defaultValue={query}
                            onChangeText={text => this.setState({ query: text })}
                            placeholder="Enter city here"
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => {this.setState({ city: item.City, query: '' });this.setModalVisible(false)}}>
                                    <Text style={styles.itemText}>
                                        {item.City}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <View style={styles.cancelModalButton}>
                        <Button title="CANCEL" type="regular" onPress={() => {this.setModalVisible(!this.state.modalVisible);this.setState({query: '' })}} />
                    </View>
                    </View>
                </ModalWrapper>
                <Spinner
                    visible={this.state.isLoading}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <ScrollView>
                    <KeyboardAvoidingView behavior="position">
                        <View style={{flexDirection: 'column',
                            justifyContent: 'space-between',alignItems: 'center',}}>
                <View style={styles.inputs}>
                    <TextInput
                        style={styles.input}
                        value={this.state.stadiumName}
                        maxLength={22}
                        placeholder="Stadium name"
                        underlineColorAndroid = "transparent"
                        placeholderTextColor = "#a9a9a1"
                        autoCapitalize = "none"
                        onChangeText={(value) => { this.handleStadiumName(value)}}
                    />
                    <TextInput
                        style={styles.input}
                        value={this.state.responsibleName}
                        maxLength={22}
                        placeholder="Responsible name"
                        underlineColorAndroid = "transparent"
                        placeholderTextColor = "#a9a9a1"
                        autoCapitalize = "none"
                        onChangeText={(value) => { this.handleResponsibleName(value)}}
                    />
                    <TextInput
                        style={styles.input}
                        value={this.state.phoneNumber}
                        maxLength={22}
                        keyboardType={'numeric'}
                        placeholder="Phone number"
                        underlineColorAndroid = "transparent"
                        placeholderTextColor = "#a9a9a1"
                        autoCapitalize = "none"
                        onChangeText={(value) => { this.handlePhoneNumber(value)}}
                    />
                    <View style={{flexDirection: 'column', marginTop: 10}}>
                        <Text style={{fontSize: 15}}>Stadium city</Text>
                        <View style={styles.stadiumAddress}>
                            <View style={{justifyContent: 'center', alignItems: 'center', marginRight: 5}}><Icon name="city" size={16} color="#000" style={{opacity: 0.4}} /></View>
                            <Text style={{opacity: 0.4, width: 245}}> {this.state.city}</Text>
                            <TouchableOpacity style={styles.goChooseButton} onPress={() => {this.setModalVisible(true);}}>
                                <Text style={styles.goChooseButtonText}>Go choose</Text>
                            </TouchableOpacity >
                        </View>
                    </View>
                    <View style={{flexDirection: 'column', marginTop: 10}}>
                        <Text style={{fontSize: 15}}>Stadium address</Text>
                        <View style={styles.stadiumAddress}>
                            <View style={{justifyContent: 'center', alignItems: 'center', marginRight: 5}}><Icon name="map-marker-alt" size={20} color="#000" style={{opacity: 0.4}} /></View>
                            <Text style={{opacity: 0.4, width: 245}}> {this.state.stadiumAddress}</Text>
                            <TouchableOpacity style={styles.goChooseButton} onPress={() => this.goChooseStadiumLocation()}>
                                <Text style={styles.goChooseButtonText}>Go choose</Text>
                            </TouchableOpacity >
                        </View>
                    </View>
                    <View style={{flexDirection: 'column', marginTop: 10}}>
                        <Text style={{fontSize: 15}}>Documents (max: 5)</Text>
                        <View style={styles.documents}>
                            <TextInput
                                style={styles.imageInput}
                                value={this.state.imageName}
                                maxLength={22}
                                placeholder="Image name"
                                underlineColorAndroid = "transparent"
                                placeholderTextColor = "#a9a9a1"
                                autoCapitalize = "none"
                                onChangeText={(value) => { this.setState({imageName: value})}}
                            />
                            <TouchableOpacity style={styles.goChooseButton} onPress={this.onChooseImagePress}>
                                <Text style={styles.goChooseButtonText}>Go choose</Text>
                            </TouchableOpacity >
                        </View>
                        <View>
                            {
                                Object.keys(this.state.images).length   === 0 ? <View style={{marginTop: 8}}><Text style={{opacity: 0.4}}>No documents uploaded</Text></View>
                                    :
                                   this.state.images.map((image) => {
                                            return (
                                                <View style={styles.documentsAdded} key={image.uri}>
                                                    <Text>{image.name}</Text>
                                                    <Icon onPress={() => this.handleDelete(image.uri)} name="trash" size={18} color="#000" style={{opacity: 0.4}} />
                                                </View>
                                            )
                                        })
                            }
                        </View>
                    </View>
                    <View style={styles.textAreaContainer} >
                        <Text style={{fontSize: 15, marginBottom: 5}}>Description</Text>
                        <TextInput
                            style={styles.textArea}
                            underlineColorAndroid="transparent"
                            placeholder="Any notes? add them here please"
                            placeholderTextColor="grey"
                            numberOfLines={10}

                            multiline={true}
                            value={this.state.description}
                            onChangeText={e => {
                                this.setState({
                                    description: e,
                                });
                            }}
                        />
                    </View>
                </View>
                <View style={{width: '100%'}}>
                    <CheckBox
                        style={{flex: 1, padding: 10, marginBottom: 8}}
                        onClick={()=>{
                            this.setState({
                                isChecked:!this.state.isChecked
                            });
                        }}
                        isChecked={this.state.isChecked}
                        rightTextView={this.termsAndConditions()}
                    />
                    <TouchableOpacity style={styles.addNewStadiumButton} onPress={() => this.onAllDone()}>
                        <Text style={styles.addNewStadiumButtonText}>Done</Text>
                    </TouchableOpacity >
                </View>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        //marginTop: APPROX_STATUSBAR_HEIGHT,
        //justifyContent: 'center',
        //alignItems: 'center',
    },
    input: {
        height: 40,
        fontSize: 16,
        borderColor: '#a9a9a1',
        borderBottomWidth: 1,
        opacity: 0.5,
        width: "100%",
        alignSelf: 'center',
        marginBottom: 8,
    },
    imageInput: {
        height: 40,
        fontSize: 16,
        borderColor: '#a9a9a1',
        borderBottomWidth: 1,
        opacity: 0.5,
        width: "60%",
        alignSelf: 'center',
        marginBottom: 8
    },
    inputs: {
        marginTop: 5,
        width: '90%'
    },
    stadiumAddress: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        width: '95%',
        alignSelf: 'center',
    },
    documents: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignSelf: 'center',
    },
    goChooseButton: {
        borderRadius: 30/2,
        backgroundColor: "#E8F7FF",
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 12,
        paddingRight: 12,
        justifyContent: 'center',
        height: 30,
        alignSelf: 'center'
    },
    goChooseButtonText: {
        fontSize: 10,
        color: "#5780D9",
        textTransform: "uppercase",
        textAlign: "center",
    },
    addNewStadiumButton: {
        backgroundColor: "#5780D9",
        paddingLeft: 12,
        paddingRight: 12,
        marginTop: 5,
        width: '100%',
        height: 50,
        justifyContent: 'center',
    },
    addNewStadiumButtonText: {
        fontSize: 14,
        color: "#ffffff",
        textTransform: "uppercase",
        textAlign: "center",
        fontWeight: 'bold',
    },
    textAreaContainer: {
        padding: 5,
        marginTop: 20
    },
    textArea: {
        borderColor: "#333333",
        borderWidth: 1,
        height: 100,
        justifyContent: "flex-start",
        opacity: 0.5
    },
    documentsAdded: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '92%',
        marginTop: 8
    },
    spinnerTextStyle: {
        color: '#ffffff'
    },
    searchIcon: {
        padding: 8,
    },
    inputPicker: {
        flexDirection: 'row',
        borderColor: '#a9a9a1',
        borderBottomWidth: 1,
        width:320,
    },
    autocompleteContainer: {
        zIndex:999
    },
    inputContainer: {
        marginBottom: 50,
        height: 250,
        opacity: 0.5,
    },
    itemText: {
        fontSize: 17,
        color:'#000000',
    },
    cancelModalButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    }
});
