import React, { Component } from 'react';
import { NativeEventEmitter, Text, View, Button, AppState, AsyncStorage, Alert, Modal } from 'react-native';
import * as mailService from './../mail_service/mailService';
import { Bluetooth } from '../utils/bluetooth/bluetooth';
import { connectionStatusEnum } from '../utils/connectionStatusEnum';

import Header from './Header/Header';
import TabBar from './TabBar/TabBar';
import Landing from './Landing/Landing';
import EmergencyContacts from './EmergencyContacts/EmergencyContacts';
import Settings from './Settings/Settings';
import SecurityCode from './SecurityCode/SecurityCode';

import * as notiService from '../utils/notificationService';
import { appTabsEnum } from '../utils/appTabsEnum';

import styles from './Styles';

const SECURITY_CODE_TIMEOUT = 3*60; //  Seconds

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: appTabsEnum.LANDING,
      carConnectionStatus: connectionStatusEnum.STOPPED,
      garageConnectionStatus: connectionStatusEnum.STOPPED,
      startSequenceEnabled: true,
      promptSecurityCode: false,
      emergencySecondsElapsed: 0
    };
    this.securityCodeCountdownId = null;
    this.lostGarageConnectionFired = false;
    this.garageSearchTimeoutFired = false;
    this.bluetooth = null;
    this.checkCarConnectionsIntervalId = null;
    this.onBluetoothConectionStateChange = this.onBluetoothConectionStateChange.bind(this);
    this.onUpdateValueForCharacteristic = this.onUpdateValueForCharacteristic.bind(this);

    this.setActiveTab = this.setActiveTab.bind(this);
    // this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.startSequence = this.startSequence.bind(this);
    this.onCodeAsserted = this.onCodeAsserted.bind(this);
    this.startEmergencyCountdown = this.startEmergencyCountdown.bind(this);
    this.stopEmergencyCountdown = this.stopEmergencyCountdown.bind(this);
    this.emergencyMail = this.emergencyMail.bind(this);
  }

  componentDidMount() {
    // AsyncStorage.clear();
    // AppState.addEventListener('change', this.handleAppStateChange);
    this.bluetooth = new Bluetooth();
    this.bluetooth.addListener('connectionStatusChange', this.onBluetoothConectionStateChange);
    this.bluetooth.addListener('updateValueForCharacteristic', this.onUpdateValueForCharacteristic);
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
          this.lostGarageConnectionFired = false;
          this.garageSearchTimeoutFired = false;
          thisl.stopEmergencyCountdown();
      }
      if (data.lostGarageConnection) {
          //  Fired after all the retries set in arduino sketch, no reconnection, display code, generate countdown to emergency mails
          this.setState({ garageConnectionStatus: connectionStatusEnum.STOPPED });
          if (!this.lostGarageConnectionFired) {
            this.lostGarageConnectionFired = true;
            this.pushNotif('Introduce tu código');
            this.startEMergencyCountdown();
          }
      }
      if (data.garageSearchTimeout) {
        if (!this.garageSearchTimeoutFired) {
          this.garageSearchTimeoutFired = true;
          this.pushNotif('¿Todavía estas en camino a casa ?');
          Alert.alert(
            'Hey !',
            '¿Todavía estas en camino a casa ?',
            [
              {text: 'No', onPress: this.startEmergencyCountdown },
              {text: 'Si', onPress: () => {} },
            ],
            { cancelable: false }
          )
        }
      }
  }

  startEmergencyCountdown() {
    this.state.emergencySecondsElapsed = 0;
    clearInterval(this.securityCodeCountdownId);
    this.securityCodeCountdownId = setInterval(this.emergencyMail, 1000);
    this.setState({ promptSecurityCode: true });
  }

  stopEmergencyCountdown() {
    this.state.emergencySecondsElapsed = 0;
    clearInterval(this.securityCodeCountdownId);
    this.setState({ promptSecurityCode: false });
  }

  emergencyMail() {
    this.setState({ emergencySecondsElapsed: this.state.emergencySecondsElapsed += 1 });
    if (this.state.emergencySecondsElapsed >= SECURITY_CODE_TIMEOUT) {
      Alert.alert('sendingMails');
      this.stopEmergencyCountdown();
    }
  }

  startSequence() {
      if (this.state.startSequenceEnabled) {
          this.bluetooth.init();
          this.setState({ startSequenceEnabled: false });
      }
  }

  onCodeAsserted() {
    console.log(`propmt`);
    this.setState({ promptSecurityCode: false });
    Alert.alert('Code asserted');
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

  async handleSendMail() {
    const emergencyContacts = await AsyncStorage.getItem(storage.EMERGENCY_CONTACTS);
    const userName = await AsyncStorage.getItem(storage.USER_NAME);
    if (emergencyContacts && userName) {
        const contacts = JSON.parse(emergencyContacts);
        console.log(`Mailing: building contacts list - ${contacts}`);
        mailService.sendMail(contacts);
    }
    // const mailList = [{ to: { name: 'NOMBRE CONTACTO EMERGENCIA', mail: 'sebastiangon11@gmail.com' }, from: { name: 'NOMBRE DEL USER DE APP' } } ];
  }

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
    if (this.state.promptSecurityCode) {
      return (<SecurityCode remainingSeconds={SECURITY_CODE_TIMEOUT - this.state.emergencySecondsElapsed} codeAsserted={this.onCodeAsserted}/>);
    } else {
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
}

