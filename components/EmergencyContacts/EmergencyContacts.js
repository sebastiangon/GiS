import React, { Component } from 'react';
import { Text, View } from 'react-native';

import styles from './Styles';

export default class EmergencyContacts extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return(
            <View>
                <Text>EmergencyContacts component</Text>
            </View>
        );
    }
}