import React from 'react';
import {StyleSheet, Text, View, Image, ActivityIndicator, TextInput, Button, KeyboardAvoidingView, ScrollView, Alert, TouchableOpacity, Picker, RefreshControl, Modal} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as  ImagePicker from 'expo-image-picker';
import {auth, db, storage} from "../services/FireBaseConfig";
import {AntDesign, MaterialIcons,Entypo} from '@expo/vector-icons';

export default class Profile extends React.Component{
    constructor(props) {
        super(props);
        let user = auth.currentUser;
        user.reload().then(() => {
            console.log({emailVerified: user.emailVerified})
        });
        this.state = {
            isLoading: true,
            images: null,
            user:{},
            Data:{},
            First:"",
            Last:"",
            Phone:"",
            Keys:"",
            error:"",
            isEmailVerified:"",
            refreshing: false,
            modalVisible: false,
        };
    };
    IsEmailVerified=()=>{

        this.state.refreshing= false;
        this.state.user = auth.currentUser;
        if (this.state.user.emailVerified){
            console.log(this.state.user.emailVerified);
        }if (!this.state.user.emailVerified){
                this.state.isEmailVerified="Email verification is required to make an order";
            return (<TouchableOpacity style={styles.isEmailVerified} onPress={()=>this.sendEmailVerification()}>
                <Text>
                    Confirm
                </Text>
            </TouchableOpacity>)
        }
        return <Entypo name='check' size={50} style={styles.isEmailVerified}/>;
    };
    sendEmailVerification=(Change=()=> this.setState({isLoading: false}))=>{
        this.setState({isLoading: true});
        let user = auth.currentUser;

        user.sendEmailVerification().then(function() {
            console.log('tsayft');
            reloadData();
            Change();
        }).catch(function(error) {
            console.log('walo email ki walo');
            errors(error.message);
            Change();
        });
        const errors=(error)=>{
            this.setState({error:error})
        };
        const reloadData=()=>{
            user = auth.currentUser;
            user.reload().then(() => {
                console.log({emailVerified: user.emailVerified})
            })
        };
    };
    onRefresh() {
        let user = auth.currentUser;
        user.reload().then(() => {
            console.log({emailVerified: user.emailVerified})
        });
        this.setState({ Data: {}, refreshing:true, error:"",user: {},First:"", Last:"", Phone:"", Keys:"", isEmailVerified:""});
        this.GetProfile();
        this.IsEmailVerified();
    }
    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            this.setState({ Data:{},isLoading: true });
            this.GetProfile();
        });
        this.GetProfile();

        this.state.user = auth.currentUser;
        let userCon = this.state.user.uid;
        let ref = db.ref("/users");
        let keytable;
        console.log(userCon);
        let queryKey = ref.orderByChild("uid").equalTo(userCon);
        queryKey.once("value", function (snapshot, dataU) {
            snapshot.forEach(function (child) {
                dataU = child.key;
                keytable = child.key
            });

        }).then(r  =>this.setState({keys: keytable}));
    }

    UpdateProfile=(DataInput,dataSaved=()=>this.GetProfile(), EmailV=()=> this.IsEmailVerified(),
              ReloadData=()=>this.setState({ Data: {}, refreshing:true, error:"",user: {},First:"", Last:"", Phone:"", Keys:"", isEmailVerified:""}))=>{
        this.setState({isLoading: true});
        if (DataInput.FirstName === ""){
            console.log('DataInput.FirstName',DataInput.FirstName);
        }

        if (DataInput.Email === this.state.Data.email){
            db.ref("users/"+this.state.keys).update({
                FirstName: DataInput.FirstName,
                LastName: DataInput.LastName,
                Gender: DataInput.Gender,
                Year : DataInput.Year,
                Month : DataInput.Month,
                Day :  DataInput.Day,
                City: DataInput.City,
                Phone_Number: DataInput.Phone_Number,
            }, function (error) {

                if (error) {
                    Alert.alert('Error', error.message)
                } else {
                    console.log('success');
                }
            }).then(r =>ReloadData(),dataSaved(), EmailV());
        }else {
            let user = auth.currentUser;
            console.log('email -------', this.state.Data.email, DataInput.Email);
            let newEmail= DataInput.Email;
            user.updateEmail(newEmail).then(function() {
                console.log('email changed');
                fct();
                dataSaved();
                EmailV();
            }).catch(function(error) {
                errors(error.message);
                console.log('An error happened', error);
                dataSaved();
                EmailV();
            });
            const errors=(error)=>{
                this.setState({error:error})
            };
            const fct =()=>{
                db.ref("users/"+this.state.keys).update({
                    FirstName: DataInput.FirstName,
                    LastName: DataInput.LastName,
                    Gender: DataInput.Gender,
                    Year : DataInput.Year,
                    Month : DataInput.Month,
                    Day :  DataInput.Day,
                    City: DataInput.City,
                    Phone_Number: DataInput.Phone_Number,
                    email: DataInput.Email,
                }, function (error) {
                    if (error) {
                        Alert.alert('Error', error)
                    } else {
                        console.log('success');
                    }
                });
            };
        }
    };

    GetProfile =(dataUser, Change=()=>this.setState({Data:dataUser, isLoading: false,}),
                 First=()=>this.setState({First:'First name is required to make an order'}),
                 Last=()=>this.setState({Last:'Last name is required to make an order'}),
                 Phone=()=>this.setState({Phone:'Phone number is required to make an order'}))=>{
        this.state.user = auth.currentUser;
        let userCon = this.state.user.uid;
        let ref = db.ref("/users");
        let query = ref.orderByChild("uid").equalTo(userCon);
        query.once("value", function(snapshot, dataU) {
            snapshot.forEach(function(child) {
                dataU = child.val();
                dataUser = dataU;
                Change();
                if (child.val().FirstName === ""){
                    First();
                }if (child.val().LastName === ""){
                    Last();
                }if (child.val().Phone_Number === ""){
                    Phone();
                }
                getImage(child.val().Gender, child.val().Image);
            });
        }).catch(function(error) {
            errors(error.message);
            console.log('An error happened', error);
           Change();
        });
        const errors=(error)=>{
            this.setState({error:error})
        };

        const getImage= async (dataGender, dataImage) => {
                console.log(dataGender,dataImage);
            if (dataGender === "Male" && dataImage === ""){
                let ref = storage.ref('UsersImage/man.png' );
                let url = await ref.getDownloadURL();
                this.setState({images:url})
            }if (dataGender === 'Female' && dataImage === ""){
                let ref = storage.ref('UsersImage/woman.png');
                let url = await ref.getDownloadURL();
                this.setState({images:url})
            }if (dataGender === "" && dataImage === "") {
                let ref = storage.ref('UsersImage/unix.png');
                let url = await ref.getDownloadURL();
                this.setState({images:url})
            }else {
                console.log('UsersImage/'+dataImage);
                let ref = storage.ref('UsersImage/'+dataImage);
                let url = await ref.getDownloadURL();
                this.setState({images:url})
            }

        };
    };


    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    UpdatePassword=(values)=> {
        console.log('tmanyiiik');
        let user =auth.currentUser;
        let NewPassword = values.NewPassword;
        let NewPassword2= values.NewPassword2;

        if (NewPassword === NewPassword2){
            console.log('tmanyiiik');
            user.updatePassword(NewPassword).then(function() {
            }).catch(function(error) {
                errors(error.message);
                console.log('walllllllllllo');
            });
        }else {
            this.setState({error:'Password not match'})
        }

        const errors=(error)=>{
            this.setState({error:error})
        };
    };
    onChooseImagePress = async () => {
            let result = await ImagePicker.launchImageLibraryAsync();
            this.setState({images: result.uri});
            this.uploadImage(result.uri);
    };
    uploadImage = async (uri) => {
        this.state.user = auth.currentUser;
        let userCon = this.state.user.uid;
        let path = uri+userCon;
        const response = await fetch(uri);
        const blob = await response.blob();
        let ref = storage.ref().child("UsersImage/"+path);
        db.ref("users/"+this.state.keys).update({
            Image: path,
        }, function (error) {
            if (error) {
                errors(error.message);
            } else {
                console.log('success');
            }
        }).then(r =>this.GetProfile());
        const errors=(error)=>{
            this.setState({error:error})
        };
        return ref.put(blob);
    };
    render(){
        const CheckField = yup.object({
            userName: yup.string().required().max(40).min(5),
            FirstName: yup.string().max(40).min(5),
            LastName: yup.string().max(40).min(5),
            City: yup.string().min(4).max(40),
            Year:yup.number().positive().min(1900).max(2019),
            Month:yup.number().positive().min(1).max(12),
            Day:yup.number().positive().min(1).max(31),
            Email: yup.string().required().email(),
            Gender: yup.string().max(40).min(3),
            Phone_Number : yup.number().positive().nullable()
                .test('is-num-1-10','Phone number most be 10 numbers', (val)=>{
                    return parseInt(val) <1234567899 && parseInt(val) >=123456789;
                })
        });
        const CheckPassword = yup.object({
            NewPassword: yup.string().required().max(40).min(8).test('value-name', 'Space not allowed', (yourValue) => !yourValue.includes(' ')),
            NewPassword2: yup.string().required().max(40).min(8).test('value-name', 'Space not allowed', (yourValue) => !yourValue.includes(' ')),
        });
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            );
        }
        const CloseModal =()=>{
            this.setModalVisible(false);
        };
        let uri =this.state.images;
        return (
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                >

                    <Formik
                        initialValues={{
                            NewPassword : '',
                            NewPassword2:'',
                        }}
                        validationSchema={CheckPassword}
                        onSubmit={(values) =>{
                            this.UpdatePassword(values);
                        }}>
                        {(props)=>(
                            <View style={styles.Form}>
                                <Text style={{fontSize:40, marginBottom:30, textAlign:'center'}}>Change Password</Text>
                                <Text> New Password </Text>
                                <TextInput style={styles.input}
                                           secureTextEntry={true}
                                           onChangeText={props.handleChange('NewPassword')}
                                           value={props.values.NewPassword}
                                           onBlur={props.handleBlur('NewPassword')}
                                />
                                <Text style={styles.errorText}>{props.touched.NewPassword && props.errors.NewPassword}</Text>

                                <Text> Repeat New Password </Text>
                                <TextInput style={styles.input}
                                           secureTextEntry={true}
                                           onChangeText={props.handleChange('NewPassword2')}
                                           value={props.values.NewPassword2}
                                           onBlur={props.handleBlur('NewPassword2')}
                                />
                                <Text style={styles.errorText}>{props.touched.NewPassword2 && props.errors.NewPassword2}</Text>
                                <View >
                                    <Button title='Change Password' style={styles.Button} onPress={props.handleSubmit}/>
                                </View>
                                <View style={{marginTop: 20}}>

                                    <Button title='Cancel' style={{marginTop:20}} onPress={()=> CloseModal()}/>
                                </View>

                            </View>
                        )}



                    </Formik>
                </Modal>
                <KeyboardAvoidingView behavior="position">
                <ScrollView
                    refreshControl={
                        <RefreshControl

                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                >

                        <View style={styles.header}/>
                    <TouchableOpacity style={styles.avatarCont} onPress={() => this.onChooseImagePress()}>
                        <Image style={styles.avatar} source={{uri: uri}}/>
                    </TouchableOpacity>



                        <Formik
                            initialValues={{
                                userName : this.state.Data.username,
                                FirstName : this.state.Data.FirstName,
                                LastName : this.state.Data.LastName,
                                Gender : this.state.Data.Gender,
                                Year : this.state.Data.Year,
                                Month : this.state.Data.Month,
                                Day :  this.state.Data.Day,
                                City : this.state.Data.City,
                                Phone_Number : this.state.Data.Phone_Number,
                                Email : this.state.Data.email,
                                Password : this.state.Data.Password,
                                Language:'Anglais'
                            }}
                            enableReinitialize={true}
                            onSubmit={(values) =>{
                                this.UpdateProfile(values);
                            }}
                            validationSchema={CheckField}
                         >
                            {(props) =>(
                                <View style={styles.Form}>
                                    <Text style={styles.errorText}>
                                        {this.state.error}
                                    </Text>
                                    <Text> username </Text>
                                    <TextInput style={styles.input}

                                               onChangeText={props.handleChange('Name')}
                                               value={props.values.userName}
                                               onBlur={props.handleBlur('userName')}
                                               editable={false}
                                    />
                                    <Text style={styles.errorText}>{props.touched.userName && props.errors.userName}</Text>

                                    <Text> First Name </Text>
                                    <TextInput style={styles.input}

                                               onChangeText={props.handleChange('FirstName')}
                                               value={props.values.FirstName}
                                               onBlur={props.handleBlur('FirstName')}
                                    />
                                    <Text style={styles.errorText}>{this.state.First}</Text>
                                    <Text style={styles.errorText}>{props.touched.FirstName && props.errors.FirstName}</Text>

                                    <Text> Last Name </Text>
                                    <TextInput style={styles.input}
                                               placeholder={this.state.Data.LastName}
                                               onChangeText={props.handleChange('LastName')}
                                               value={props.values.LastName}
                                               onBlur={props.handleBlur('LastName')}
                                    />
                                    <Text style={styles.errorText}>{this.state.Last}</Text>
                                    <Text style={styles.errorText}>{props.touched.LastName && props.errors.LastName}</Text>
                                    <Text> Phone Number </Text>
                                    <View style={{flexDirection:"row"}}>
                                        <TextInput style={styles.numberCode}
                                                   value='+212'
                                                   keyboardType='numeric'
                                                   editable={false}
                                        />
                                    <TextInput style={styles.number}
                                               onChangeText={props.handleChange('Phone_Number')}
                                               value={props.values.Phone_Number}
                                               onBlur={props.handleBlur('Phone_Number')}
                                               keyboardType='numeric'
                                    />

                                    </View>
                                    <Text style={styles.errorText}>{this.state.Phone}</Text>
                                    <Text style={styles.errorText}>{props.touched.Phone_Number && props.errors.Phone_Number}</Text>

                                    <Text> Email </Text>
                                    <View style={{flexDirection:"row"}}>

                                    <TextInput style={styles.inputEmail}
                                               onChangeText={props.handleChange('Email')}
                                               value={props.values.Email}
                                               onBlur={props.handleBlur('Email')}

                                    />
                                        <this.IsEmailVerified/>
                                    </View>
                                    <Text style={styles.errorText}>{this.state.isEmailVerified}</Text>
                                    <Text style={styles.errorText}>{props.touched.Email && props.errors.Email}</Text>
                                    <TouchableOpacity onPress={() => {
                                        this.setModalVisible(true);
                                    }}>
                                        <Text > Change Password </Text>
                                        <TextInput style={styles.input}

                                                   placeholder='********'
                                                   onChangeText={props.handleChange('Password')}
                                                   value={'********'}
                                                   onBlur={props.handleBlur('Password')}
                                                   editable={false}
                                        />
                                    </TouchableOpacity>

                                    <Text style={styles.errorText}>{props.touched.Password && props.errors.Password}</Text>

                                    <Text> Gender </Text>
                                    <Picker
                                        style={styles.input}
                                        selectedValue={props.values.Gender}
                                        onValueChange={props.handleChange('Gender')}>
                                        <Picker.Item label="Male" value="Male" />
                                        <Picker.Item label="Female" value="Female" />
                                    </Picker>
                                    <Text style={styles.errorText}>{props.touched.Gender && props.errors.Gender}</Text>

                                    <Text> Birth Day </Text>
                                    <View style={{flexDirection:"row", marginTop: 5}}>
                                    <Text style={{marginLeft:5}}> Year </Text>
                                    <Text style={{marginLeft:60}}> Month </Text>
                                    <Text style={{marginLeft:20}}> Day </Text>
                                    </View>
                                    <View style={{flexDirection:"row"}}>

                                    <TextInput style={styles.Year}

                                               onChangeText={props.handleChange('Year')}
                                               value={props.values.Year}
                                               onBlur={props.handleBlur('Year')}
                                               keyboardType='numeric'
                                    />


                                        <TextInput style={styles.Month}

                                                   onChangeText={props.handleChange('Month')}
                                                   value={props.values.Month}
                                                   onBlur={props.handleBlur('Month')}
                                                   keyboardType='numeric'
                                        />


                                        <TextInput  style={styles.Day}

                                                   onChangeText={props.handleChange('Day')}
                                                   value={props.values.Day}
                                                   onBlur={props.handleBlur('Day')}
                                                    keyboardType='numeric'
                                        />

                                    </View>
                                    <Text style={styles.errorText}>{props.touched.Year && props.errors.Year}</Text>
                                    <Text style={styles.errorText}>{props.touched.Month && props.errors.Month}</Text>
                                    <Text style={styles.errorText}>{props.touched.Day && props.errors.Day}</Text>

                                    <Text> City </Text>
                                    <TextInput style={styles.input}
                                               placeholder={this.state.Data.City}
                                               onChangeText={props.handleChange('City')}
                                               value={props.values.City}
                                               onBlur={props.handleBlur('City')}
                                    />
                                    <Text style={styles.errorText}>{props.touched.City && props.errors.City}</Text>

                                    <Text> Language </Text>
                                    <TextInput style={styles.input}
                                               placeholder='Anglais'
                                               onChangeText={props.handleChange('Language')}
                                               value={props.values.Language}
                                               onBlur={props.handleBlur('Language')}
                                               editable={false}
                                    />
                                    <Text style={styles.errorText}>{props.touched.Language && props.errors.Language}</Text>

                                    <Button title='submit' style={styles.Button} onPress={props.handleSubmit}/>
                                </View>
                            )}


                        </Formik>



                </ScrollView>
            </KeyboardAvoidingView>

            </View>
        );
    }



}
const styles = StyleSheet.create({
    header:{
        backgroundColor: "#00BFFF",
        height:100,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
        alignSelf:'center',
        position: 'absolute',
        marginTop:50
    },
    numberCode :{
        borderWidth: 0,
        borderColor: '#000',
        padding: 15,
        fontSize: 18,
        borderRadius: 10,
        marginBottom: 4,
        height: 50,
        borderBottomColor: '#debaff',
        borderBottomWidth: 1,
    },
    number :{
        borderWidth: 0,
        borderColor: '#000',
        padding: 15,
        fontSize: 18,
        borderRadius: 10,
        marginBottom: 4,
        height: 50,
        width: 380,
        borderBottomColor: '#debaff',
        borderBottomWidth: 1,
    },
    inputEmail:{
        borderWidth: 0,
        borderColor: '#000',
        padding: 15,
        fontSize: 18,
        borderRadius: 10,
        marginBottom: 4,
        height: 50,
        width: 300,
        borderBottomColor: '#debaff',
        borderBottomWidth: 1,
    },
    isEmailVerified:{
        borderWidth: 0,
        borderColor: '#000',
        padding: 15,
        fontSize: 18,
        borderRadius: 10,
        marginBottom: 4,
        height: 50,
        width: 100,
        borderBottomColor: '#debaff',
        borderBottomWidth: 1,
    },
    avatarCont: {
        width: 130,
        height: 130,
        marginBottom:10,
        alignSelf:'center',
        position: 'absolute',
    },
    name:{
        fontSize:22,
        color:"#FFFFFF",
        fontWeight:'600',
    },
    body:{
        marginTop:40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding:30,
    },
    info:{
        fontSize:16,
        color: "#00BFFF",
        marginTop:10
    },
    description:{
        fontSize:16,
        color: "#696969",
        marginTop:10,
        textAlign: 'center'
    },
    socialIcon: {
        marginLeft: 14,
        marginRight: 14,
        marginTop: 480,
    },
    socialRow: {
        flexDirection: 'row',
    },
    input: {
        borderWidth: 0,
        borderColor: '#000',
        padding: 15,
        fontSize: 18,
        borderRadius: 10,
        marginBottom: 4,
        height: 50,
        width: 380,
        borderBottomColor: '#debaff',
        borderBottomWidth: 1,

    },

    Year: {
        borderWidth: 0,
        borderColor: '#000',
        padding: 15,
        fontSize: 18,
        borderRadius: 10,
        marginBottom: 4,
        height: 50,
        width: 100,
        borderBottomColor: '#debaff',
        borderBottomWidth: 1,

    },
    Month: {
        borderWidth: 0,
        borderColor: '#000',
        padding: 15,
        fontSize: 18,
        borderRadius: 10,
        marginBottom: 4,
        height: 50,
        width: 60,
        borderBottomColor: '#debaff',
        borderBottomWidth: 1,

    },
    Day: {
        borderWidth: 0,
        borderColor: '#000',
        padding: 15,
        fontSize: 18,
        borderRadius: 10,
        marginBottom: 4,
        height: 50,
        width: 60,
        borderBottomColor: '#debaff',
        borderBottomWidth: 1,

    },
    Button:{
        color: '#ff0a10',
        borderWidth: 5,
        borderColor: '#000',
    },
    Form:{
        marginTop: 90,
    },
    errorText: {
        color: 'crimson',
        fontWeight: 'bold',
        textAlign: 'center',
    }
});
