import React, { Component } from 'react';
import { Text, View, Modal, TouchableOpacity, TextInput } from 'react-native';
import { storage } from '../../utils/storageKeysEnum';
import styles from './Styles';

export default class SecurityCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codeError: false,
            securityCode: null
        }
        this.loadData = this.loadData.bind(this);
        this.assertCode = this.assertCode.bind(this);
        this.setCode = this.setCode.bind(this);
    }

    componenDidMount() {
        this.loadData();
    }

    async loadData() {
        const securityCode = await AsyncStorage.getItem(storage.SECURITY_CODE);
        if (securityCode) {
            this.setState({ securityCode });
        }
    }

    setCode(securityCode) {
        this.setState({ securityCode });
    }

    validateName(name) {
        if (code ) {
            this.setState({ nameError: true, name });
        } else {
            this.setState({ nameError: false, name });
        }
    }

    assertCode() {
        this.validateEmail();
        // if (this.state.name !== '' && this.state.email !== '' && !this.state.emailError) {
        //     this.props.save({ name: this.state.name, email: this.state.email, id: this.state.id });
        // }
    }

    render() {
        return(
            <Modal visible={true} animationType={'slide'} onRequestClose={this.props.close} >
                <View style={styles.container}>
                    <View style={styles.box}>
                        <Text style={styles.title}>Código de seguridad</Text>

                        <TextInput
                                style={[styles.input, this.state.codeError ? styles.inputError : {}]}
                                autoCapitalize='none'
                                autoFocus={true}
                                placeholder="Escriba aquí"
                                spellCheck={false}
                                keyboardType='number-pad'
                                secureTextEntry={true}
                                maxLength={4}
                                onChangeText={(code) => this.setCode(code)}
                                value={this.state.secretCode}
                            />

                        <TouchableOpacity activeOpacity={0.8} style={styles.save} onPress={this.assertCode}>
                            <View><Text style={styles.saveText}>Aceptar</Text></View>
                        </TouchableOpacity>                        
                    </View>
                </View>
          </Modal>
        );
    }
}