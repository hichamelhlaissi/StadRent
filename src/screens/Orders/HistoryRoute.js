import React, {Component} from 'react';
import {
    Alert,
    Button,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ModalWrapper from "react-native-modal-wrapper";
import {APPROX_STATUSBAR_HEIGHT} from "react-native-paper/src/constants";
import {auth, db} from "../../services/FireBaseConfig";
import ShowOnMap from "./ShowOnMap";
import {FontAwesome, Entypo, MaterialIcons} from '@expo/vector-icons';
import RequestRoute, {IsOrderValid, IsOrderDone} from "./RequestRoute";




export default class ScheduledRoute extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalVisible: false,
            modalShowOnMap:false,
            modalVisibleReport: false,
            isLoading: true,
            messageCancellation: "",
            refreshing: false,
            Orders:[],
            Favorite:[],
            Sender:'',
            Cancel:'',
            Check:false,
            messageReport:'',
            dataReport:{},
        };
    };


    componentDidMount() {
        // this.getFavorite();
        IsOrderDone();
        IsOrderValid();
        this.getScheduledOrders();
    }

    cancelOrder(message, Change=()=>this.setState({isLoading: false, Orders:[]})) {
        if (message.length > 0){
            this.setState({isLoading: true});
            let IdOrder =this.state.Cancel;
            console.log(IdOrder);
            setTimeout(function () {
                db.ref("/orders/"+IdOrder).update({
                    Status: 'Canceled',
                    Canceled: message,
                }, function (error) {
                    if (error) {
                        Alert.alert('Error', error)
                    } else {
                        console.log('success');
                    }
                }).then(r =>Change());

            },200);

            this.getScheduledOrders();

            Alert.alert('Message cancellation sent successfully!!','Your cancellation message is: '+message);
        }else {
            Alert.alert('Erreur!!','Your cancellation message is empty');
        }
    }
    onRefresh() {

        this.setState({ Orders: [], refreshing:true});
        this.getScheduledOrders();
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
    CloseModalReport =()=>{
        this.setModalVisibleReport(false);
    };
    setModalVisibleReport(visible) {
        this.setState({modalVisibleReport: visible});
    };
    CloseModalShowOnMap =()=>{
        this.modalShowOnMap(false);
    };
    modalShowOnMap(visible){
        this.setState({modalShowOnMap: visible});
    };
    addToFavorite=(IdStaduim, stadiumName, IdResponsible, Data, check = false)=>{
        let UserC = auth.currentUser.uid;
        let ref = db.ref("/favoriteStaduim");
        let query = ref.orderByChild("uid").equalTo(UserC);
        query.once("value", function (snapshot) {
            if (snapshot.val() === null){
                db.ref('/favoriteStaduim').push({
                    uid: auth.currentUser.uid,
                    IdResponsible: IdResponsible,
                    IdStaduim: IdStaduim,
                    stadiumName : stadiumName,
                    Deleted:'false',
                }, function (error) {
                    if (error) {
                        Alert.alert('Error!!', error);
                    } else {
                        console.log('success');
                    }
                });
            }
            Data=snapshot.val();
            let Keys = Object.keys(Data);
            Keys.map((key)=>{
                let Test = Data[key];

                console.log('-----',Test.IdStaduim);
                for (let i = 0; i < Keys.length; i++){
                    if (Test.IdStaduim === IdStaduim){
                        check= true;

                    }
                }
            });
        }).then( r =>{
            if (check){
                return Alert.alert('Error!!', 'Already Exist');
            }
            if (!check){
                db.ref('/favoriteStaduim').push({
                    uid: auth.currentUser.uid,
                    IdResponsible: IdResponsible,
                    IdStaduim: IdStaduim,
                    stadiumName : stadiumName,
                    Deleted:'false',
                }, function (error) {
                    if (error) {
                        Alert.alert('Error!!', error);
                    } else {
                        console.log('success');
                    }
                });
            }
        });

        this.onRefresh();
    };

    CardList = ({Orders: {uid,StartHour, EndHour, Day, stadiumName,stadiumAddress,city,IdStaduim, Status, IdResponsible, Canceled}, IdOrders}) => {

        if (Status === "Delivered" || Status === "Canceled") {
            return (
                <View style={styles.cardStyle}>
                    <Modal animationType="slide"
                           transparent={false}
                           visible={this.state.modalShowOnMap}>
                        <ShowOnMap CloseModal={this.CloseModalShowOnMap} IdStaduimm={this.state.Sender}/>
                    </Modal>
                    <View style={styles.infos}>
                        <Text style={styles.stadiumName}>{stadiumName}</Text>
                        <Text style={styles.matchDate}><Icon name="calendar-alt" size={18} color="#fff"/> {Day}</Text>
                        <Text style={styles.matchTime}><Icon name="clock" size={18}
                                                             color="#fff"/> {StartHour} -> {EndHour}</Text>
                        <Text style={styles.checkLocation}><Icon name="map-marker-alt" size={18} color="#fff"/> {city}
                        </Text>
                        <Text style={styles.checkLocation}><Entypo name="new-message" size={18} color="yellow"/> {Canceled}
                        </Text>
                    </View>
                    <View style={styles.buttonsView}>
                        <TouchableOpacity style={styles.buttons} onPress={() => {
                            this.modalShowOnMap(true);
                            this.setState({Sender: IdStaduim})
                        }}>
                            <Text style={styles.buttonsText}><Icon name="map-marker-alt" size={15}
                                                                   color="#EAE114"/> Show on map</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.buttons, {marginTop: 12}]}
                                          onPress={() => this.addToFavorite(IdStaduim, stadiumName, IdResponsible)}>
                            <Text
                                style={styles.buttonsText}> Add to favorite</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.buttons, {marginTop: 12}]} onPress={() => {
                            {this.setModalVisibleReport(true);
                                this.setState({dataReport: {IdOrders, uid, IdResponsible, IdStaduim}})

                            }
                        }}>
                            <Text style={styles.buttonsText}><MaterialIcons name="report" size={20} color="black"/> Report</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        return <View style={styles.noOrders}/>;
    };
    getScheduledOrders=(Data, Change=()=>{this.setState({Orders: Data})}, Set=()=>this.setState({isLoading:false}))=>{
        setTimeout(function () {
            let UserC = auth.currentUser.uid;
            let ref = db.ref("/orders");
            let query = ref.orderByChild("uid").equalTo(UserC);
            query.once("value", function (snapshot) {
                snapshot.forEach(function (child) {
                    Data = snapshot.val();
                    Change();
                });
            }).then( r =>Set());
        },200);

    };
    onReport=(message, Change=()=>this.setState({ Orders:[]}))=>{
        if (message.length > 0){
            this.setState({isLoading: true});
            let Report = this.state.dataReport;
            console.log(Report);
            setTimeout(function () {
                db.ref('/userReports').push({
                    uid: Report.uid,
                    IdResponsible: Report.IdResponsible,
                    IdStaduim: Report.IdStaduim,
                    IdOrders : Report.IdOrders,
                    messageReport: message,
                }, function (error) {
                    if (error) {
                        Alert.alert('Error', error)
                    } else {
                        console.log('success');
                    }
                    Change();
                }).then(r =>set());
            },1000);
            const set=()=> {this.getScheduledOrders(); this.setState({messageReport:{}})};
        }else {
            Alert.alert('Error!!','Your report message is empty');
        }

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
                        this.state.isLoading ? <View style={styles.isLoading}><Image source={require('../../../assets/Images/spinner.gif')}/></View>
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

                    <ModalWrapper
                        animationType="slide"
                        style={{ width: 280, height: 400, paddingLeft: 24, paddingRight: 24 }}
                        transparent={false}
                        visible={this.state.modalVisibleReport}
                    >
                        <View style={{marginTop: 22}}>
                            <View>
                                <View style={styles.textAreaContainer} >
                                    <TextInput
                                        style={styles.textArea}
                                        underlineColorAndroid="transparent"
                                        placeholder="Enter your report reason"
                                        placeholderTextColor="grey"
                                        numberOfLines={10}
                                        multiline={true}
                                        value={this.state.messageReport}
                                        onChangeText={e => {
                                            this.setState({
                                                messageReport: e,
                                            });
                                        }}
                                    />
                                </View>
                                <View style={styles.cancelButtons}>

                                    <Button title="CANCEL" type="regular" onPress={() => {this.setModalVisibleReport(!this.state.modalVisibleReport);}} />
                                    <Button title="SEND" type="primary" onPress={() => {this.setModalVisibleReport(!this.state.modalVisibleReport);this.onReport(this.state.messageReport)}} />
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
