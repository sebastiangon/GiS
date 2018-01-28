import React, { Component } from 'react';
import { Text, View } from 'react-native';

import styles from './Styles';

export default class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return(
            <View>
                <Text>Landing component</Text>
            </View>
        );
    }
}