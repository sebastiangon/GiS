import React, { Component } from 'react';
import { Text, View } from 'react-native';

import styles from './Styles';

export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return(
            <View>
                <Text>Setting component</Text>
            </View>
        );
    }
}