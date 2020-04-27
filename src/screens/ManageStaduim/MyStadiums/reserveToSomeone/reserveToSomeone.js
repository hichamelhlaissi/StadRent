import React, {Component, useState} from 'react';
import {Alert, View, Button, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform} from 'react-native';
import { MaterialIcons, Entypo, FontAwesome} from '@expo/vector-icons';
import {APPROX_STATUSBAR_HEIGHT} from "react-native-paper/src/constants";
import moment from "moment";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {auth, db, storage} from './../../../../services/FireBaseConfig';



export default class reserveToSomeone extends Component {
    constructor(props) {
        super(props);
        const {state} = props.navigation;
    }

    state={
        Today : new Date(),
        DataUse: this.Today,
        // TodayDate:this.Today.getDate() + "/"+ parseInt(this.Today.getMonth()+1) +"/"+ this.Today.getFullYear(),
        Program: [
            { id: 0, StartHour: '09', EndHour: '10', rentDate: moment(new Date()).format('DD/MM/YYYY'), reserved: false},
            { id: 1, StartHour: '10', EndHour: '11', rentDate: moment(new Date()).format('DD/MM/YYYY'), reserved: false },
            { id: 2, StartHour: '11', EndHour: '12', rentDate: moment(new Date()).format('DD/MM/YYYY'), reserved: false },
            { id: 3, StartHour: '12', EndHour: '13', rentDate: moment(new Date()).format('DD/MM/YYYY'), reserved: false },
            { id: 4, StartHour: '13', EndHour: '14', rentDate: moment(new Date()).format('DD/MM/YYYY'), reserved: false },
            { id: 5, StartHour: '14', EndHour: '15', rentDate: moment(new Date()).format('DD/MM/YYYY'), reserved: false },
            { id: 6, StartHour: '15', EndHour: '16', rentDate: moment(new Date()).format('DD/MM/YYYY'), reserved: false },
            { id: 7, StartHour: '16', EndHour: '17', rentDate: moment(new Date()).format('DD/MM/YYYY'), reserved: false },
            { id: 8, StartHour: '17', EndHour: '18', rentDate: moment(new Date()).format('DD/MM/YYYY'), reserved: false },
            { id: 9, StartHour: '18', EndHour: '19', rentDate: moment(new Date()).format('DD/MM/YYYY'), reserved: false },
            { id: 10, StartHour: '19', EndHour: '20', rentDate: moment(new Date()).format('DD/MM/YYYY'), reserved: false },
            { id: 11, StartHour: '20', EndHour: '21', rentDate: moment(new Date()).format('DD/MM/YYYY'), reserved: false },
            { id: 12, StartHour: '21', EndHour: '22', rentDate: moment(new Date()).format('DD/MM/YYYY'), reserved: false },
            { id: 13, StartHour: '22', EndHour: '23', rentDate: moment(new Date()).format('DD/MM/YYYY'), reserved: false },
            { id: 14, StartHour: '23', EndHour: '00', rentDate: moment(new Date()).format('DD/MM/YYYY'), reserved: false },
        ],
        newProgram: [],
        modalVisible: false,
        isLoading: false,
        stadiumName: "",
        stadiumId: "",
        rentDate: moment(new Date()).format('DD/MM/YYYY'),
    };

    componentDidMount(){
       this.getProgram()
    }
    getProgram() {
        db.ref('/stadiums/'+this.IdStaduim+'/programs/'+this.state.rentDate+'/program').on('value', querySnapShot => {
            let data = querySnapShot.val() ? querySnapShot.val() : {};
            let programs = {...data};
            this.setState({newProgram: Object.values(programs)})
        })
    }

    maxDate() {
        var chosenWeekday = 7;

        return  chosenWeekday < moment().weekday() ? moment().weekday(chosenWeekday + 7) : moment().weekday(chosenWeekday)
    }


