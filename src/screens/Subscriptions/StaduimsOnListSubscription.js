import React from 'react';
import {Alert, Image, KeyboardAvoidingView, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {auth, db, storage} from '../../services/FireBaseConfig';
import StarRating from "react-native-star-rating";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import Autocomplete from "react-native-autocomplete-input";



export default class StaduimOnListSub extends React.Component{
    constructor(props) {
        super(props);
        const {state} = props.navigation;
        this.UserLocation = state.params.UserLocation.latitude+","+state.params.UserLocation.longitude;
        this.state = {
            stadiums: [],
            isLoading: true,
            starCount: 5,
            starField: 3.5,
            refreshing: false,
            cities: [],
            query: '',
            city: '',
        };


    }

    // getDistance=(NearbyStaduims, KeyData)=>{
    //
    //     fetch('https://maps.googleapis.com/maps/api/distancematrix/json?origins='+this.UserLocation+'&destinations='+NearbyStaduims+'&key=AIzaSyCoIzI4JvkT0MjvaBXH-OSt6d6pYuU1dMg')
    //         .then((response) => response.json())
    //         .then((data)=>{
    //
    //             for (const Stads of data.rows){
    //                 for (const DataS of Stads.elements){
    //                     this.setState({distance:DataS.distance,duration:DataS.duration});
    //                     //this.state.distance=DataS.distance.text;
    //                     //console.log(KeyData);
    //
    //
    //                 }
    //             }
    //         });
    //
    //
    // };

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

    componentDidMount() {
        // const { navigation } = this.props;
        // this.focusListener = navigation.addListener('didFocus', () => {
        //     this.setState({ stadiums: [],isLoading: true });
        //     this.getStadiums();
        // });

        this.getStadiums();
        this.getCities();
        //this.Data();
    }
    // componentWillUnmount() {
    //     this.focusListener.remove();
    // }
    onRefresh() {

        this.setState({ stadiums: [], refreshing:true});
        this.getStadiums();
        setTimeout(function () {
            refreshing();
        },100);
        const refreshing=()=>{
            this.state.refreshing= false;
        }
    }
    CardList = ({stadiums: {stadiums: images,latitude,longitude, responsibleName, stadiumName, stadiumAddress, phoneNumber,city, status, payment,uid}, IdStaduim}) => {
        return(

            <View style={styles.cardStyle}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('ChooseTime', {
                    stadiumName:stadiumName,
                    stadiumAddress:stadiumAddress,
                    city:city,
                    IdResponsible:uid,
                    IdStaduim:IdStaduim,
                    latitude:latitude,
                    longitude:longitude,
                })}>

                <View>
                    <Text style={styles.name}><MaterialCommunityIcons name='soccer-field' size={20} style={{marginTop:5}} color="#9b9b9b"/>  {stadiumName}</Text>
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
                        <Text>Address : <Text style={{color: '#9b9b9b'}}>{stadiumAddress}</Text></Text>
                        <Text>Phone number : <Text style={{color: '#9b9b9b'}}>{phoneNumber}</Text></Text>
                        <Text>Payment : <Text style={{color: '#9b9b9b'}}>{payment}</Text></Text>
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
                </View>
                </TouchableOpacity>
            </View>
        )
    };
    Data=()=>{
        setTimeout(function () {
            chane();
        },2000);
        const chane=()=>{
            let myData = Object.keys(this.state.stadiums)
                .map(key => {
                    return {...this.state.stadiums[key] , name:key};
                });
            console.log(myData[2].name);
        };

    };
    //SetDistance=(NearbyStaduims,KeyData)=>this.getDistance(NearbyStaduims,KeyData),
    getStadiums =(City,Data,Change=()=>{this.setState({stadiums: Data, isLoading:false})},

    )=>{
        console.log(City);
        if (City === undefined){
            this.setState({isLoading:true});
            console.log('No city');
            setTimeout(function(){
                let ref = db.ref("/stadiums");
                let query = ref.orderByKey();
                query.once("value", function (snapshot) {
                    snapshot.forEach(function (child) {
                        Data = snapshot.val();
                        // coords = child.val().latitude + "," + child.val().longitude;
                        // KeyData= child.key;
                        Change();
                    });
                }).then( r =>console.log('success'));
            }, 200);
        }else{
            this.setState({isLoading:true});
            //City= this.state.city;
            let cityChosen = City.city;
            console.log(City.city);
            setTimeout(function(){
                let ref = db.ref("/stadiums");
                let query = ref.orderByChild("city").equalTo(cityChosen);
                query.once("value", function (snapshot) {
                    snapshot.forEach(function (child) {
                        Data = snapshot.val();
                        // coords = child.val().latitude + "," + child.val().longitude;
                        // KeyData= child.key;
                        Change();
                    });
                }).then( r =>console.log('success'));
            }, 200);
        }
    };
    CityChoose=(city)=>{
        this.setState({city:city, query: ''});
        this.getStadiums({city});
    };
    findCity(query) {
        if (query === '') {
            return [];
        }

        const { cities } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return cities.filter(city => city.City.search(regex) >= 0);
    };
    render() {
        const { query } = this.state;
        const cities = this.findCity(query);
        let stadiumsKeys = Object.keys(this.state.stadiums);
        return (
            <View style={styles.container}>
                <ScrollView refreshControl={
                    <RefreshControl

                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                }>
                    <View>
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
                            <TouchableOpacity onPress={(data) => {data=item.City; this.CityChoose(data)}}>
                                <Text style={styles.itemText}>
                                    {item.City}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                    </View>
                    <View>
                    {
                        this.state.isLoading ? <View style={styles.isLoading}><Image source={require('../../../assets/Images/spinner.gif')}/></View>
                            :
                            stadiumsKeys.length > 0
                                ? stadiumsKeys.map(key => {
                                    return (
                                        <View style={styles.cardList} key={key}>
                                            <this.CardList
                                                stadiums={this.state.stadiums[key]}
                                                IdStaduim={key}
                                            />
                                        </View>
                                    )
                                })
                                :
                                stadiumsKeys.length > 0
                                    ? <View style={styles.noStadiums}><Text>Your City Have No Staduims</Text></View>
                                    : <View/>
                    }
                    </View>
                </ScrollView>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        //justifyContent: 'center',
        backgroundColor: '#fff',
    },
    cardList: {
        width: '95%',
        alignSelf: 'center',
    },
    autocompleteContainer: {
        zIndex:999
    },
    cardStyle: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#dcdcdc',
        height: 180,
        width: "100%",
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 30/2,
    },
    name: {
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
    bottomView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        width: '95%',
        alignSelf: 'center'
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
    noStadiums : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    isLoading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    feedbacksNumber: {
        color: 'rgba(32,5,13,0.96)',
        fontSize: 12,
    },
    feedbacksView: {
        flexDirection: 'row',
    },
    starsView: {
        width: 80,
        marginLeft: 15,
        marginRight: 10,
    },
});
