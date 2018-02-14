import React, { Component } from 'react';
import { Text, View, Modal, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import { storage } from '../../utils/storageKeysEnum';
import styles from './Styles';

export default class SecurityCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codeError: false,
            securityCode: null,
            typedSecurityCode: null,
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = async () => {
        const securityCode = await AsyncStorage.getItem(storage.SECURITY_CODE);
        if (securityCode) {
            this.setState({ securityCode });
        }
    }

    onType = (typedSecurityCode) => {
        this.setState({ typedSecurityCode });
    }

    assertCode = () => {
        if (this.state.securityCode === this.state.typedSecurityCode) {
            this.props.codeAsserted();
        }
    }

    render() {
        return(
            <View animationType={'slide'} onRequestClose={this.props.close} >
                <View style={styles.container}>
                    <View style={styles.box}>
                        <Text style={styles.title}>Código de seguridad</Text>
                        <Text>{this.props.remainingSeconds}</Text>
                        <Text>{this.state.activeTime}</Text>
                        <TextInput
                                style={[styles.input, this.state.codeError ? styles.inputError : {}]}
                                autoCapitalize='none'
                                autoFocus={true}
                                placeholder="Escriba aquí"
                                spellCheck={false}
                                keyboardType='number-pad'
                                secureTextEntry={true}
                                maxLength={4}
                                onChangeText={(code) => this.onType(code)}
                                value={this.state.secretCode}
                            />

                        <TouchableOpacity activeOpacity={0.8} style={styles.save} onPress={this.assertCode}>
                            <View><Text style={styles.saveText}>Aceptar</Text></View>
                        </TouchableOpacity>                        
                    </View>
                </View>
          </View>
        );
    }
}