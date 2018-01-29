import React, { Component } from 'react';
import { Text, View, Modal, Button, TouchableOpacity, TouchableHighlight } from 'react-native';

import styles from './Styles';

export default class AddContact extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <Modal visible={this.props.visible} animationType={'slide'} onRequestClose={this.props.close} >
                <View style={styles.container}>
                    <View style={styles.box}>
                        <Text style={styles.title}>Detalles del contacto</Text>
                        <TouchableOpacity activeOpacity={0.8} style={styles.save} onPress={this.props.save}>
                            <View><Text style={styles.saveText}>Guardar</Text></View>
                        </TouchableOpacity>                        
                        <Button onPress={this.props.close} title="Cancelar" />
                    </View>
                </View>
          </Modal>
        );
    }
}