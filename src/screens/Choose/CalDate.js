import React, {useState} from 'react';
import {View, Button, Platform} from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Hour from "./Hour";

const App = () => {
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
                    maximumDate={new Date(2020, 3, 14)}
                    minimumDate={new Date(2020, 3, 8)}
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}



        </View>
    );
};
export default App;
