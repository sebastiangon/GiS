import React, { Component } from 'react';
import { Text, View } from 'react-native';

import styles from './Styles';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return(
            <View style={styles.index}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Get in Safe</Text>
                </View>
            </View>
        );
    }
}