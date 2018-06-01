import React, { Component } from 'react';
import { NativeEventEmitter, Text, View, Button, AppState, AsyncStorage, Alert, Modal } from 'react-native';
import * as mailService from './../mail_service/mailService';
import { Bluetooth } from '../utils/bluetooth/bluetooth';
import { connectionStatusEnum } from '../utils/connectionStatusEnum';
import { storage } from '../utils/storageKeysEnum';

import Header from './Header/Header';
import TabBar from './TabBar/TabBar';
import Landing from './Landing/Landing';
import EmergencyContacts from './EmergencyContacts/EmergencyContacts';
import Settings from './Settings/Settings';
import SecurityCode from './SecurityCode/SecurityCode';

import * as notiService from '../utils/notificationService';
import { appTabsEnum } from '../utils/appTabsEnum';

import styles from './Styles';

const SECURITY_CODE_TIMEOUT = 60; //  Seconds
const GARAGE_SEARCH_TIME = 10000;  //  MiliSeconds
const RADIO_RECONNECTION_TIMEOUT = 10000;  //  MiliSeconds
const GARAGE_SEARCH_KEEP_ALIVE_TIMEOUT = 15000;  //MiliSeconds
const CHECK_BT_CONN_INTERVAL = 3000;  //  MiliSeconds

const initialState = {
  activeTab: appTabsEnum.LANDING,
  carConnectionStatus: connectionStatusEnum.STOPPED,
  garageConnectionStatus: connectionStatusEnum.STOPPED,
  startSequenceEnabled: true,
  promptSecurityCode: false,
  emergencySecondsElapsed: 0
};


export default class App extends Component {
  constructor() {
    super();
    this.state = initialState;
    this.securityCodeCountdownId = null;

    // Radio flags
    this.garageSearchTimeoutId = null;
    this.garageSearchKeepAliveTimeoutId = null;
    this.lostRadioConnectionTimeoutId = null;

    this.bluetooth = null;
    this.checkCarConnectionsIntervalId = null;
  }

  componentDidMount() {
    // AsyncStorage.clear();
    this.bluetooth = new Bluetooth(this.onBluetoothConectionStateChange, this.receiveBluetoothMessage);
    notiService.init(this.onPushNotification.bind(this));
  }

  onBluetoothConectionStateChange = (data) => {
    this.setState({ carConnectionStatus: data.carConnectionStatus });
    if (data.carConnectionStatus === connectionStatusEnum.CONNECTED) {
      this.setState({ garageConnectionStatus: connectionStatusEnum.CONNECTING });
      clearInterval(this.garageSearchTimeoutId);
      this.garageSearchTimeoutId = setTimeout(this.handleSearchGarageTimeout, GARAGE_SEARCH_TIME);
      clearInterval(this.checkCarConnectionsIntervalId);
      this.checkCarConnectionsIntervalId = setInterval(() => { this.bluetooth.sendMessageToPeripheral('Check State'); }, CHECK_BT_CONN_INTERVAL); //Comes back in onUpdateValueForCharacteristic 
    } else {
      clearInterval(this.checkCarConnectionsIntervalId); this.checkCarConnectionsIntervalId = null;
      clearInterval(this.garageSearchTimeoutId);
      if (data.carConnectionStatus === connectionStatusEnum.DISCONNECTED) {
        this.startEmergencyCountdown();
      } else if (data.carConnectionStatus === connectionStatusEnum.STOPPED) {
        this.setState({ startSequenceEnabled: true })
      }
    }
  }

  receiveBluetoothMessage = (data) => {
    console.log(`GiS: receiveBluetoothMessage - ${data.rfConnected} - ${data.madeRadioContact}`);
    if (data.rfConnected) {
      clearTimeout(this.lostRadioConnectionTimeoutId); this.lostRadioConnectionTimeoutId = null;  //  recover radio connection.
      clearTimeout(this.garageSearchTimeoutId);  //  Stop searching garage
      this.setState({ garageConnectionStatus: connectionStatusEnum.CONNECTED });
      this.stopEmergencyCountdown();
    } else if (data.madeRadioContact) { //  If NOT connected but madeRadioConntact, we have lost the connection
      clearTimeout(this.garageSearchTimeoutId);  //  Stop searching garage, just in case rfConnected was not reset in the car's arduino
      if (!this.lostRadioConnectionTimeoutId) {
        this.setState({ garageConnectionStatus: connectionStatusEnum.CONNECTING });
        this.lostRadioConnectionTimeoutId = setTimeout(this.startEmergencyCountdown, RADIO_RECONNECTION_TIMEOUT);  //  Wait 10 seconds for reconnection, else startEmergency
      }
    }
  }

