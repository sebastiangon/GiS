import React, { Component } from 'react';
import { NativeEventEmitter, Text, View, Button, AppState, AsyncStorage, Alert } from 'react-native';
import * as mailService from './../mail_service/mailService';
import { Bluetooth } from '../utils/bluetooth/bluetooth';
import { connectionStatusEnum } from '../utils/connectionStatusEnum';

import Header from './Header/Header';
import TabBar from './TabBar/TabBar';
import Landing from './Landing/Landing';
import EmergencyContacts from './EmergencyContacts/EmergencyContacts';
import Settings from './Settings/Settings';

import * as notiService from '../utils/notificationService';
import { appTabsEnum } from '../utils/appTabsEnum';

import styles from './Styles';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: appTabsEnum.LANDING,
      carConnectionStatus: connectionStatusEnum.STOPPED,
      garageConnectionStatus: connectionStatusEnum.STOPPED,
      startSequenceEnabled: true
    };
    this.lostGarageConnectionFired = false;
    this.bluetooth = null;
    this.checkCarConnectionsIntervalId = null;
    this.onBluetoothConectionStateChange = this.onBluetoothConectionStateChange.bind(this);
    this.onUpdateValueForCharacteristic = this.onUpdateValueForCharacteristic.bind(this);

    this.setActiveTab = this.setActiveTab.bind(this);
    // this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.startSequence = this.startSequence.bind(this);    
  }

  componentDidMount() {
    // AsyncStorage.clear();
    this.bluetooth = new Bluetooth();
    this.bluetooth.addListener('connectionStatusChange', this.onBluetoothConectionStateChange);
    this.bluetooth.addListener('updateValueForCharacteristic', this.onUpdateValueForCharacteristic);
    // AppState.addEventListener('change', this.handleAppStateChange);
    notiService.init(this.onPushNotification.bind(this));
  }

  onBluetoothConectionStateChange(data) {
      this.setState({ carConnectionStatus: data.carConnectionStatus });
      if (data.carConnectionStatus === connectionStatusEnum.CONNECTED) {
          this.setState({ garageConnectionStatus: connectionStatusEnum.CONNECTING });
          this.checkCarConnectionsIntervalId = setInterval(() => { this.bluetooth.sendMessageToPeripheral('Check State'); }, 3000); //Comes back in onUpdateValueForCharacteristic 
      } else {
          clearInterval(this.checkCarConnectionsIntervalId);
      }
  }

  onUpdateValueForCharacteristic(data) {
      if (data.garageConnected) {
          this.setState({ garageConnectionStatus: connectionStatusEnum.CONNECTED });
      }
      if (data.lostGarageConnection) {
          //  Fired after all the retries set in arduino sketch
          this.setState({ garageConnectionStatus: connectionStatusEnum.STOPPED });
          if (!this.lostGarageConnectionFired) {
            this.lostGarageConnectionFired = true;
            Alert.alert('lost garage connection');
            //  Do magic
          }
      }
      if (data.garageSearchTimeout) {
          this.pushNotif('¿Todavía estas en camino a casa ?');
          Alert.alert(
            'Hey !',
            '¿Todavía estas en camino a casa ?',
            [
              {text: 'No', onPress: () => console.warn('Not implemented') },
              {text: 'Si', onPress: () => console.warn('Not implemented')},
            ],
            { cancelable: false }
          )
      }
  }

  startSequence() {
      if (this.state.startSequenceEnabled) {
          this.bluetooth.init();
          this.setState({ startSequenceEnabled: false });
      }
  }

  onPushNotification(noti) {
    console.log(`onPushNotification touched ${JSON.stringify(noti)}`);
  }

  pushNotif(message) {
    notiService.scheduleNotification(message, new Date(Date.now()));
  }

  // handleAppStateChange(appState) {
  //   if(appState === 'background') {
  //     notiService.scheduleNotification('${NotificationMessage}', new Date(Date.now() + (3 * 1000)));
  //   }
  // }

  // handleSendMail() {
  //   const mailList = [{ to: { name: 'NOMBRE CONTACTO EMERGENCIA', mail: 'sebastiangon11@gmail.com' }, from: { name: 'NOMBRE DEL USER DE APP' } } ];
  //   mailService.sendMail(mailList);
  // }

  setActiveTab(activeTab) {
    this.setState({ activeTab });
  }

  renderTab(tab) {
    switch(tab){
      case(appTabsEnum.EMERGENCY_CONTACTS):
        return <EmergencyContacts />;
      case(appTabsEnum.LANDING):
        return <Landing 
          carConnectionStatus = {this.state.carConnectionStatus}
          garageConnectionStatus = {this.state.garageConnectionStatus}
          startSequenceEnabled = {this.state.startSequenceEnabled}
          startSequence = {this.startSequence}
        />;
      case(appTabsEnum.SETTINGS):
        return <Settings />;
      default:
        return 'INVALID_TAB_VALUE';
    }
  }

  componentWillUnmount() {
    this.bluetooth.removeListeners();
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.activeTabContainer}>
          {this.renderTab(this.state.activeTab)}
        </View>
        <TabBar onTabSelected={this.setActiveTab} activeTab={this.state.activeTab} />
      </View>
    );
  }
}

