import React from 'react';
import Home from './src/screens/Home';
import NavigatorUser from './src/routes/drawerUser';
import NavigatorOwner from './src/routes/drawerOwner';
import {auth, db} from "./src/services/FireBaseConfig";
import {ActivityIndicator, Alert, Animated, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Vibration,Platform} from "react-native";
import {APPROX_STATUSBAR_HEIGHT} from "react-native-paper/src/constants";
import Icon from 'react-native-vector-icons/FontAwesome5';
import {SocialIcon} from "react-native-elements";
import Register from "./src/Authentification/Register";
import {IsOrderValid,IsOrderDone} from "./src/screens/Orders/RequestRoute";
import {strings} from './src/translations/translate';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';


export async function registerForPushNotificationsAsync() {
    if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }

        const token = await Notifications.getExpoPushTokenAsync();
        if (auth.currentUser !== null){
            let userCon = auth.currentUser.uid;
            let ref = db.ref("/users");
            let keytable;
            let queryKey = ref.orderByChild("uid").equalTo(userCon);
            await queryKey.once("value", function (snapshot) {
                snapshot.forEach(function (child) {
                    keytable = child.key
                });

            }).then(async function (data) {
                // let updates = {};
                // updates['/notificationToken'] = token;
                console.log('wa rah dkhlt');
                await db.ref('/users/'+keytable).update({
                    notificationToken:  token
                });
            });
        }

        this.setState({ expoPushToken: token });
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.createChannelAndroidAsync('default', {
            name: 'default',
            sound: true,
            priority: 'max',
            vibrate: [0, 250, 250, 250],
        });
    }
}

export const _handleNotification = notification => {
    Vibration.vibrate();
    console.log(notification);
    //
    //this.setState({ notification: notification });
};

export default class App extends React.Component{

    constructor(){
        super();
        this.state = {
            user:{},
            userInfo:{},
            data:{},
            dataSource:{},
            Data:{},
            scroll: new Animated.Value(0),
            email: "",
            username: "",
            password: "",
            isLoading: true,
            modalVisible: false,
            error:null,
            secureTextEntryFirst:true,
            showFirst:'show',
            expoPushToken: '',
            notification: {},
        }
    }



    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    handleEmail(value){
        this.setState({email: value})
    };
    handlePassword(value){
        this.setState({password: value})
    };
    componentDidMount() {
        //Function depart :

        IsOrderValid();
        IsOrderDone();
        // End FUnction depart
        //notification config Sta
        registerForPushNotificationsAsync();
        this._notificationSubscription = Notifications.addListener(_handleNotification);
        //notification config End

        this.getNavigator();
    }
    loginUser = (email, password, props, Change=()=>this.getNavigator()) => {
        props = this.props;
        auth.signInWithEmailAndPassword(email, password)
            .then(function (user) {
                Change();
            }).catch(error => this.setState({ error: error.message }))
    };