  handleSearchGarageTimeout = () => {
    this.pushNotif('¿Todavía estás en camino a casa ?');
    Alert.alert('Hey !', '¿ Aún estas en camino ? (15s)', [{ text: 'Si', onPress: this.restartGarageSearch }], { cancelable: false });
    this.garageSearchKeepAliveTimeoutId = setTimeout(this.startEmergencyCountdown, GARAGE_SEARCH_KEEP_ALIVE_TIMEOUT); //  Si no responde en ese tiempo...
  }

  restartGarageSearch = () => {
    clearTimeout(this.garageSearchKeepAliveTimeoutId);
    this.garageSearchTimeoutId = setTimeout(this.handleSearchGarageTimeout, GARAGE_SEARCH_TIME);  //  Restart garage search time
  }

  startEmergencyCountdown = () => {
    this.state.emergencySecondsElapsed = 0;
    clearInterval(this.securityCodeCountdownId); this.securityCodeCountdownId = null;
    if (!this.securityCodeCountdownId) {
      this.securityCodeCountdownId = setInterval(this.emergencyMail, 1000);
    }
    this.setState({ promptSecurityCode: true });
  }

  stopEmergencyCountdown = () => {
    this.state.emergencySecondsElapsed = 0;
    clearInterval(this.securityCodeCountdownId); this.securityCodeCountdownId = null;
    this.setState({ promptSecurityCode: false });
  }

  emergencyMail = () => {
    this.setState({ emergencySecondsElapsed: this.state.emergencySecondsElapsed += 1 });
    if (this.state.emergencySecondsElapsed >= SECURITY_CODE_TIMEOUT) {
      this.handleSendMails();
      this.stopEmergencyCountdown();
      this.finishSequence();
    }
  }

  startSequence = () => {
    this.bluetooth.init();
    this.setState({ startSequenceEnabled: false });
  }

  finishSequence = () => {
    clearInterval(this.checkCarConnectionsIntervalId); this.checkCarConnectionsIntervalId = null;
    this.bluetooth.finish();
    this.setState({ ...initialState });
  }

  onCodeAsserted = () => {
    this.stopEmergencyCountdown();
    this.finishSequence();
  }

  onCodeMaxTriesExeded = () => {
    this.stopEmergencyCountdown();
    this.finishSequence();
    this.handleSendMails();
  }

  onPushNotification = (noti) => {
    console.log(`onPushNotification touched ${JSON.stringify(noti)}`);
  }

  pushNotif = (message) => {
    notiService.scheduleNotification(message, new Date(Date.now()));
  }

  handleSendMails = async () => {
    const emergencyContacts = await AsyncStorage.getItem(storage.EMERGENCY_CONTACTS);
    const userName = await AsyncStorage.getItem(storage.USER_NAME);
    if (emergencyContacts && userName) {
      const contacts = JSON.parse(emergencyContacts);
      mailService.sendMail(this.buildEmailList(contacts, userName));
    }
  }

  buildEmailList = (contacts, userName) => {
    return contacts.map((contact) => {
      return {
        to: {
          name: contact.name,
          mail: contact.email
        },
        from: {
          name: userName
        }
      }
    })
  }

  setActiveTab = (activeTab) => {
    this.setState({ activeTab });
  }

  renderTab = (tab) => {
    switch (tab) {
      case (appTabsEnum.EMERGENCY_CONTACTS):
        return <EmergencyContacts />;
      case (appTabsEnum.LANDING):
        return <Landing
          carConnectionStatus={this.state.carConnectionStatus}
          garageConnectionStatus={this.state.garageConnectionStatus}
          startSequenceEnabled={this.state.startSequenceEnabled}
          startSequence={this.startSequence}
        />;
      case (appTabsEnum.SETTINGS):
        return <Settings />;
      default:
        return 'INVALID_TAB_VALUE';
    }
  }

  render() {
    if (this.state.promptSecurityCode) {
      return (<SecurityCode codeMaxTriesExeded={this.onCodeMaxTriesExeded} remainingSeconds={SECURITY_CODE_TIMEOUT - this.state.emergencySecondsElapsed} codeAsserted={this.onCodeAsserted} />);
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

