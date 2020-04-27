import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator} from 'react-native';
import Geocoder from 'react-native-geocoding';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/Entypo';
import {auth, db} from "../../services/FireBaseConfig";


export default class ChooseTime extends React.Component{
    state = {
        street_number: "",
        isLoading: true,
        route: "",
        subLocality: "",
        locality: "",
        fullAddress: "",
        day: "",
        hour: "",
        payment: "",
        subscriptionName: "",
        hoursData: [
            { label: '09:00 -> 10:00', value: '09:00 -> 10:00' },
            { label: '10:00 -> 11:00', value: '10:00 -> 11:00' },
            { label: '11:00 -> 12:00', value: '11:00 -> 12:00' },
            { label: '12:00 -> 13:00', value: '12:00 -> 13:00' },
            { label: '13:00 -> 14:00', value: '13:00 -> 14:00' },
            { label: '14:00 -> 15:00', value: '14:00 -> 15:00' },
            { label: '15:00 -> 16:00', value: '15:00 -> 16:00' },
            { label: '16:00 -> 17:00', value: '16:00 -> 17:00' },
            { label: '17:00 -> 18:00', value: '17:00 -> 18:00' },
            { label: '18:00 -> 19:00', value: '18:00 -> 19:00' },
            { label: '19:00 -> 20:00', value: '19:00 -> 20:00' },
            { label: '20:00 -> 21:00', value: '20:00 -> 21:00' },
            { label: '21:00 -> 22:00', value: '21:00 -> 22:00' },
            { label: '22:00 -> 23:00', value: '22:00 -> 23:00' },
            { label: '23:00 -> 00:00', value: '23:00 -> 00:00' },
        ]
    };
    constructor(props){
        super(props);
        const {state} = props.navigation;
        let latitude = this.props.navigation.getParam('latitude');
        let longitude = this.props.navigation.getParam('longitude');
        this.stadiumName = state.params.stadiumName;
        this.city = state.params.city;
        this.stadiumAddress= state.params.stadiumAddress;
        this.IdResponsible=state.params.IdResponsible;
        this.IdStaduim=state.params.IdStaduim;
        console.log(this.stadiumName,this.city,this.stadiumAddress,this.IdResponsible,this.IdStaduim,'-------');
            Geocoder.init("AIzaSyCoIzI4JvkT0MjvaBXH-OSt6d6pYuU1dMg");
            Geocoder.from(latitude, longitude).then(json => {
                this.state.street_number = json.results[0].address_components[0].long_name;
                this.state.route = json.results[0].address_components[1].long_name;
                this.state.subLocality = json.results[0].address_components[2].long_name;
                this.state.locality = json.results[0].address_components[3].long_name;
                this.setState({fullAddress: this.state.street_number+", "+this.state.route+", "+this.state.subLocality+", "+this.state.locality});
            });
    }
    onSelectDay(value) {
        this.setState({day: value});
    }
    onSelectHour(value) {
        this.setState({hour: value});
    }
    onSelectPayment(value) {
        this.setState({payment: value});
    }
    onSubscriptionName(value) {
        this.setState({subscriptionName: value});
    }
    componentDidMount() {
        setInterval(function () {
            Set();
        },500);
        const Set=()=>this.setState({isLoading: false});
    }

    addSubscription=(Sent=()=>this.props.navigation.navigate('RequestSentSubscription'))=>{
        if (this.state.subscriptionName === "" || this.state.day === null || this.state.hour === null || this.state.payment === "")
        {
            Alert.alert('Error!!', 'Please enter all information')
        }else{
            this.setState({isLoading: true});
            setTimeout(function () {
                AddSub();
            },1000);
            const AddSub=()=>{
                db.ref('/subscription').push({
                    uid: auth.currentUser.uid,
                    stadiumName: this.stadiumName,
                    city : this.city,
                    stadiumAddress: this.stadiumAddress,
                    IdResponsible: this.IdResponsible,
                    IdStaduim: this.IdStaduim,
                    payment:this.state.payment,
                    Hour:this.state.hour,
                    subscriptionName:this.state.subscriptionName,
                    Day:this.state.day,
                    Status:'Pending',
                    Message: '',
                }, function (error) {
                    if (error) {
                        Alert.alert('Error', error)
                    } else {
                        console.log('success');
                        Sent();
                    }
                });
                set();
            };
          const set=()=> this.setState({day: "", hour: "", payment: "", subscriptionName: "", isLoading: false});
        }
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator size={50} shouldRasterizeIOS={true}/>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <View style={styles.allContent}>
                    <TextInput
                        style={styles.inputSubscriptionName}
                        maxLength={22}
                        placeholder="Subscription name"
                        underlineColorAndroid = "transparent"
                        placeholderTextColor = "#a9a9a1"
                        autoCapitalize = "none"
                        onChangeText={(value) => { this.onSubscriptionName(value)}}
                    />
                    <RNPickerSelect
                        onValueChange={(value) => this.onSelectDay(value)}
                        items={[
                            { label: 'Lundi', value: 'Lundi' },
                            { label: 'Mardi', value: 'Mardi' },
                            { label: 'Mercredi', value: 'Mercredi' },
                            { label: 'Jeudi', value: 'Jeudi' },
                            { label: 'Vendredi', value: 'Vendredi' },
                            { label: 'Samedi', value: 'Samedi' },
                            { label: 'Dimanche', value: 'Dimanche' },
                        ]}
                        placeholder={{label: 'Select a day', value: null}}
                        style={{color: 'red'}}
                    />
                    <RNPickerSelect
                        onValueChange={(value) => this.onSelectHour(value)}
                        items={this.state.hoursData}
                        placeholder={{label: 'Select an hour', value: null}}

                    />
                    <RNPickerSelect
                        onValueChange={(value) => this.onSelectPayment(value)}
                        items={[
                            { label: 'Weekly', value: 'Weekly' },
                            { label: 'Monthly', value: 'Monthly' },
                        ]}
                        placeholder={{label: 'Select payment type', value: null}}

                    />
                    <View style={styles.cardStyle}>
                        <View>
                            <Text style={styles.subscriptionName}><Icon name="vinyl" size={22} color="#5780D9" /> {this.state.subscriptionName}</Text>
                            <View style={styles.infos}>
                                <Text>Address : <Text style={{color: '#9b9b9b'}}>{this.state.fullAddress}</Text></Text>
                                <Text>Day : <Text style={{color: '#9b9b9b'}}>{this.state.day}</Text></Text>
                                <Text>Hour : <Text style={{color: '#9b9b9b'}}>{this.state.hour}</Text></Text>
                                <Text>Payment : <Text style={{color: '#9b9b9b'}}>{this.state.payment}</Text></Text>
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.nextButton} onPress={() => this.addSubscription()}>
                    <Text style={styles.nextButtonText}>Send request</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        alignItems: 'center',
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
    },
    cardStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#dcdcdc',
        height: 150,
        width: "95%",
        alignSelf: 'center',
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
        marginLeft: 25,
        marginTop: 8,
    },
    inputSubscriptionName: {
        height: 40,
        borderColor: '#a9a9a1',
        borderWidth: 1,
        width: "100%",
        alignSelf: 'center',
        textAlign: 'center'
    },
    allContent: {
        marginTop: 20,
        width: '100%'
    }

});
