import React, { Component } from 'react';
import { Text, View } from 'react-native';

import styles from './Styles';

export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return(
            <View style={styles.scroll}>
                <Text style={[styles.content, styles.first]} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={styles.content} >Settings component</Text>
                <Text style={[styles.content, styles.last]} >Settings component</Text>
            </View>
        );
    }
}