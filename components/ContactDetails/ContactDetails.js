import React, { Component } from 'react';
import { Text, View, Modal, Button, TouchableOpacity, TouchableHighlight, TextInput } from 'react-native';

import styles from './Styles';

export default class AddContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name || '',
            email: props.email || '',
            id: props.id === null ? null : props.id,
            emailError: false,
            nameError: false
        }
    }

    validateEmail = (email) => {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email)){
            this.setState({ emailError: false, email });
        }
        else{
            this.setState({ emailError: true, email });
        }
    }

    validateName = (name) => {
        if (name === '') {
            this.setState({ nameError: true, name });
        } else {
            this.setState({ nameError: false, name });
        }
    }

    save = () => {
        this.validateEmail(this.state.email);
        this.validateName(this.state.name);
        if (this.state.name !== '' && this.state.email !== '' && !this.state.emailError) {
            this.props.save({ name: this.state.name, email: this.state.email, id: this.state.id });
        }
    }

    render() {
        return(
            <Modal visible={true} animationType={'slide'} onRequestClose={this.props.close} >
                <View style={styles.container}>
                    <View style={styles.box}>
                        <Text style={styles.title}>Detalles del contacto</Text>

                        <Text style={styles.inputLabel}>Nombre completo</Text>
                        <TextInput
                            style={[styles.input, this.state.nameError ? styles.inputError : {}]}
                            autoCapitalize='words'
                            placeholder="John Doe"
                            spellCheck={false}
                            onChangeText={(name) => this.validateName(name)}
                            value={this.state.name}
                        />

                        <Text style={styles.inputLabel}>e-Mail</Text>
                        <TextInput
                            style={[styles.input, this.state.emailError ? styles.inputError : {}]}
                            autoCapitalize='none'
                            placeholder="johndoe@example.com"
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