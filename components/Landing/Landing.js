import React, { Component } from 'react';
import { Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { carConnectionStatusEnum } from '../../utils/carConnectionStatusEnum';

import { assets } from '../../assets/assets';
import styles from './Styles';

export default class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderConnectingCarIndicator() {
        if (this.props.carConnectionStatus === carConnectionStatusEnum.CONNECTING) {
            return (
                <View style={styles.contingency}>
                    <Text style={{ marginRight: 5 }}>Connecting car</Text><ActivityIndicator size="small" color="#00ff00" />
                </View>
            );
        }
        return null;
    }

    render() {
        return(
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={0.8} style={styles.landingBtn} onPress={this.setGarage} >
                    <View><Text style={styles.garageButtonText}>Activar seguridad</Text></View>
                </TouchableOpacity>
                <View style={styles.connectionIndicators}>
                    <View style={styles.imageFrame}>
                        <Image style={styles.image} source={this.props.carConnectionStatus === carConnectionStatusEnum.CONNECTED ? assets.carCheck : assets.car} />
                        <ActivityIndicator style={styles.loading} size="large" color="#fff" />
                    </View>
                    <View style={styles.imageFrame}>
                        <Image style={styles.image} source={assets.home} />
                        <ActivityIndicator style={styles.loading} size="large" color="#fff" />
                    </View>
                </View>
                {/* {this.renderConnectingCarIndicator()} */}
            </View>
        );
    }
}