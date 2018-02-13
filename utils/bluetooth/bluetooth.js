import { NativeModules, NativeEventEmitter, Alert } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { stringToBytes, bytesToString } from 'convert-string';

import * as BTConfig from './bluetooth.config';
import { connectionStatusEnum } from '../connectionStatusEnum';

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
        this.characteristicValueBuffer = '';

        //BleManagerEmitter callbacks
        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral',this.handleDiscoverPeripheral );
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
        this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );
        this.updateState = bleManagerEmitter.addListener('BleManagerDidUpdateState', this.handleBLEUpdateState);
    }

    init = () => {
        BleManager.start({showAlert: false})
        .then(() => {
            console.log('Bluetooth: Module initialized');
        });
    }

    addListener = (evt, cb) => {
        this.eventListeners[evt] = cb;
    }
    
    handleDiscoverPeripheral = (peripheral) => {
        const connectedPeripheral = this.peripheral;
        if (peripheral.id === BTConfig.carPeripheralId) {
          this.peripheral = peripheral;
          console.log(`Bluetooth: Discovered peripheral`);
          BleManager.stopScan()
            .then(() => { this.handleStopScan() })
            .catch(() => { this.log('Error stopping scanning.') });
        }
    }

    dispatchListener = (listener, params) => {
        const cb = this.eventListeners[listener];
        if (cb && typeof(cb) === 'function') {
            cb(params);
        }
    }

    startScan = (carPeripheralId, scanTimeout) => {
        if (!this.scanning) {
            this.peripheral = null;
            this.dispatchListener('connectionStatusChange', {carConnectionStatus: connectionStatusEnum.CONNECTING});
            BleManager.scan([], scanTimeout, true).then((results) => {
                console.log(`Bluetooth: Searching car...`);
                this.scanning = true;
              });
        }
    }

    handleBLEUpdateState = (data) => {
        console.log(`Bluetooth: BLE Update state - ${data.state}`);
        if (data.state === 'on') {
            clearInterval(this.propmtTurnOnBluetoothId);
            this.startScan(BTConfig.carPeripheralId, BTConfig.scanSeconds);
        } else {
            this.propmtTurnOnBluetoothId = setInterval(() => {
                // TODO reemplazar por un mensaje en UI
                Alert.alert('Error', 'El bluetooth se encuentra desactivado. Vaya a Ajustes --> Bluetooth para activarlo');
            }, 15000);
        }
    }

    handleStopScan = () => {
        this.scanning = false;
        if (this.peripheral) {
            console.log(`Bluetooth: Car found, now synchronizing...`);
            this.startSync(this.peripheral);
        } else {
            console.log(`Bluetooth: Not close enought to your car, retrying...`);
            this.startScan(BTConfig.carPeripheralId, BTConfig.scanSeconds);
        }
    }

    startSync = async (peripheral) => {
        try {
            await BleManager.connect(peripheral.id);
            this.peripheral = {
                ...this.peripheral,
                connected: true
            };
            this.lostConnectionSeconds = 0;
            clearInterval(this.lostConnectionIntervalId);
            //this.sendMessageToPeripheral(this.peripheral); 
            console.log(`Bluetooth: Connected to ${peripheral.id}`);
            this.dispatchListener('connectionStatusChange', {carConnectionStatus: connectionStatusEnum.CONNECTED});
        }
        catch(e) {
            console.warn(`Bluetooth: Error sync bluetooth - ${e.message}`);
        }
    }

    sendMessageToPeripheral = async (message) => {
        await BleManager.retrieveServices(this.peripheral.id);
        setTimeout(async () => {
            await BleManager.startNotification(this.peripheral.id, BTConfig.carService, BTConfig.carCharacteristic);
            console.log(`Bluetooth: started notification on ${this.peripheral.id}`);
            setTimeout(async () => {
                await BleManager.write(this.peripheral.id, BTConfig.carService, BTConfig.carCharacteristic, stringToBytes(message));
                console.log(`Bluetooth: SentMessageToPeripheral - ${message}`);
            }, 500);
        }, 300);
    }

    handleDisconnectedPeripheral = () => {
        console.log(`Bluetooth: Lost connection with car, reconnectig...`);
        this.peripheral = null;
        clearInterval(this.lostConnectionIntervalId);
        this.lostConnectionIntervalId = setInterval(() => {
            this.lostConnectionSeconds = this.lostConnectionSeconds =+1 ;
        },1000);
        this.startScan(BTConfig.carPeripheralId, BTConfig.scanSeconds);
    }

    handleUpdateValueForCharacteristic = (data) => {
        try {
            const value = bytesToString(data.value);
            if (value.includes('>')) {  //  End of secuence char F.E: "...old secuence part } > { New secuence part..."
                const valueSplit = value.split('>');
                this.characteristicValueBuffer += valueSplit[0];
                const responseJson = JSON.parse(this.characteristicValueBuffer);
                this.dispatchListener('updateValueForCharacteristic', responseJson);
                this.characteristicValueBuffer = valueSplit[1]; // Set the buffer with the surplus part of the incoming value (after the >)...
            } else {
                this.characteristicValueBuffer += value;
            }
        } catch (error) {
            console.warn(`Bluetooth: handleUpdateValueForCharacteristic error: ${error.message}`);
        }
    }

    removeListeners = () => {
        this.handlerDiscover.remove();
        this.handlerStop.remove();
        this.handlerDisconnect.remove();
        this.handlerUpdate.remove();
    }
};