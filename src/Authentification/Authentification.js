import React from 'react'
import {Text, View, Animated, StyleSheet, Image, TextInput, TouchableOpacity, Alert} from 'react-native'
import StickyParallaxHeader from 'react-native-sticky-parallax-header'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { SocialIcon } from 'react-native-elements'
import Login from "./Login";
import Register from "./Register";


export default class Authentification extends React.Component{
    state = {
        scroll: new Animated.Value(0),
        email: "",
        username: "",
        password: "",
    };

    componentDidMount() {
        const { scroll } = this.state;
        scroll.addListener(({ value }) => (this._value = value))
    }
    handleEmail(value){
        this.setState({email: value})
    };
    handlePassword(value){
        this.setState({password: value})
    };
    LoginRenderContent = () => (
        <Login/>
    );
    RegisterRenderContent = () => (
        <Register/>
    );

    renderForeground = () => {
        const { scroll } = this.state;
        const titleOpacity = scroll.interpolate({
            inputRange: [0, 106, 154],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp'
        });

        return (
            <View style={styles.foreground}>
                <Animated.View style={{ opacity: titleOpacity }}>
                    <Image style={styles.imageAuth} source={require('../../assets/Images/authImage.png')} />
                </Animated.View>
            </View>
        )
    };

    renderHeader = () => {
        const { scroll } = this.state;
        const opacity = scroll.interpolate({
            inputRange: [0, 160, 210],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp'
        });

        return (
            <View style={styles.headerWrapper}>
                <Animated.View style={{opacity}}/>
            </View>
        )
    };

    render() {
        const { scroll } = this.state;
        const Tabs = [
            {
                title: 'Login',
                content: this.LoginRenderContent()
            },
            {
                title: 'Register',
                content: this.RegisterRenderContent()
            },
        ];

        return (
            <View style={styles.container}>
                <StickyParallaxHeader
                    foreground={this.renderForeground()}
                    header={this.renderHeader()}
                    parallaxHeight={170}
                    headerHeight={0}
                    headerSize={() => {}}
                    onEndReached={() => {}}
                    scrollEvent={Animated.event([{ nativeEvent: { contentOffset: { y: scroll } } }])}
                    tabs={Tabs}
                    tabTextStyle={styles.tabText}
                    tabTextContainerStyle={styles.tabTextContainerStyle}
                    tabTextContainerActiveStyle={styles.tabTextContainerActiveStyle}
                    tabsContainerBackgroundColor={'white'}
                    tabsWrapperStyle={styles.tabsWrapper}
                >
                </StickyParallaxHeader>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    },
    content: {
        flexDirection: 'column',
        //backgroundColor: '#000',
        //height: 600,
        justifyContent: 'space-between',
    },
    foreground: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    message: {
        color: '#000',
        fontSize: 40,
        paddingTop: 24,
        paddingBottom: 7
    },
    headerWrapper: {
        backgroundColor: 'red',
        width: '100%',
        paddingHorizontal: 24,
        paddingBottom: 25,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 16,
        color: '#000',
        margin: 12
    },
    tabsWrapper: {
        paddingVertical: 12
    },
    tabTextContainerStyle: {
        backgroundColor: 'transparent',
        //borderRadius: 18,
        width: 170
    },
    tabTextContainerActiveStyle: {
        borderColor: "#0aa4ff",
        borderBottomWidth: 4,

    },
    tabText: {
        fontSize: 16,
        lineHeight: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        color: '#000'
    },
    imageAuth: {
        width: '90%',
        height: 150,
        alignSelf: 'center',
    },
    input: {
        height: 40,
        fontSize: 16,
    },
    inputs: {
        marginTop: 15,
        width: '90%',
        alignSelf: 'center',
        marginBottom: 40
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
    buttonSubmit: {
        backgroundColor: "#5780D9",
        paddingLeft: 12,
        paddingRight: 12,
        width: '90%',
        height: 50,
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 40
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
        marginBottom: 40
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
        marginBottom: 40
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
        opacity: 0.3
    }
});
