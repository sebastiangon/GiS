import React, { Component } from 'react';
import { Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { connectionStatusEnum } from '../../utils/connectionStatusEnum';
import { Bluetooth } from '../../utils/bluetooth/bluetooth';

import { assets } from '../../assets/assets';
import styles from './Styles';

export default class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            carConnectionStatus: connectionStatusEnum.STOPPED,
            garageConnectionStatus: connectionStatusEnum.STOPPED,
            startSequenceEnabled: true
        };

        this.bluetooth = null;
        this.checkCarConnectionsIntervalId = null;
        this.onBluetoothConectionStateChange = this.onBluetoothConectionStateChange.bind(this);
        this.onUpdateValueForCharacteristic = this.onUpdateValueForCharacteristic.bind(this);

        //Local methods
        this.startSequence = this.startSequence.bind(this);
        this.getCarIconSource = this.getCarIconSource.bind(this);
        this.getHouseIconSource = this.getHouseIconSource.bind(this);
    }

    componentDidMount() {
        this.bluetooth = new Bluetooth();
        this.bluetooth.addListener('connectionStatusChange', this.onBluetoothConectionStateChange);
        this.bluetooth.addListener('updateValueForCharacteristic', this.onUpdateValueForCharacteristic);
    }

    onBluetoothConectionStateChange(data) {
        this.setState({ carConnectionStatus: data.carConnectionStatus });
        if (data.carConnectionStatus === connectionStatusEnum.CONNECTED) {
            this.setState({ garageConnectionStatus: connectionStatusEnum.CONNECTING });
            this.checkCarConnectionsIntervalId = setInterval(() => { this.bluetooth.sendMessageToPeripheral('Check State'); }, 3000); //Comes back in onUpdateValueForCharacteristic 
        } else {
            clearInterval(this.checkCarConnectionsIntervalId);
        }
    }

    onUpdateValueForCharacteristic(data) {
        if (data.garageConnected) {
            this.setState({ garageConnectionStatus: connectionStatusEnum.CONNECTED });
        }
        if (data.lostGarageConnection) {
            this.setState({ garageConnectionStatus: connectionStatusEnum.CONNECTING });
        }
        if (data.garageSearchTimeout) {
            // Tomar accion
        }
    }

    startSequence() {
        if (this.state.startSequenceEnabled) {
            this.bluetooth.init();
            this.setState({ startSequenceEnabled: false });
        }
    }

    componentWillUnmount() {
        this.bluetooth.removeListeners();
    }

    getCarIconSource() {
        switch(this.state.carConnectionStatus) {
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

    getHouseIconSource() {
        switch(this.state.garageConnectionStatus) {
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
        const { carConnectionStatus, garageConnectionStatus } = this.state;

        return(
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={0.8} style={styles.landingBtn} onPress={this.startSequence} >
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