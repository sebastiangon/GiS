import React, { Component } from 'react';
import { stringToBytes, bytesToString } from 'convert-string';
import { NativeModules, NativeEventEmitter, Text, View, Button, ScrollView, Image, ActivityIndicator, AppState } from 'react-native';

import * as notiService from '../utils/notificationService';

import BleManager from 'react-native-ble-manager';
import * as BTConfig from '../utils/bluetooth.config';

import styles from './Styles';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      scanning:false,
      peripheral: null,
      logs: [],
      lostConnectionTime: 0
    }
    this.lostConnectionIntervalId = null;
    this.log = this.log.bind(this);
    this.startScan = this.startScan.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    this.startSync = this.startSync.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    BleManager.start({showAlert: false})
      .then(() => {
        this.log('Bluetooth Module initialized')
        this.startScan(BTConfig.carPeripheralId, BTConfig.scanSeconds);
      });

    this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
    this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
    this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
    this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );

    AppState.addEventListener('change', this.handleAppStateChange);
    
    notiService.init(this.onPushNotification.bind(this));
  }

  onPushNotification(noti) {
    console.log(`onPushNotification fired ${JSON.stringify(noti)}`);
    this.log(`onPushNotification fired ${JSON.stringify(noti)}`);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(appState) {
    if(appState === 'background') {
      let date = new Date(Date.now() + (3 * 1000));

      notiService.scheduleNotification('${NotificationMessage}', date)
    }
  }

  log(text) {
    this.setState({ logs: this.state.logs.concat(text) })
  }

  startScan(carPeripheralId, scanTimeout) {
    if (!this.state.scanning) {
      this.setState({peripheral: null});
      BleManager.scan([], scanTimeout, true).then((results) => {
        this.log('Searching car...');
        this.setState({scanning:true});
      });
    }
  }

  handleDiscoverPeripheral(peripheral) {
    const connectedPeripheral = this.state.peripheral;
    if (peripheral.id === BTConfig.carPeripheralId) {
      this.setState({ peripheral })
      BleManager.stopScan()
        .then(() => { this.handleStopScan() })
        .catch(() => { this.log('Error stopping scanning.') });
    }
  }

  handleStopScan() {
    this.setState({ scanning: false });
    if (this.state.peripheral) {
      this.log('Car found, now synchronizing...');
      this.startSync(this.state.peripheral);
    } else {
      this.log('Not close enought to your car, retrying...');
      this.startScan(BTConfig.carPeripheralId, BTConfig.scanSeconds);
    }
  }

  async startSync(peripheral) {
    try {
      await BleManager.connect(peripheral.id);
      this.setState({ 
        peripheral: { ...peripheral, connected: true },
        lostConnectionTime: 0
      });
      clearInterval(this.lostConnectionIntervalId);
      this.sendNotificationToCar(peripheral);
      this.log(`Connected to ${peripheral.id}`);
    }
    catch(e) {
      this.log(`Error sync bluetooth - ${e.message}`);
    }
  }

  async sendNotificationToCar(peripheral) {
    await BleManager.retrieveServices(peripheral.id);
    setTimeout(async () => {
      await BleManager.startNotification(peripheral.id, BTConfig.carService, BTConfig.carCharacteristic);
      this.log(`started notification on ${peripheral.id}`);
      setTimeout(async () => {
        await BleManager.write(peripheral.id, BTConfig.carService, BTConfig.carCharacteristic, stringToBytes('APP - send ping'));
        this.log(`APP - send ping`);         
      }, 500);
    }, 300);
  }
  
  handleUpdateValueForCharacteristic(data) {
    const value = bytesToString(data.value);
    this.log(value);
  }

  handleDisconnectedPeripheral() {
    this.log('Lost connection with car, reconnectig...');
    this.setState({ peripheral: null });
    clearInterval(this.lostConnectionIntervalId);
    this.lostConnectionIntervalId = setInterval(() => {
      this.setState({ lostConnectionTime: this.state.lostConnectionTime += 1 });
    },1000);
    this.startScan(BTConfig.carPeripheralId, BTConfig.scanSeconds);
  }

  componentWillUnmount() {
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    this.handlerDisconnect.remove();
    this.handlerUpdate.remove();
  }
  
  render() {
    return (
      <View style={styles.container}>
      
        <View style={styles.title}>
          <Text style={styles.titleText}>GiS</Text>
        </View>
        <View style={styles.header}>
          <View style={styles.connectionStatus}>
            {
              (this.state.peripheral && this.state.peripheral.connected) ?
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
        <View style={styles.body}>
        <ScrollView>
          <View>  
              <Text>
                {this.state.logs.join('\n')}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

