import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';

import { assets } from '../../assets/assets';
import { appTabsEnum } from '../../utils/appTabsEnum';
import styles from './Styles';

export default class TabBar extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    <TabNavigator.Item
                        selected={this.props.activeTab === appTabsEnum.LANDING}
                        title="Inicio"
                        renderIcon={() => <Image style={styles.tabBarIcon} source={assets.home} />}
                        onPress={() => this.props.onTabSelected(appTabsEnum.LANDING) }>
                            <View />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.props.activeTab === appTabsEnum.EMERGENCY_CONTACTS}
                        title="Contactos"
                        renderIcon={() => <Image style={styles.tabBarIcon} source={assets.user} />}
                        onPress={() => this.props.onTabSelected(appTabsEnum.EMERGENCY_CONTACTS) }>
                            <View />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.props.activeTab === appTabsEnum.SETTINGS}
                        title="Configuracion"
                        renderIcon={() => <Image style={styles.tabBarIcon} source={assets.cogs} />}
                        onPress={() => this.props.onTabSelected(appTabsEnum.SETTINGS) }>
                            <View />
                    </TabNavigator.Item>
                </TabNavigator>
            </View>
        );
    }
}