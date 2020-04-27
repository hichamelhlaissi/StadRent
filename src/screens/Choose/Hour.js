import React, {useState, Component} from 'react';
import {View, Button, Platform, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView} from 'react-native';
import { MaterialIcons, Entypo, FontAwesome} from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ModalWrapper from "react-native-modal-wrapper";
import {APPROX_STATUSBAR_HEIGHT} from "react-native-paper/src/constants";
import CalDate from "./CalDate";
import moment from "moment";
import {db} from "../../services/FireBaseConfig";
import RNDateTimePicker from "@react-native-community/datetimepicker";

export default class Hour extends Component {
    constructor(props){
        super(props);
        const {state} = props.navigation;
        this.stadiumName = state.params.stadiumName;
        this.city = state.params.city;
        this.stadiumAddress= state.params.stadiumAddress;
        this.IdResponsible=state.params.IdResponsible;
        this.IdStaduim=state.params.IdStaduim;
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
        rentDate: moment(new Date()).format('DD/MM/YYYY'),
        rentDay: new Date().getDate(),
        rentMonth: parseInt(new Date().getMonth()+1),
        rentYear: new Date().getFullYear(),
        modalVisible: false,
        isLoading: false,
        Program2: [],
    };

    componentDidMount() {
        // const { navigation } = this.props;
        // this.focusListener = navigation.addListener('didFocus', () => {
        //     this.setState({ isLoading: true });
        // });
        this.getProgram();
    }
    getProgram() {
        db.ref('/stadiums/'+this.IdStaduim+'/programs/'+this.state.rentDate+'/program').on('value', querySnapShot => {
            let data = querySnapShot.val() ? querySnapShot.val() : {};
            let programs = {...data};
            this.setState({Program2: Object.values(programs)})
        })
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
                this.setState({
                    rentDate: moment(selectedDate).format('DD/MM/YYYY'),
                    rentDay: moment(selectedDate).date(),
                    rentMonth: parseInt(moment(selectedDate).month()+1),
                    rentYear: moment(selectedDate).year(),
                });
                this.setState({Program2: [],Program: ProgramV2, isLoading: true});
                this.getProgram();
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

        // let tomorrow = new Date();
        // tomorrow = moment(tomorrow).add(1, 'day'); // for specific format

        return (
            <View>
                <View>
                    <Button onPress={showDatepicker} title="Choose The Day" />
                </View>
                {show && (
                    <RNDateTimePicker
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

    render(){
        let today = new Date();
        let TodayDate=today.getDate() + "/"+ parseInt(today.getMonth()+1) +"/"+ today.getFullYear();

        return (
            <ScrollView>
            <View style={styles.container}>
                <this.ScheduleDate/>
                {
                    this.state.isLoading ? <View style={styles.isLoading}><Image source={require('../../../assets/Images/spinner.gif')}/></View>
                        :
                        this.state.Program2.length > 0
                            ? this.state.Program2.map((program) => {
                                return (
                                    <View style={styles.cardStyle} key={program.id}>
                                        <View style={styles.infos}>
                                            <View style={styles.feedbacksView}>
                                                <Text style={styles.HourInfo}>{program.StartHour} -> {program.EndHour}</Text>
                                                <FontAwesome style={styles.Calendar} name='calendar' size={20} />
                                                <Text style={styles.HourInfo}>{program.rentDate}</Text>
                                            </View>
                                            <View style={styles.feedbacksView}>
                                                <Entypo name='location-pin' size={25} />
                                                <Text style={styles.NameStaduim}>{this.stadiumName}</Text>
                                            </View>
                                        </View>
                                        {
                                            program.reserved ?
                                                <TouchableOpacity disabled style={styles.ButtonDisable} >
                                                    <Text style={{textAlign: 'center', fontSize:20, marginTop: 5}}>Reserved</Text>
                                                </TouchableOpacity> :
                                                <TouchableOpacity style={styles.Button} onPress={() =>
                                                    this.props.navigation.navigate('Order_Summary', {
                                                        stadiumName:this.stadiumName,
                                                        stadiumAddress:this.stadiumAddress,
                                                        city : this.city,
                                                        Day:this.state.rentDate,
                                                        StartHour: program.StartHour,
                                                        EndHour:program.EndHour,
                                                        rentDay: this.state.rentDay,
                                                        rentMonth: this.state.rentMonth,
                                                        rentYear: this.state.rentYear,
                                                        IdResponsible: this.IdResponsible,
                                                        IdStaduim: this.IdStaduim,
                                                        idProgram: program.id,
                                                    })}>
                                                    <Text style={{textAlign: 'center', fontSize:20, marginTop: 5}}>Reserve</Text>
                                                </TouchableOpacity>
                                        }
                                    </View>
                                )
                            })
                            :
                            this.state.Program.length > 0
                                ? this.state.Program.map((program) => {
                                    return (
                                        <View style={styles.cardStyle} key={program.id}>
                                            <View style={styles.infos}>
                                                <View style={styles.feedbacksView}>
                                                    <Text style={styles.HourInfo}>{program.StartHour} -> {program.EndHour}</Text>
                                                    <FontAwesome style={styles.Calendar} name='calendar' size={20} />
                                                    <Text style={styles.HourInfo}>{program.rentDate}</Text>
                                                </View>
                                                <View style={styles.feedbacksView}>
                                                    <Entypo name='location-pin' size={25} />
                                                    <Text style={styles.NameStaduim}>{this.stadiumName}</Text>
                                                </View>
                                            </View>
                                            {
                                                program.reserved ?
                                                    <TouchableOpacity disabled style={styles.ButtonDisable} >
                                                        <Text style={{textAlign: 'center', fontSize:20, marginTop: 5}}>Reserved</Text>
                                                    </TouchableOpacity> :
                                                    <TouchableOpacity style={styles.Button} onPress={() =>
                                                        this.props.navigation.navigate('Order_Summary', {
                                                            stadiumName:this.stadiumName,
                                                            stadiumAddress:this.stadiumAddress,
                                                            city : this.city,
                                                            Day:this.state.rentDate,
                                                            StartHour: program.StartHour,
                                                            EndHour:program.EndHour,
                                                            rentDay: this.state.rentDay,
                                                            rentMonth: this.state.rentMonth,
                                                            rentYear: this.state.rentYear,
                                                            IdResponsible: this.IdResponsible,
                                                            IdStaduim: this.IdStaduim,
                                                            idProgram: program.id,
                                                        })}>
                                                        <Text style={{textAlign: 'center', fontSize:20, marginTop: 5}}>Reserve</Text>
                                                    </TouchableOpacity>
                                            }
                                        </View>
                                    )
                                }) :
                            <View style={styles.noOrders}><Text>Empty</Text>
                        </View>
                }

            </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
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
    Button:{
        height:40,
        width:100,
        borderRadius: 50,
        marginTop:9,
        marginRight:2,
        backgroundColor: '#fff',
    },
    ButtonDisable:{
        height:40,
        width:100,
        borderRadius: 50,
        marginTop:9,
        marginRight:2,
        backgroundColor: '#ff0404',
        opacity: 0.5
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
