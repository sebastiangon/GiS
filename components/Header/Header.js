import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';

import styles from './Styles';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return(
            <View>
                <View style={styles.header}>
                    <View>
                        {
                            (this.props.carConnected) ?
                                <Image
                                    style={{ width: 50, height: 50, marginLeft: 5 }}
                                    source={require(`../../assets/car-check.png`)}
                                />
                                :
                                <Image
                                    style={{ width: 50, height: 50, marginLeft: 5 }}
                                    source={require(`../../assets/car-cross.png`)}
                                />
                        }
                    </View>
                </View>
                {
                    this.state.lostConnectionTime > 0 &&
                    <View style={styles.contingency}>
                        <Text style={{ marginRight: 5 }}>reconnecting</Text><ActivityIndicator size="small" color="#00ff00" />
                    </View>
                }
            </View>
        );
    }
}