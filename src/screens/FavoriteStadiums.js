import React from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    RefreshControl,
    ScrollView, Image
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import StarRating from "react-native-star-rating";
import {auth, db} from "../services/FireBaseConfig";

export default class FavoriteStadiums extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
            Favorite:[],
            starCount: 3.5,
        };
    };
    onStarRatingPress(rating) {
        this.setState({
            starCount: 3.5
        });
    }
    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            this.setState({ Data:{},isLoading: true });
            this.getFavorite();
        });
        this.getFavorite();
    }

    getFavorite=(Data, Change=()=> this.setState({Favorite:Data}), Set=()=> this.setState({isLoading: false}))=>{
        setTimeout(function () {
            let UserC = auth.currentUser.uid;
            let ref = db.ref("/favoriteStaduim");
            let query = ref.orderByChild("uid").equalTo(UserC);
            query.once("value", function (snapshot) {
                snapshot.forEach(function (child) {
                    Data = snapshot.val();
                    Change();
                });
            }, function (error) {
                if (error) {
                    Alert.alert('Error!!', error);
                } else {
                    console.log('success');

                }
            }).then(r => Set());
        },2000);

    };
    onRefresh() {

        this.setState({ Favorite: [], refreshing:true});
        this.getFavorite();
        setTimeout(function () {
            refreshing();
        },1000);
        const refreshing=()=>{
            this.setState({refreshing:false});
        }
    };
    SoftDeleteFavorite=(IdFavorite)=>{
        this.onRefresh();
        db.ref("favoriteStaduim/"+IdFavorite).update({
            Deleted: 'true',
        }, function (error) {
            if (error) {
                Alert.alert('Error!!', error)
            } else {
                console.log('success');
            }
        })
    };

    CardFavorite=({Favorite: {uid,stadiumName,IdStaduim, IdResponsible, Deleted}, IdFavorite})=>{
        return (
            <View>
                {
                    Deleted === 'false'?
            <View style={styles.cardStyle}>
                <View style={styles.infos}>
                    <Text style={styles.stadiumName}>{stadiumName}</Text>
                    <View style={styles.feedbacksView}>
                        <StarRating
                            disabled={false}
                            maxStars={5}
                            containerStyle={styles.starsView}
                            starSize={17}
                            rating={this.state.starCount}
                            selectedStar={(rating) => this.onStarRatingPress(rating)}
                            fullStarColor={'#1db700'}
                            emptyStarColor={'#1db700'}
                        />
                        <Text style={styles.feedbacksNumber}>(22)</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={()=> this.SoftDeleteFavorite(IdFavorite)}>
                <Icon style={styles.delete} name="closecircleo" size={22} color="#fff" />
                </TouchableOpacity>
            </View> : <View/>
                }
            </View>
        )
    };

    render() {

        let FavoriteKey = Object.keys(this.state.Favorite);

        return (
            <View style={styles.container}>
                <ScrollView refreshControl={
                    <RefreshControl

                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                }>
                {this.state.isLoading ? <View style={styles.isLoading}><Image source={require('../../assets/Images/spinner.gif')}/></View>
                    :
                    FavoriteKey.length > 0
                        ? FavoriteKey.map((key) => {
                            return (
                                <View key={key}>
                                    <this.CardFavorite
                                        Favorite={this.state.Favorite[key]}
                                        IdFavorite={key}
                                    />
                                </View>
                            )
                        })
                        : <View style={styles.noOrders}><Text>Favorite Staduims is empty</Text></View>
                }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    cardStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#5780D9',
        height: 85,
        width: 370,
        marginTop: 10,
        borderRadius: 30/2,
    },
    infos: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 12,
        height: 50,
    },
    stadiumName: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 15
    },
    delete: {
        marginTop: 5,
        marginRight: 7,
    },
    starsView: {
        width: 80,
        marginLeft: 15,
        marginRight: 10,
    },
    feedbacksView: {
        flexDirection: 'row',
    },
    feedbacksNumber: {
        color: '#fff',
        fontSize: 12,
    },
});
