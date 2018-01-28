import React, { Component } from 'react';
import { NativeEventEmitter, Text, View, Button, AppState } from 'react-native';
import * as mailService from './../mail_service/mailService';

import Header from './Header/Header';
import TabBar from './TabBar/TabBar';

import * as notiService from '../utils/notificationService';
import { Bluetooth } from '../utils/bluetooth/bluetooth';
import { appTabsEnum } from '../utils/appTabsEnum';

import styles from './Styles';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      carConnectionStatus: false,
      activeTab: appTabsEnum.HOME
    };
    this.bluetooth = null;
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.onBluetoothConectionStateChange = this.onBluetoothConectionStateChange.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.bluetooth = new Bluetooth();
    this.bluetooth.addListener('connectionStatusChange', this.onBluetoothConectionStateChange);
    // this.bluetooth.init();
    notiService.init(this.onPushNotification.bind(this));
  }

  onBluetoothConectionStateChange(data) {
    this.setState({ carConnectionStatus: data.carConnectionStatus });
  }

  onPushNotification(noti) {
    console.log(`onPushNotification fired ${JSON.stringify(noti)}`);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.bluetooth.removeListeners();
  }

  handleAppStateChange(appState) {
    if(appState === 'background') {
      notiService.scheduleNotification('${NotificationMessage}', new Date(Date.now() + (3 * 1000)));
    }
  }

  // handleSendMail() {
  //   const mailList = [
  //     {
  //       to: {
  //         name: 'NOMBRE CONTACTO EMERGENCIA',
  //         mail: 'sebastiangon11@gmail.com'
  //       },
  //       from: {
  //         name: 'NOMBRE DEL USER DE APP'
  //       }
  //     }
  //   ];
  //   mailService.sendMail(mailList);
  // }
  
  render() {
    return (
      <View style={styles.container}>
        <Header carConnectionStatus={this.state.carConnectionStatus} />
        <View style={styles.body}>
        </View>
        <View>
          <Text>{this.state.activeTab}</Text>
        </View>
        {/* <Button title="send mail" onPress={this.handleSendMail} /> */}
        <TabBar activeTab={this.state.activeTab} />
      </View>
    );
  }
}

