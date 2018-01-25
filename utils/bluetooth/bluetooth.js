import { NativeModules, NativeEventEmitter, Alert } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { stringToBytes, bytesToString } from 'convert-string';

import * as BTConfig from './bluetooth.config';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export class Bluetooth {
    constructor() {
        this.scanning = false;
        this.peripheral = null;
        this.lostConnectionIntervalId = null;
        this.lostConnectionSeconds = 0;
        this.eventListeners = {};
        this.propmtTurnOnBluetoothId = 0;
        this.showingAlert = false;

        //Method binding
        this.init = this.init.bind(this);
        this.startScan = this.startScan.bind(this);
        this.startSync = this.startSync.bind(this);
        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
        this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
        this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
        this.handleBLEUpdateState = this.handleBLEUpdateState.bind(this);

        //BleManagerEmitter callbacks
        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral',this.handleDiscoverPeripheral );
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
        this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );
        this.updateState = bleManagerEmitter.addListener('BleManagerDidUpdateState', this.handleBLEUpdateState);
    }

    init() {
        BleManager.start({showAlert: false})
        .then(() => {
            console.log('Bluetooth: Module initialized');
        });
    }

    addListener(evt, cb) {
        this.eventListeners[evt] = cb;
    }
    
    handleDiscoverPeripheral(peripheral) {
        const connectedPeripheral = this.peripheral;
        if (peripheral.id === BTConfig.carPeripheralId) {
          this.peripheral = peripheral;
          console.log(`Bluetooth: Discovered peripheral`);
          BleManager.stopScan()
            .then(() => { this.handleStopScan() })
            .catch(() => { this.log('Error stopping scanning.') });
        }
    }

    startScan(carPeripheralId, scanTimeout) {
        if (!this.scanning) {
            this.peripheral = null;
            BleManager.scan([], scanTimeout, true).then((results) => {
                console.log(`Bluetooth: Searching car...`);
                this.scanning = true;
              });
        }
    }

    handleBLEUpdateState(data) {
        console.log(`Bluetooth: BLE Update state - ${data.state}`);
        if (data.state === 'on') {
            clearInterval(this.propmtTurnOnBluetoothId);
            this.startScan(BTConfig.carPeripheralId, BTConfig.scanSeconds);
        } else {
            this.propmtTurnOnBluetoothId = setInterval(() => {
                // TO DO reemplazar por un mensaje en UI
                Alert.alert('Error', 'El bluetooth se encuentra desactivado. Vaya a Ajustes --> Bluetooth para activarlo');
            }, 5000);
        }
    }

    handleStopScan() {
        this.scanning = false;
        if (this.peripheral) {
            console.log(`Bluetooth: Car found, now synchronizing...`);
            this.startSync(this.peripheral);
        } else {
            console.log(`Bluetooth: Not close enought to your car, retrying...`);
            this.startScan(BTConfig.carPeripheralId, BTConfig.scanSeconds);
        }
    }

    async startSync(peripheral) {
        try {
            await BleManager.connect(peripheral.id);
            this.peripheral = {
                ...this.peripheral,
                connected: true
            };
            this.lostConnectionSeconds = 0;
            clearInterval(this.lostConnectionIntervalId);
            this.sendMessageToPeripheral(this.peripheral); 
            console.log(`Bluetooth: Connected to ${peripheral.id}`);
            this.eventListeners['stateChange']({connected: true});
        }
        catch(e) {
            console.log(`Bluetooth: Error sync bluetooth - ${e.message}`);
        }
    }

    async sendMessageToPeripheral(peripheral) {
        await BleManager.retrieveServices(peripheral.id);
        setTimeout(async () => {
            await BleManager.startNotification(peripheral.id, BTConfig.carService, BTConfig.carCharacteristic);
            console.log(`Bluetooth: started notification on ${peripheral.id}`);
            setTimeout(async () => {
                await BleManager.write(peripheral.id, BTConfig.carService, BTConfig.carCharacteristic, stringToBytes('APP - send ping'));
                console.log(`Bluetooth: APP - send ping`);         
            }, 500);
        }, 300);
    }

    handleDisconnectedPeripheral() {
        console.log(`Bluetooth: Lost connection with car, reconnectig...`);
        this.eventListeners['stateChange']({connected: false});
        this.peripheral = null;
        clearInterval(this.lostConnectionIntervalId);
        this.lostConnectionIntervalId = setInterval(() => {
            this.lostConnectionSeconds = this.lostConnectionSeconds =+1 ;
        },1000);
        this.startScan(BTConfig.carPeripheralId, BTConfig.scanSeconds);
    }

    handleUpdateValueForCharacteristic(data) {
        const value = bytesToString(data.value);
        console.log(`Bluetooth: ${value}`);
    }

    removeListeners() {
        this.handlerDiscover.remove();
        this.handlerStop.remove();
        this.handlerDisconnect.remove();
        this.handlerUpdate.remove();
    }
};