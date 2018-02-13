import React, { Component } from 'react';
import { Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { connectionStatusEnum } from '../../utils/connectionStatusEnum';

import { assets } from '../../assets/assets';
import styles from './Styles';

export default class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getCarIconSource = () => {
        switch(this.props.carConnectionStatus) {
            case connectionStatusEnum.STOPPED:
                return assets.carCross;
            case connectionStatusEnum.CONNECTING:
                return assets.car;
            case connectionStatusEnum.CONNECTED:
                return assets.carCheck;
            default:
                return null;
        }
    }

    getHouseIconSource = () => {
        switch(this.props.garageConnectionStatus) {
            case connectionStatusEnum.STOPPED:
                return assets.homeCross;
            case connectionStatusEnum.CONNECTING:
                return assets.home;
            case connectionStatusEnum.CONNECTED:
                return assets.homeCheck;
            default:
                return null;
        }
    }

    render() {
        const { carConnectionStatus, garageConnectionStatus } = this.props;

        return(
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={0.8} style={styles.landingBtn} onPress={this.props.startSequence} >
                    <View><Text style={styles.landingBtnText}>{this.props.startSequenceEnabled ? 'Activar seguridad' : 'Seguridad iniciada'}</Text></View>
                </TouchableOpacity>
                <View style={styles.connectionIndicators}>
                    <View style={styles.imageFrame}>
                        <Image style={styles.image} source={this.getCarIconSource()} />
                        { carConnectionStatus === connectionStatusEnum.CONNECTING && <ActivityIndicator style={styles.loading} size="large" color="#fff" />}
                    </View>
                    <View style={styles.imageFrame}>
                        <Image style={styles.image} source={this.getHouseIconSource()} />
                        { garageConnectionStatus === connectionStatusEnum.CONNECTING && <ActivityIndicator style={styles.loading} size="large" color="#fff" />}
                    </View>
                </View>
            </View>
        );
    }
}