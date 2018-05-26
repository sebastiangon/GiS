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
            case connectionStatusEnum.CONNECTING:
                return assets.car;
            case connectionStatusEnum.CONNECTED:
                return assets.carCheck;
            default:
                return assets.carCross;
        }
    }

    getHouseIconSource = () => {
        switch(this.props.garageConnectionStatus) {
            case connectionStatusEnum.CONNECTING:
                return assets.home;
            case connectionStatusEnum.CONNECTED:
                return assets.homeCheck;
            default:
                return assets.homeCross;
        }
    }

    render() {
        const { carConnectionStatus, garageConnectionStatus } = this.props;

        return(
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={0.8} style={this.props.startSequenceEnabled ? styles.landingBtn : styles.landingBtnDis} disabled={!this.props.startSequenceEnabled} onPress={this.props.startSequence}  >
                    <View><Text style={styles.landingBtnText}>Activar seguridad</Text></View>
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