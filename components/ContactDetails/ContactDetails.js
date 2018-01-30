import React, { Component } from 'react';
import { Text, View, Modal, Button, TouchableOpacity, TouchableHighlight, TextInput } from 'react-native';

import styles from './Styles';

export default class AddContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name || '',
            email: props.email || '',
            emailError: false,
            nameError: false
        }
        this.save = this.save.bind(this);
    }

    validateEmail(email) {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email)){
            this.setState({ emailError: false, email });
        }
        else{
            this.setState({ emailError: true, email });
        }
    }

    validateName(name) {
        if (name === '') {
            this.setState({ nameError: true, name });
        } else {
            this.setState({ nameError: false, name });
        }
    }

    save() {
        this.validateEmail(this.state.email);
        this.validateName(this.state.name);
        console.log(`saving: ${this.state.mailError}`)
        if (this.state.name !== '' && this.state.email !== '' && !this.state.emailError) {
            this.props.save();
        }
    }

    render() {
        return(
            <Modal visible={this.props.visible} animationType={'slide'} onRequestClose={this.props.close} >
                <View style={styles.container}>
                    <View style={styles.box}>
                        <Text style={styles.title}>Detalles del contacto</Text>

                        <TextInput
                            style={[styles.input, this.state.nameError ? styles.inputError : {}]}
                            autoCapitalize='words'
                            placeholder="Nombre completo"
                            spellCheck={false}
                            onChangeText={(name) => this.validateName(name)}
                            value={this.state.name}
                        />

                        <TextInput
                            style={[styles.input, this.state.emailError ? styles.inputError : {}]}
                            autoCapitalize='none'
                            placeholder="e-Mail"
                            spellCheck={false}
                            keyboardType='email-address'
                            onChangeText={(email) => this.validateEmail(email)}
                            value={this.state.email}
                        />

                        <TouchableOpacity activeOpacity={0.8} style={styles.save} onPress={this.save}>
                            <View><Text style={styles.saveText}>Guardar</Text></View>
                        </TouchableOpacity>                        
                        <Button onPress={this.props.close} title="Cancelar" />
                    </View>
                </View>
          </Modal>
        );
    }
}