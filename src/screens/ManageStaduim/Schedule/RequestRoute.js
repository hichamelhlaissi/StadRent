import React, {Component} from 'react';
import {Alert, Button, Image, Modal, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ModalWrapper from "react-native-modal-wrapper";
import {APPROX_STATUSBAR_HEIGHT} from "react-native-paper/src/constants";
import {auth, db} from "../../../services/FireBaseConfig";
import {FontAwesome, MaterialIcons} from '@expo/vector-icons';
import {IsOrderDone, IsOrderValid} from "../../Orders/RequestRoute";

export const SendNotification= async (message)=> {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
};

export const GetDataNotification = (IdOrders)=>{
    db.ref("/orders").orderByKey().equalTo(IdOrders).once("value", function (snapshot) {
        snapshot.forEach(function (child) {
            let Data = child.val();
            db.ref("/users").orderByChild("uid").equalTo(Data.uid).once("value", function (snapshot) {
                snapshot.forEach(function (child) {
                    let UserData = child.val();
                    const message = {
                        to: UserData.notificationToken,
                        sound: 'default',
                        title: 'Your order ' + Data.Status,
                        body: Data.Canceled,
                        //data: { data: 'goes here' },
                        _displayInForeground: true,
                    };
                    SendNotification(message).then(r => console.log('notificationSent'));
                })

            })
        });
    })
};

export default class RequestRoute extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalVisible: false,
            modalShowOnMap:false,
            isLoading: true,
            messageCancellation: "",
            refreshing: false,
            Orders:[],
            Favorite:[],
            Sender:'',
            Cancel:'',
            Check:false,
            Program2: [],
            Array:[]
        };
    };


    componentDidMount() {
        // this.getFavorite();
        IsOrderDone();
        IsOrderValid();
        this.getRequestOrders();
    }

    cancelOrder(message, Change=()=>this.setState({isLoading: false, Orders:[]})) {
        if (message.length > 0){
            this.setState({isLoading: true});
            let IdOrder =this.state.Cancel;
            setTimeout(function () {
                db.ref("/orders/"+IdOrder).update({
                    Status: 'Canceled',
                    Canceled: 'Owner :'+message,
                }, function (error) {
                    if (error) {
                        Alert.alert('Error', error)
                    } else {
                        console.log('success');
                        GetDataNotification(IdOrder);
                    }
                }).then(r =>Change());

            },200);

            this.getRequestOrders();

            Alert.alert('Message cancellation sent successfully!!','Your cancellation message is: '+message);
        }else {
            Alert.alert('Erreur!!','Your cancellation message is empty');
        }
    }
    onRefresh() {

        this.setState({ Orders: [], refreshing:true});
        this.getRequestOrders();
        setTimeout(function () {
            refreshing();
        },100);
        const refreshing=()=>{
            this.state.refreshing= false;
        }
    }
    CloseModal =()=>{
        this.setModalVisible(false);
    };
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    };

    AcceptOrder=(IdStaduim, idProgram, Day, IdOrders, programs, Change=()=>this.setState({ Orders:[]}))=>{

        let ref = db.ref('/stadiums/'+IdStaduim+'/programs/'+Day+'/program');
        let query = ref.orderByKey();
        query.once("value", function (snapshot) {
            let Data =snapshot.val();
            if (Data){
                Data[idProgram].reserved = !Data[idProgram].reserved;
                let programsRef = db.ref('/stadiums/'+IdStaduim+'/programs/'+Day);
                programsRef.set({
                    program: Data,
                });
            }else

                {
                let ProgramV2 = [
                    { id: 0, StartHour: '09', EndHour: '10', rentDate: Day, reserved: false},
                    { id: 1, StartHour: '10', EndHour: '11', rentDate: Day, reserved: false },
                    { id: 2, StartHour: '11', EndHour: '12', rentDate: Day, reserved: false },
                    { id: 3, StartHour: '12', EndHour: '13', rentDate: Day, reserved: false },
                    { id: 4, StartHour: '13', EndHour: '14', rentDate: Day, reserved: false },
                    { id: 5, StartHour: '14', EndHour: '15', rentDate: Day, reserved: false },
                    { id: 6, StartHour: '15', EndHour: '16', rentDate: Day, reserved: false },
                    { id: 7, StartHour: '16', EndHour: '17', rentDate: Day, reserved: false },
                    { id: 8, StartHour: '17', EndHour: '18', rentDate: Day, reserved: false },
                    { id: 9, StartHour: '18', EndHour: '19', rentDate: Day, reserved: false },
                    { id: 10, StartHour: '19', EndHour: '20', rentDate: Day, reserved: false },
                    { id: 11, StartHour: '20', EndHour: '21', rentDate: Day, reserved: false },
                    { id: 12, StartHour: '21', EndHour: '22', rentDate: Day, reserved: false },
                    { id: 13, StartHour: '22', EndHour: '23', rentDate: Day, reserved: false },
                    { id: 14, StartHour: '23', EndHour: '00', rentDate: Day, reserved: false },
                ];
                ProgramV2[idProgram].reserved = !ProgramV2[idProgram].reserved;
                var programsRef = db.ref('/stadiums/'+IdStaduim+'/programs/'+Day);
                programsRef.set({
                    program: ProgramV2,
                });
            }
        }, function (error) {
            console.log(error);
        });


        this.setState({isLoading: true});
        setTimeout(function () {
            db.ref("/orders/"+IdOrders).update({
                Status: 'Accepted',
            }, function (error) {
                if (error) {
                    Alert.alert('Error', error)
                } else {
                    console.log('success');
                    GetDataNotification(IdOrders);
                }
                Change()
            }).then(r => {
                set();
            });
        },1000);

      const set=()=> this.getRequestOrders();

    };

    CardList = ({Orders: {uid,StartHour, EndHour, idProgram, Day, stadiumName,stadiumAddress,city,IdStaduim, Status, IdResponsible}, IdOrders}) => {

        if (Status === "Pending") {
            return (
                <View style={styles.cardStyle}>
                    <View style={styles.infos}>
                        <Text style={styles.stadiumName}>{stadiumName}</Text>
                        <Text style={styles.matchDate}><Icon name="calendar-alt" size={18} color="#fff"/> {Day}</Text>
                        <Text style={styles.matchTime}><Icon name="clock" size={18}
                                                             color="#fff"/> {StartHour} -> {EndHour}</Text>
                        <Text style={styles.checkLocation}><Icon name="map-marker-alt" size={18} color="#fff"/> {city}
                        </Text>
                        <Text style={styles.checkLocation}><FontAwesome name="circle" size={15} color="green"/> {Status}
                        </Text>
                    </View>
                    <View style={styles.buttonsView}>
                        <TouchableOpacity style={styles.buttons} onPress={() => {
                            this.AcceptOrder(IdStaduim, idProgram, Day, IdOrders)
                        }}>
                            <Text style={styles.buttonsText}><Icon name="map-marker-alt" size={15}
                                                                   color="#EAE114"/> Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.buttons, {marginTop: 12}]} onPress={() => {
                            this.setModalVisible(true);
                            this.setState({Cancel: IdOrders})
                        }}>
                            <Text style={styles.buttonsText}><MaterialIcons name="cancel" size={20} color="black"/> Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        return <View style={styles.noOrders}/>;
    };
    getRequestOrders=(Data, Change=()=>{this.setState({Orders: Data})}, Set=()=>this.setState({isLoading:false}))=>{
        setTimeout(function () {
            let UserC = auth.currentUser.uid;
            let ref = db.ref("/orders");
            let query = ref.orderByChild("IdResponsible").equalTo(UserC);
            query.once("value", function (snapshot) {
                snapshot.forEach(function (child) {
                    Data = snapshot.val();
                    Change();
                });
            }).then( r =>Set());
        },200);

    };
    render() {
        let OrdersKeys = Object.keys(this.state.Orders);
        return (
            <View style={styles.container}>
                <ScrollView refreshControl={
                    <RefreshControl

                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                }>
                    {
                        this.state.isLoading ? <View style={styles.isLoading}><Image source={require('../../../../assets/Images/spinner.gif')}/></View>
                            :
                            OrdersKeys.length > 0
                                ? OrdersKeys.map((key) => {
                                    return (
                                        <View style={styles.cardList} key={key}>
                                            <this.CardList
                                                Orders={this.state.Orders[key]}
                                                IdOrders={key}
                                            />
                                        </View>
                                    )
                                })
                                : <View style={styles.noOrders}><Text>Request orders is empty</Text></View>
                    }
                    <ModalWrapper
                        animationType="slide"
                        style={{ width: 280, height: 400, paddingLeft: 24, paddingRight: 24 }}
                        transparent={false}
                        visible={this.state.modalVisible}
                    >
                        <View style={{marginTop: 22}}>
                            <View>
                                <View style={styles.textAreaContainer} >
                                    <TextInput
                                        style={styles.textArea}
                                        underlineColorAndroid="transparent"
                                        placeholder="Enter your cancellation reason"
                                        placeholderTextColor="grey"
                                        numberOfLines={10}
                                        multiline={true}
                                        value={this.state.messageCancellation}
                                        onChangeText={e => {
                                            this.setState({
                                                messageCancellation: e,
                                            });
                                        }}
                                    />
                                </View>
                                <View style={styles.cancelButtons}>

                                    <Button title="CANCEL" type="regular" onPress={() => {this.setModalVisible(!this.state.modalVisible);}} />
                                    <Button title="SEND" type="primary" onPress={() => {this.setModalVisible(!this.state.modalVisible);this.cancelOrder(this.state.messageCancellation)}} />
                                </View>
                            </View>
                        </View>
                    </ModalWrapper>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    noOrders : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    isLoading : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infos: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 15,
        height: 100,
    },
    tabBar: {
        marginTop: APPROX_STATUSBAR_HEIGHT,
        backgroundColor: '#5780D9',
    },
    cardStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#5780D9',
        height: 150,
        width: 370,
        marginTop: 10,
        borderRadius: 30/2,
    },
    stadiumName: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
        marginLeft: 15
    },
    matchDate: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 15
    },
    matchTime: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 15,
    },
    checkLocation: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 15,
    },
    buttonsView: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: 10,
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
    textAreaContainer: {
        borderColor: "#333333",
        borderWidth: 1,
        padding: 5
    },
    textArea: {
        height: 150,
        justifyContent: "flex-start"
    },
    cancelButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    }
});
