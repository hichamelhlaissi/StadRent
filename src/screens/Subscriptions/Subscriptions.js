import React from 'react';
import {
    ActivityIndicator,
    Alert,
    AppState,
    Button, Image, RefreshControl,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import SubscriptionsStack from '../../routes/SubscriptionsStack'
import {auth, db} from "../../services/FireBaseConfig";
import Constants from "expo-constants";
import * as Location from "expo-location";
import ModalWrapper from "react-native-modal-wrapper";

export default class Subscriptions extends React.Component {


    constructor(props){
        super(props);
        const {state} = props.navigation;
        this.state = {
            isLoading:true,
            Data:[],
            refreshing:false,
            Cancel:'',
            messageCancellation:'',
            modalVisible:false,
        };
    }
    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            this.setState({ Data:[],isLoading: true });
            this.getSubscription();
        });
        setTimeout(function () {
            GetData();
        },500);
        const GetData=()=>this.getSubscription();
    }
    onRefresh=()=> {

        this.setState({ Data: [], refreshing:true});
        this.getSubscription();
        setTimeout(function () {
            refreshing();
        },1000);
        const refreshing=()=>{
            this.setState({refreshing: false})
        }
    };
    getSubscription=(Data,Change=()=> this.setState({Data:Data}))=>{
        let userCon = auth.currentUser.uid;
        let ref = db.ref("/subscription");
        let query = ref.orderByChild("uid").equalTo(userCon);
        query.once("value", function (snapshot) {
            snapshot.forEach(function (child) {
                Data = snapshot.val();
                Change();
            });

        }, function (error) {
            if (error) {
                Alert.alert('Error!!', error.message)
            } else {
                console.log('success');
            }
        }).then(r => console.log('success'));
        this.setState({isLoading:false})
    };
    CloseModal =()=>{
        this.setModalVisible(false);
    };
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    };
    cancelSubscription=(message, Change=()=>this.setState({isLoading: false, Data:[]}))=>{
        let Status =this.state.Cancel.Status;
        if (message.length > 0 && Status !== "Canceled"){
            this.setState({isLoading: true});
            let IdSubscription =this.state.Cancel.IdSubscription;
            setTimeout(function () {
                db.ref("/subscription/"+IdSubscription).update({
                    Status: 'Canceled',
                    Message: '(Decision By User) '+message,
                }, function (error) {
                    if (error) {
                        Alert.alert('Error', error)
                    } else {
                        console.log('success');
                    }
                }).then(r =>{Change(); fresh()});

            },1000);

          const fresh=()=> this.getSubscription();
        }else {
            if (message.length < 0){
                Alert.alert('Error!!','Your cancellation message is empty');
            }
            if (Status === "Canceled"){
                Alert.alert('Error!!','Your subscription already Canceled');
            }
        }
    };
    SubscriptionList=({Subscriptions: {uid, Hour, Day, stadiumName,stadiumAddress,payment,Message,city,IdStaduim, Status,subscriptionName, IdResponsible}, IdSubscription})=>{
        return (
            <View style={styles.cardStyle}>
                <ScrollView>
                <View>
                    <Text style={styles.subscriptionName}><Icon name="vinyl" size={22} color="#5780D9" /> {subscriptionName}</Text>
                    <View style={styles.infos}>
                        <Text>Address : <Text style={{color: '#9b9b9b'}}>{stadiumAddress}</Text></Text>
                        <Text>Staduim Name : <Text style={{color: '#9b9b9b'}}>{stadiumName}</Text></Text>
                        <Text>Time : <Text style={{color: '#9b9b9b'}}>{Day} ({Hour})</Text></Text>
                        <Text>Payment : <Text style={{color: '#9b9b9b'}}>{payment}</Text></Text>
                        <Text>Status : <Text style={{color: 'green'}}>{Status}</Text><Text>  Message :</Text><Text> {Message}</Text></Text>
                    </View>
                    <View style={styles.buttonsView}>
                        <TouchableOpacity style={styles.buttons} onPress={() => Alert.alert('Action!','Edit')}>
                            <Text style={styles.buttonsText}>Edit</Text>
                        </TouchableOpacity >
                        <TouchableOpacity style={[ styles.buttons, { marginTop: 12 } ]} onPress={() => {
                            this.setModalVisible(true);
                            this.setState({Cancel: {IdSubscription, Status}})
                        }}>
                            <Text style={styles.buttonsText}>Cancel</Text>
                        </TouchableOpacity >
                    </View>
                </View>
                </ScrollView>
            </View>
        )
    };
    render() {
        let keys = Object.keys(this.state.Data);


        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.newSubscriptionButton} onPress={() => this.props.navigation.navigate('ChooseStadium')}>
                    <Text style={styles.newSubscriptionButtonText}>Add new subscription</Text>
                </TouchableOpacity >
                <ScrollView refreshControl={
                    <RefreshControl

                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                }
                >
                {
                    this.state.isLoading ? <View style={styles.isLoading}><Image source={require('../../../assets/Images/spinner.gif')}/></View>
                        :
                        keys.length > 0
                            ? keys.map((key) => {
                                return (
                                    <View style={styles.cardList} key={key}>
                                        <this.SubscriptionList
                                            Subscriptions={this.state.Data[key]}
                                            IdSubscription={key}
                                        />
                                    </View>
                                )
                            })
                            : <View style={styles.noOrders}><Text>Request orders is empty</Text></View>
                }
                </ScrollView>
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
                                <Button title="SEND" type="primary" onPress={() => {this.setModalVisible(!this.state.modalVisible);this.cancelSubscription(this.state.messageCancellation)}} />
                            </View>
                        </View>
                    </View>
                </ModalWrapper>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    cardStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#dcdcdc',
        height: 240,
        width: 370,
        marginTop: 10,
        borderRadius: 30/2,
    },
    cancelButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    subscriptionName: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
        marginLeft: 15
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
    infos: {
        flexDirection: 'column',
        marginLeft: 25,
        marginTop: 8,
    },
    noOrders : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonsView: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop:5
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
    newSubscriptionButton: {
        borderRadius: 30/2,
        backgroundColor: "#E8F7FF",
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 12,
        paddingRight: 12,
        marginTop: 5,
        width: 300
    },
    newSubscriptionButtonText: {
        fontSize: 12,
        color: "#5780D9",
        textTransform: "uppercase",
        textAlign: "center",
        fontWeight: 'bold',
    }
});
