import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';

import { storage } from '../../utils/storageKeysEnum';
import styles from './Styles';

export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            garageLocation: null,
            userName: null,
            nameError: false,
            saving: false
        };
        this.saveTimeoutId = null;
        this.saveName = this.saveName.bind(this);
        this.validateName = this.validateName.bind(this);
        this.setGarage = this.setGarage.bind(this);
    }

    componentDidMount() {
        this.loadUserData();
    }

    async loadUserData() {
        const userName = await AsyncStorage.getItem(storage.USER_NAME);
        const garageLocation = await AsyncStorage.getItem(storage.GARAGE_LOCATION);
        if (userName) {
            console.log('username: ', userName.toString());
            this.setState({ userName });
        }
        if (garageLocation) {
            this.setState({ garageLocation });
        }
    }

    setGarage() {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
               const garageLocation = JSON.parse(JSON.stringify(position));
               await AsyncStorage.setItem(storage.GARAGE_LOCATION, JSON.stringify(garageLocation));
               await this.loadUserData();
            },
            (error) => {
                this.setState({ garageLocation: null });
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
         );
     }

     validateName(userName) {
        if (userName === '') {
            this.setState({ nameError: true, userName });
        } else {
            this.setState({ nameError: false, userName, saving: true });
            clearTimeout(this.saveTimeoutId);
            this.saveTimeoutId = setTimeout(() => { this.saveName(userName); }, 700);
        }
    }

    async saveName(userName) {
        await AsyncStorage.setItem(storage.USER_NAME, userName);
        this.setState({ saving: false});
    }

    render() {
        return(
            <View style={styles.container}>
                <Text style={styles.title}>Perfil</Text>
                <View style={styles.separator} />
                <Text style={styles.inputLabel}>Nombre completo</Text>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, this.state.nameError ? styles.inputError : {}]}
                        autoCapitalize='words'
                        placeholder="Ingresa tu nombre"
                        spellCheck={false}
                        onChangeText={(name) => this.validateName(name)}
                        value={this.state.userName}
                    />
                    <ActivityIndicator style={styles.loading} animating={this.state.saving} color="black"/>
                </View>
                <Text style={styles.inputLabel}>Garage</Text>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.garageButton, this.state.garageLocation ? styles.green : {}]}
                    onPress={this.setGarage}
                >
                    <View><Text style={styles.garageButtonText}>Usar ubicación como garaje</Text></View>
                </TouchableOpacity>
                <View style={styles.garageNotSet}>
                    {!this.state.garageLocation && <Text style={styles.garageNotSetText}>No has guardado la ubicación de tu garaje</Text>}
                </View>
            </View>
        );
    }
}