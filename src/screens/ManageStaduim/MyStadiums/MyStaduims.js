import React from 'react';
import {Alert, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {auth, db, storage} from './../../../services/FireBaseConfig';
import {strings} from "../../../translations/translate";


export default class MyStaduims extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            stadiums: [],
            isLoading: true,
        };
    }

    getStadiums=  (Data,Change=()=>{this.setState({stadiums: Data, isLoading:false})})=> {
    setTimeout(function(){
    if (auth.currentUser === null){
        console.log(auth.currentUser);
    }else {
        let ref = db.ref("/stadiums");
        let query = ref.orderByChild("uid").equalTo(auth.currentUser.uid);
        query.once("value", function (snapshot) {
            snapshot.forEach(function (child) {
                Data = snapshot.val();
                Change();
            });
        });
    }
    }, 1000);
};

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            this.setState({ isLoading: true, stadiums: [] });
            this.getStadiums();
        });
        this.getStadiums();
    }
    componentWillUnmount() {
        this.focusListener.remove();
    }
    CardList = ({stadiums: {stadiums: images, responsibleName, stadiumName, stadiumAddress, phoneNumber, status, payment}, id}) => {
        return(
            <View style={styles.cardStyle}>
                <View>
                    <Text style={styles.name}><Icon name="vinyl" size={22} color="#5780D9" /> {stadiumName}</Text>
                    <View style={styles.infos}>
                        <Text>{strings('myStadiums.responsible')}<Text style={{color: '#9b9b9b'}}>{responsibleName}</Text></Text>
                        <Text>{strings('myStadiums.address')}<Text style={{color: '#9b9b9b'}}>{stadiumAddress}</Text></Text>
                        <Text>{strings('myStadiums.phoneNumber')}<Text style={{color: '#9b9b9b'}}>{phoneNumber}</Text></Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '80%'}}>
                            <Text>{strings('myStadiums.payment')}<Text style={{color: '#9b9b9b'}}>{payment}</Text></Text>
                            <Text style={{fontWeight: 'bold'}}>{strings('myStadiums.status')}
                                {
                                    status === "Accepted"
                                        ? <Text style={{color: 'green'}}>
                                            {status}
                                        </Text>
                                        : status === "On pending"
                                        ? <Text style={{color: '#FFAF50'}}>
                                            {status}
                                        </Text>
                                        : <Text style={{color: 'red'}}>
                                            {status}
                                        </Text>
                                }
                            </Text>
                        </View>
                    </View>
                </View>
                {
                    status === "Accepted" ?
                        <View style={styles.bottomView}>
                            <TouchableOpacity style={styles.buttons} onPress={() => this.props.navigation.navigate('stadiumProgram', {data1: stadiumName, data2: id})}>
                                <Text style={styles.buttonsText}>{strings('myStadiums.add')}</Text>
                            </TouchableOpacity >
                            <TouchableOpacity style={styles.buttons} onPress={() => this.props.navigation.navigate('reserveToSomeone', {data1: stadiumName, data2: id})}>
                                <Text style={styles.buttonsText}>{strings('myStadiums.reserve')}</Text>
                            </TouchableOpacity >
                        </View> :
                        <View></View>
                }
            </View>
        )
    };
    render() {
        let stadiumsKeys = Object.keys(this.state.stadiums);
        return (
            <View style={styles.container}>
                <ScrollView>
                    {
                        this.state.isLoading ? <View style={styles.isLoading}><Image source={require('../../../../assets/Images/spinner.gif')}/></View>
                            :
                            stadiumsKeys.length > 0
                                ? stadiumsKeys.map(key => {
                                    return (
                                        <View style={styles.cardList} key={key}>
                                            <this.CardList
                                                stadiums={this.state.stadiums[key]}
                                                id={key}
                                            />
                                        </View>
                                    )
                                })
                                :
                                <View style={styles.noStadiums}><Text>{strings('myStadiums.empty')}</Text></View>
                    }
                    <TouchableOpacity style={styles.addNewStadiumButton} onPress={() => this.props.navigation.navigate('addNewStadium')}>
                        <Text style={styles.addNewStadiumButtonText}>{strings('myStadiums.addNewStadium')}</Text>
                    </TouchableOpacity >
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
    }
});
