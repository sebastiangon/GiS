import React, { Component } from 'react';
import { NativeEventEmitter, Text, View, Button, ScrollView, Image, ActivityIndicator, AppState } from 'react-native';

import * as notiService from '../utils/notificationService';
import { Bluetooth } from '../utils/bluetooth/bluetooth';

import styles from './Styles';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      carConnected: false
    };
    this.bluetooth = null;
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.onBluetoothConectionStateChange = this.onBluetoothConectionStateChange.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.bluetooth = new Bluetooth();
    this.bluetooth.addListener('stateChange', this.onBluetoothConectionStateChange);
    this.bluetooth.init();

    notiService.init(this.onPushNotification.bind(this));
  }

  onBluetoothConectionStateChange(data) {
    this.setState({
      carConnected: data.connected
    });
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
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.connectionStatus}>
            {
              (this.state.carConnected) ?
              <Image
                style={{width: 50, height: 50, marginLeft: 5}}
                source={require(`../assets/car-check.png`)}
              />
              :
              <Image
                style={{width: 50, height: 50, marginLeft: 5}}
                source={require(`../assets/car-cross.png`)}
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