    getNavigator=  (Change=()=>this.setState({Data:'userResponsible',isLoading: false}), Change2=()=>this.setState({Data:'userNormal',isLoading: false}),
                    Change3=()=>this.setState({isLoading: false}),
                    Change4=()=>this.setState({isLoading: false, error: 'There is no user record corresponding to this identifier. The user may have been deleted.'}),
    )=> {
        setTimeout(function(){
            if (auth.currentUser === null){
                Change3();
            }else {
                let userCon = auth.currentUser.uid;
                let ref = db.ref("/users");
                let query = ref.orderByChild("uid").equalTo(userCon);
                query.once("value", function (snapshot) {
                    snapshot.forEach(function (child) {
                        console.log(child.val().userType);
                        if (child.val().userType === 'userResponsible') {
                            Change();
                        }
                        if (child.val().userType === 'userNormal') {
                            Change2();
                        }
                        if (child.val().userType === 'userAdmin') {
                            Change4();
                        }
                    });
                });

            }
        }, 5000);

    };
    render() {
        const secureTextEntryFirst=()=>{
            if (this.state.secureTextEntryFirst){
                this.setState({secureTextEntryFirst:false, showFirst:'hide'})
            }if (!this.state.secureTextEntryFirst){
                this.setState({secureTextEntryFirst:true, showFirst:'show'})
            }
        };
        const CloseModal =()=>{
            this.setModalVisible(false);
        };


        console.disableYellowBox = true;
        console.log(this.state.user);
        if (this.state.isLoading) {
            return (
                <ImageBackground source={require('./assets/Images/main.png')} style={{flex:1}}/>
            );
        }
        if (this.state.Data === 'userResponsible') {
            return <NavigatorOwner/>
        }if (this.state.Data === 'userNormal'){
            return <NavigatorUser/>
        }else{
            return (
                <View style={styles.container}>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                    >
                        <Register CloseModal={CloseModal}/>
                    </Modal>
                    <Image style={styles.imageAuth} source={require('./assets/Images/authImage.png')} />
                    <View style={styles.inputs}>
                        <Text>{this.state.error}</Text>
                        <View style={styles.inputContainer}>
                            <Icon style={styles.searchIcon} name="envelope" size={20} color="#000"/>
                            <TextInput
                                style={styles.input}
                                value={this.state.email}
                                maxLength={55}
                                placeholder={strings('loginPage.emailAddress')}
                                underlineColorAndroid = "transparent"
                                placeholderTextColor = "#a9a9a1"
                                autoCapitalize = "none"
                                onChangeText={(value) => { this.handleEmail(value)}}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon style={styles.searchIcon} name="lock" size={20} color="#000"/>
                            <TextInput
                                style={styles.input}
                                value={this.state.password}
                                maxLength={22}
                                secureTextEntry={this.state.secureTextEntryFirst}
                                placeholder={strings('loginPage.password')}
                                underlineColorAndroid = "transparent"
                                placeholderTextColor = "#a9a9a1"
                                autoCapitalize = "none"
                                onChangeText={(value) => { this.handlePassword(value)}}
                            />
                            <Text onPress={()=>secureTextEntryFirst()} style={styles.PasswordIcon}>{this.state.showFirst}</Text>
                        </View>
                    </View>
                    <View style={styles.loginAndRegister}>
                        <TouchableOpacity style={styles.buttonSubmit} onPress={() => this.loginUser(this.state.email, this.state.password)}>
                            <Text style={styles.buttonSubmitText}>{strings('loginPage.login')}</Text>
                        </TouchableOpacity >
                        <Text style={styles.registerHere} onPress={() => {
                            this.setModalVisible(true);
                        }}>{strings('loginPage.registerHere')}</Text>
                    </View>
                    <View style={styles.lineContent}>
                        <View style={styles.line}/>
                        <Text style={styles.orText}>{strings('loginPage.or')}</Text>
                        <View style={styles.line}/>
                    </View>
                    <View style={styles.socialButtonsContainer}>
                        <SocialIcon
                            title='Google'
                            style={styles.googleButton}
                            button
                            type='google'
                            onPress={() => Alert.alert("Google")}
                        />

                        <SocialIcon
                            title='Facebook'
                            style={styles.facebookButton}
                            button
                            type='facebook'
                            onPress={() => Alert.alert("Google")}
                        />
                    </View>
                    <View style={styles.footerContainer}>
                        <Text style={{textDecorationLine: 'underline'}} onPress={() => Alert.alert("Action")}>{strings('loginPage.termsAndConditions')}</Text>
                    </View>
                </View>
            );
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        height:'100%',
        width:'100%',
        marginTop: APPROX_STATUSBAR_HEIGHT

    },
    input: {
        height: 40,
        fontSize: 16,
    },
    inputs: {
        marginTop: 15,
        width: '90%',
        alignSelf: 'center',
    },
    searchIcon: {
        padding: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        borderColor: '#a9a9a1',
        borderBottomWidth: 1,
        marginBottom: 20,
        opacity: 0.5,
    },
    loginAndRegister: {
        flexDirection: 'column',
        width: '100%'
    },
    buttonSubmit: {
        backgroundColor: "#5780D9",
        paddingLeft: 12,
        paddingRight: 12,
        width: '90%',
        height: 50,
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 15
    },
    buttonSubmitText: {
        fontSize: 14,
        color: "#ffffff",
        textTransform: "uppercase",
        textAlign: "center",
        fontWeight: 'bold',
    },
    lineContent: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-between',
        alignSelf: 'center',
        opacity: 0.2,
    },
    line: {
        borderColor: '#a9a9a1',
        borderBottomWidth: 1,
        width: 135,
        alignSelf: 'center'
    },
    orText: {
        fontSize: 13
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
    googleButton: {
        backgroundColor: "#d93433",
        width: 150,
        height: 50,
        justifyContent: 'center',
        //alignSelf: 'center',
    },
    facebookButton: {
        backgroundColor: "#475993",
        width: 150,
        height: 50,
        justifyContent: 'center',
        //alignSelf: 'center',
    },
    socialButtonText: {
        fontSize: 14,
        color: "#ffffff",
        textTransform: "uppercase",
        textAlign: "center",
        fontWeight: 'bold',
    },
    footerContainer: {
        width: '100%',
        alignItems: 'center',
        opacity: 0.3,
        marginBottom: 20
    },
    imageAuth: {
        width: '90%',
        height: 150,
        alignSelf: 'center',
        marginTop: 20
    },
    registerHere: {
        textDecorationLine: 'underline',
        textAlign: 'center',
        opacity: 0.3,
    },
    PasswordIcon:{
        position:'absolute',
        padding: 8,
        marginLeft:300,
    }
});
