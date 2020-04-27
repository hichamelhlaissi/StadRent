import React, {useState} from 'react';
import {View, Button, Platform, Text} from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {Calendar} from "react-native-calendars";
import moment from "moment";

// let today = new Date();

// function minDate() {
//     if ((parseInt(today.getMonth()+1) < 10) && (today.getDate() < 10)) {
//         return today.getFullYear() + "-"+ "0"+parseInt(today.getMonth()+1) +"-"+  "0"+parseInt(today.getDate());
//     }
//     if ((parseInt(today.getMonth()+1) < 10) && (today.getDate() > 10)) {
//         return  today.getFullYear() + "-"+ "0"+parseInt(today.getMonth()+1) +"-"+  today.getDate();
//     }
//     if ((parseInt(today.getMonth()+1) > 10) && (today.getDate() < 10)) {
//         return  today.getFullYear() + "-"+ parseInt(today.getMonth()+1) +"0"+parseInt(today.getDate());
//     }
//     if ((parseInt(today.getMonth()+1) >= 10) && (today.getDate() >= 10)) {
//         return  today.getFullYear() + "-"+ parseInt(today.getMonth()+1) +"-"+  today.getDate();
//     }
// }
function minDate() {
    var chosenWeekday = 1; // Monday

    return  chosenWeekday < moment().weekday() ? moment().weekday(chosenWeekday + 7) : moment().weekday(chosenWeekday)
}
function maxDate() {
    let days = new Date(minDate());
    return new Date(days.setTime( days.getTime() + 6 * 86400000 ));
}

const ScheduleDate = () => {
    let today = new Date();

    const [date, setDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        if (selectedDate !== undefined) {
            console.log(selectedDate);
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
                    maximumDate={maxDate()}
                    minimumDate={new Date(minDate())}
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={new Date(minDate())}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
        </View>
    );
};
export default ScheduleDate;
