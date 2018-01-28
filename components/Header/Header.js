import React, { Component } from 'react';
import { Text, View, Image, ActivityIndicator } from 'react-native';

import styles from './Styles';
import { assets } from '../../assets/assets';
import { carConnectionStatusEnum } from '../../utils/carConnectionStatusEnum';


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
                            (this.props.carConnectionStatus === carConnectionStatusEnum.CONNECTED) ?
                                <Image
                                    style={{ width: 50, height: 50, marginLeft: 5 }}
                                    source={assets.carCheck}
                                />
                                :
                                <Image
                                    style={{ width: 50, height: 50, marginLeft: 5 }}
                                    source={assets.carCross}
                                />
                        }
                    </View>
                </View>
                {
                    this.props.carConnectionStatus === carConnectionStatusEnum.CONNECTING &&
                    <View style={styles.contingency}>
                        <Text style={{ marginRight: 5 }}>Connecting car</Text><ActivityIndicator size="small" color="#00ff00" />
                    </View>
                }
            </View>
        );
    }
}