    ScheduleDate = () => {
        let today = new Date();
        let ProgramV2 = [
            { id: 0, StartHour: '09', EndHour: '10', rentDate: this.state.rentDate, reserved: false},
            { id: 1, StartHour: '10', EndHour: '11', rentDate: this.state.rentDate, reserved: false },
            { id: 2, StartHour: '11', EndHour: '12', rentDate: this.state.rentDate, reserved: false },
            { id: 3, StartHour: '12', EndHour: '13', rentDate: this.state.rentDate, reserved: false },
            { id: 4, StartHour: '13', EndHour: '14', rentDate: this.state.rentDate, reserved: false },
            { id: 5, StartHour: '14', EndHour: '15', rentDate: this.state.rentDate, reserved: false },
            { id: 6, StartHour: '15', EndHour: '16', rentDate: this.state.rentDate, reserved: false },
            { id: 7, StartHour: '16', EndHour: '17', rentDate: this.state.rentDate, reserved: false },
            { id: 8, StartHour: '17', EndHour: '18', rentDate: this.state.rentDate, reserved: false },
            { id: 9, StartHour: '18', EndHour: '19', rentDate: this.state.rentDate, reserved: false },
            { id: 10, StartHour: '19', EndHour: '20', rentDate: this.state.rentDate, reserved: false },
            { id: 11, StartHour: '20', EndHour: '21', rentDate: this.state.rentDate, reserved: false },
            { id: 12, StartHour: '21', EndHour: '22', rentDate: this.state.rentDate, reserved: false },
            { id: 13, StartHour: '22', EndHour: '23', rentDate: this.state.rentDate, reserved: false },
            { id: 14, StartHour: '23', EndHour: '00', rentDate: this.state.rentDate, reserved: false },
        ];

        const [date, setDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        const [mode, setMode] = useState('date');
        const [show, setShow] = useState(false);

        const onChange = (event, selectedDate) => {
            const currentDate = selectedDate || date;
            setShow(Platform.OS === 'ios');
            setDate(currentDate);


            if (selectedDate !== undefined) {
                this.setState({newPrograms: [],Program: ProgramV2, isLoading: true});
                db.ref('/stadiums/'+this.state.stadiumId+'/programs/'+moment(selectedDate).format('DD/MM/YYYY')+'/program').on('value', querySnapShot => {
                    let data = querySnapShot.val() ? querySnapShot.val() : {};
                    let programs = {...data};
                    this.setState({newProgram: Object.values(programs)});
                });
                this.setState({rentDate: moment(selectedDate).format('DD/MM/YYYY')});
                let program = this.state.Program;
                for (let p of program){
                    p.rentDate = moment(selectedDate).format('DD/MM/YYYY');
                }
                this.setState({Program: program, isLoading: false});

            }if (selectedDate === undefined) {
                console.log("cancel")
            }

        };
        const showMode = currentMode => {
            setShow(true);
            setMode(currentMode);
        };

        const showDatepicker = () => {
            showMode('date');
        };


        return (
            <View>
                <View>
                    <Button onPress={showDatepicker} title="Choose The Day" />
                </View>
                {show && (
                    <RNDateTimePicker
                        maximumDate={new Date(this.maxDate())}
                        minimumDate={new Date()}
                        testID="dateTimePicker"
                        timeZoneOffsetInMinutes={0}
                        value={new Date()}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )}
            </View>
        );
    };
    onReserveV1(id){
        let newProgram = [...this.state.Program];
        newProgram[id].reserved = !newProgram[id].reserved;
        this.setState({Program: newProgram});
    }
    onReserveV2(id){
        let newProgram = [...this.state.newProgram];
        newProgram[id].reserved = !newProgram[id].reserved;
        this.setState({newProgram: newProgram});
    }
    onFinishV1(){
        var programsRef = db.ref('/stadiums/'+this.state.stadiumId+'/programs/'+this.state.rentDate);
        programsRef.set({
            program: this.state.Program,
        }).then(() => {
            Alert.alert(
                'Action!!',
                'Data sent successfully',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
            )
        });
    }
    onFinishV2(){
        var programsRef = db.ref('/stadiums/'+this.state.stadiumId+'/programs/'+this.state.rentDate);
        programsRef.set({
            program: this.state.newProgram,
        }).then(() => {
            Alert.alert(
                'Action!!',
                'Data sent successfully',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
            );
        });
    }
    render(){
        this.state.stadiumName = this.props.navigation.getParam('data1');
        this.state.stadiumId = this.props.navigation.getParam('data2');

        return (

            <ScrollView>

                <View style={styles.container}>
                    <View style={{flexDirection: 'row', justifyContent: 'center', width:'90%'}}>
                        <this.ScheduleDate/>
                    </View>
                    {
                        this.state.isLoading ? <View style={styles.isLoading}><Image source={require('../../../../../assets/Images/spinner.gif')}/></View>
                            :
                            this.state.newProgram.length > 0 ?
                                this.state.newProgram.map((Program) => {
                                    return (
                                        <View style={styles.cardStyle} key={Program.id}>
                                            <View style={styles.infos}>
                                                <View style={styles.feedbacksView}>
                                                    <Text style={styles.HourInfo}>{Program.StartHour} -> {Program.EndHour}</Text>
                                                    <FontAwesome style={styles.Calendar} name='calendar' size={20} />
                                                    <Text style={styles.HourInfo}>{Program.rentDate}</Text>
                                                </View>
                                                <View style={styles.feedbacksView}>
                                                    <Entypo name='location-pin' size={25} />
                                                    <Text style={styles.NameStaduim}>{this.state.stadiumName}</Text>
                                                </View>
                                            </View>
                                            {
                                                Program.reserved ?
                                                    <TouchableOpacity style={styles.buttonReserved} onPress={() => this.onReserveV2(Program.id)}>
                                                        <Text style={{textAlign: 'center', fontSize:20, marginTop: 5, color: '#fff'}}>Reserved</Text>
                                                    </TouchableOpacity>
                                                    :
                                                    <TouchableOpacity style={styles.buttonReserve} onPress={() => this.onReserveV2(Program.id)}>
                                                        <Text style={{textAlign: 'center', fontSize:20, marginTop: 5}}>Reserve</Text>
                                                    </TouchableOpacity>
                                            }
                                        </View>
                                    )
                                }) :
                                this.state.Program.length > 0
                                    ? this.state.Program.map((Program) => {
                                        return (
                                            <View style={styles.cardStyle} key={Program.id}>
                                                <View style={styles.infos}>
                                                    <View style={styles.feedbacksView}>
                                                        <Text style={styles.HourInfo}>{Program.StartHour} -> {Program.EndHour}</Text>
                                                        <FontAwesome style={styles.Calendar} name='calendar' size={20} />
                                                        <Text style={styles.HourInfo}>{Program.rentDate}</Text>
                                                    </View>
                                                    <View style={styles.feedbacksView}>
                                                        <Entypo name='location-pin' size={25} />
                                                        <Text style={styles.NameStaduim}>{this.state.stadiumName}</Text>
                                                    </View>
                                                </View>
                                                {
                                                    Program.reserved ?
                                                        <TouchableOpacity style={styles.buttonReserved} onPress={() => this.onReserveV1(Program.id)}>
                                                            <Text style={{textAlign: 'center', fontSize:20, marginTop: 5, color: '#fff'}}>Reserved</Text>
                                                        </TouchableOpacity>
                                                        :
                                                        <TouchableOpacity style={styles.buttonReserve} onPress={() => this.onReserveV1(Program.id)}>
                                                            <Text style={{textAlign: 'center', fontSize:20, marginTop: 5}}>Reserve</Text>
                                                        </TouchableOpacity>
                                                }
                                            </View>
                                        )
                                    })
                                    : <View style={styles.noOrders}><Text>Empty</Text>
                                    </View>
                    }

                    {
                        this.state.newProgram.length > 0 && !this.state.isLoading ?
                            <TouchableOpacity style={styles.doneButton} onPress={() => this.onFinishV2()}>
                                <Text style={styles.doneButtonText}>Finish</Text>
                            </TouchableOpacity > :
                            this.state.Program.length > 0 && !this.state.isLoading ?
                                <TouchableOpacity style={styles.doneButton} onPress={() => this.onFinishV1()}>
                                    <Text style={styles.doneButtonText}>Finish</Text>
                                </TouchableOpacity > :
                                <View></View>
                    }
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        //marginTop: APPROX_STATUSBAR_HEIGHT,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    noOrders : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#5780D9',
        height: 60,
        width: 370,
        marginTop: 10,
        borderRadius: 30/2,
    },
    infos: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 1,
        height: 50,
    },
    HourInfo: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 15,
        marginBottom:3,
        flexDirection: 'row',
    },

    starsView: {
        width: 80,
        marginLeft: 15,
        marginRight: 10,
    },
    feedbacksView: {
        flexDirection: 'row',
    },
    NameStaduim: {
        color: '#fff',
        fontSize: 16,
        marginTop:2,
    },
    Calendar:{
        marginLeft: 15,
    },
    buttonReserve:{
        height:40,
        width:100,
        borderRadius: 50,
        marginTop:9,
        marginRight:5,
        backgroundColor: '#fff',
    },
    buttonReserved:{
        height:40,
        width:100,
        borderRadius: 50,
        marginTop:9,
        marginRight:5,
        backgroundColor: '#ff1800',
    },
    doneButton: {
        backgroundColor: "#000000",
        paddingLeft: 12,
        paddingRight: 12,
        marginTop: 10,
        width: '100%',
        height: 50,
        justifyContent: 'center',
    },
    doneButtonText: {
        fontSize: 14,
        color: "#ffffff",
        textTransform: "uppercase",
        textAlign: "center",
        fontWeight: 'bold',
    },
});
