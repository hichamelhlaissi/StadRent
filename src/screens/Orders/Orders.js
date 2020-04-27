import * as React from 'react';
import {ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {APPROX_STATUSBAR_HEIGHT} from "react-native-paper/src/constants";
import HistoryRoute from "./HistoryRoute";
import RequestRoute, {IsOrderValid} from "./RequestRoute";
import ScheduledRoute from "./ScheduledRoute";
import {db} from "../../services/FireBaseConfig";

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

export default class Orders extends React.Component {
    constructor(props){
        super(props);
        const {state} = props.navigation;
        this.state = {
            index: 0,
            isLoading:true,
            routes: [
                { key: 'history', title: 'History' },
                { key: 'scheduled', title: 'Scheduled' },
                { key: 'request', title: 'Request' },
            ],
        };
    }
    componentDidMount() {

        IsOrderValid();

        this.setState({isLoading:false});


    }


    _handleIndexChange = index => this.setState({ index });

    _renderHeader = props => <TabBar style={styles.tabBar} {...props} />;

    // _renderScene = SceneMap({
    //     history: HistoryRoute,
    //     scheduled: ScheduledRoute,
    //     request: RequestRoute,
    // });
    renderScene = ({ route }) => {
        const {NavData} = this.props.navigation;
        switch (route.key) {
            case 'history':
                return <HistoryRoute data={NavData} />;
            case 'scheduled':
                return <ScheduledRoute data={NavData} />;
            case 'request':
                return <RequestRoute data={NavData} />;
            default:
                return null;
        }
    };
    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator size={50}/>
                </View>
            );
        }

        return (
                <TabView
                navigationState={this.state}
                renderScene={this.renderScene}
                renderTabBar={this._renderHeader}
                onIndexChange={this._handleIndexChange}
                initialLayout={initialLayout}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    infos: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 15,
        height: 100,
    },
    tabBar: {
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
    name: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
        marginLeft: 15
    },
    date: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 15
    },
    fromTo: {
        flexDirection: 'row',

        width: 200,
        marginLeft: 15
    },
    fromToText: {
        color: '#fff',
        fontSize: 14,
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
});
