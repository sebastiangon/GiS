import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';

import { assets } from '../../assets/assets';
import styles from './Styles';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'Contactos'
        };
    }
    render() {
        return (
            <View>
                <TabNavigator>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'Contactos'}
                        title="Contactos"
                        renderIcon={() => <Image style={styles.tabBarIcon} source={assets.user} />}
                        onPress={() => this.setState({ selectedTab: 'Contactos' })}>
                            <View />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'Configuracion'}
                        title="Configuracion"
                        renderIcon={() => <Image style={styles.tabBarIcon} source={assets.cogs} />}
                        onPress={() => this.setState({ selectedTab: 'Configuracion' })}>
                            <View />
                    </TabNavigator.Item>
                </TabNavigator>
            </View>
        );
    }
}