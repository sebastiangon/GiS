import React, { Component } from 'react';
import { Text, View, KeyboardAvoidingView, Button, ScrollView, TextInput, TouchableOpacity, AsyncStorage, Keyboard } from 'react-native';

import { storage } from '../../utils/storageKeysEnum';
import styles from './Styles';

export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            garageLocation: null,
            userName: null,
            securityCode: null,
            verificationCode: null,
            nameError: false,
            codeError: false,
            verificationCodeError: false,
        };
    }

    componentDidMount() {
        this.loadUserData();
    }

    loadUserData = async () => {
        const userName = await AsyncStorage.getItem(storage.USER_NAME);
        const garageLocation = await AsyncStorage.getItem(storage.GARAGE_LOCATION);
        const securityCode = await AsyncStorage.getItem(storage.SECURITY_CODE);
        if (userName) {
            this.setState({ userName });
        }
        if (garageLocation) {
            this.setState({ garageLocation: JSON.parse(garageLocation) });
        }
        if (securityCode) {
            this.setState({ securityCode, verificationCode: securityCode });
        }
    }

    setGarage = () => {
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

     validateName = (userName) => {
        if (userName === '') {
            this.setState({ nameError: true, userName });
        } else {
            this.setState({ nameError: false, userName });
        }
    }

    validateCode = (securityCode) => {
        if (securityCode.length !== 4) {
            this.setState({ codeError: true, securityCode });
        } else {
            this.setState({ codeError: false, securityCode });
        }
        this.validateConfirmationCode(this.state.verificationCode);
    }

    validateConfirmationCode = (verificationCode) => {
        if (verificationCode !== this.state.securityCode) {
            this.setState({ verificationCodeError: true, verificationCode });
        } else {
            this.setState({ verificationCodeError: false, verificationCode });
        }
    }

    save = async () => {
        Keyboard.dismiss();
        if (!this.state.nameError && !this.state.codeError && !this.state.verificationCodeError) {
            if (this.state.userName) {
                await AsyncStorage.setItem(storage.USER_NAME, this.state.userName);
            }
            if (this.state.securityCode) {
                await AsyncStorage.setItem(storage.SECURITY_CODE, this.state.securityCode);
            }
        }
    }

    render() {
        return(
            <KeyboardAvoidingView
                style={styles.container}
                behavior="position"
                keyboardVerticalOffset={-50}
            >
            <View >
                    <ScrollView>
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
                        <View style={styles.separator} />
                        </View>
                        <View style={styles.separator} />                
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
                        <Text style={styles.coordinates}>
                            {this.state.garageLocation &&
                                `${this.state.garageLocation.coords.latitude.toString()} - ${this.state.garageLocation.coords.longitude.toString()}`
                            }
                        </Text>
                        <View style={styles.separator} />
                        <Text style={styles.inputLabel}>Código de seguridad</Text>
                        <View>
                            <TextInput
                                style={[styles.input, this.state.codeError ? styles.inputError : {}]}
                                autoCapitalize='none'
                                placeholder="Ingrese un código de 4 números"
                                spellCheck={false}
                                keyboardType='number-pad'
                                // secureTextEntry={true}
                                maxLength={4}
                                value={this.state.securityCode}
                                onChangeText={(code) => this.validateCode(code)}
                            />
                            <TextInput
                                placeholder="Repita el código"
                                style={[styles.input, this.state.verificationCodeError ? styles.inputError : {}]}
                                autoCapitalize='none'
                                spellCheck={false}
                                keyboardType='number-pad'
                                // secureTextEntry={true}
                                maxLength={4}
                                value={this.state.verificationCode}
                                onChangeText={(code) => this.validateConfirmationCode(code)}
                            />
                        </View>
                        <Button title="Guardar" onPress={this.save} />
                    </ScrollView>
            </View>
                </KeyboardAvoidingView>
        );
    }
}