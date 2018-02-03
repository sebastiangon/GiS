import React, { Component } from 'react';
import { Text, View, TextInput } from 'react-native';
import MapView from 'react-native-maps';

import styles from './Styles';

export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return(
            <View style={styles.container}>
                <Text style={styles.title}>Perfil</Text>
                <View style={styles.separator} />
                <Text style={styles.inputLabel}>Nombre completo</Text>
                <TextInput
                    style={styles.input}
                    autoCapitalize='words'
                    placeholder="Ingresa tu nombre"
                    spellCheck={false}
                    // onChangeText={(name) => this.validateName(name)}
                    value={this.state.name}
                />
                <Text style={styles.inputLabel}>Ubicacion de garage</Text>
            </View>
        );
    }
}