import { NativeModules, NativeEventEmitter, Alert } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { stringToBytes, bytesToString } from 'convert-string';

import * as BTConfig from './bluetooth.config';
import { connectionStatusEnum } from '../connectionStatusEnum';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export class Bluetooth {
    constructor(onBluetoothConectionStateChange, receiveBluetoothMessage) {
        this.peripheral = null;
        this.reScanCount = 0;
        this.lastConnectionDate = null;
        this.forcedDisconnection = false;
        this.characteristicValueBuffer = '';
        this.onBluetoothConectionStateChange = onBluetoothConectionStateChange;
        this.receiveBluetoothMessage = receiveBluetoothMessage;

        //BleManagerEmitter callbacks
        this.handlerDiscover    = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral',this.handleDiscoverPeripheral );
        this.handlerStop        = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
        this.handlerDisconnect  = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
        this.handlerUpdate      = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );
        this.updateState        = bleManagerEmitter.addListener('BleManagerDidUpdateState', this.handleBLEUpdateState);
       
        BleManager.start({showAlert: false})
            .then(() => {
                console.log('GiS: Bluetooth Module initialized, ready to start'); 
            })
            .catch(() => {
                console.log('GiS: Fail on start BleManager')
            });
    }

    init = () => {
        this.startScan(BTConfig.carPeripheralId, BTConfig.scanSeconds);
    }

    startScan = (carPeripheralId, scanTimeout) => {
        this.reScanCount = this.reScanCount + 1;
        console.log(`GiS: StartScan ${carPeripheralId} ${scanTimeout} reScanCount: ${this.reScanCount}`);

        if (this.reScanCount < BTConfig.maxReScanTries) { //  Keep searching
            this.onBluetoothConectionStateChange({carConnectionStatus: connectionStatusEnum.CONNECTING})
            BleManager.scan([], scanTimeout, true).then((results) => { console.log(`GiS: Bluetooth: Searching car...`)});
        } else if (this.lastConnectionDate) { //  If the lastConnectionDate is not null, then the car got away or shutted down (DISCONNECTION), fire disconnection, and reset bluetooth
            this.peripheral = null;
            this.reScanCount = 0;
            this.lastConnectionDate = null;
            this.onBluetoothConectionStateChange({carConnectionStatus: connectionStatusEnum.DISCONNECTED})
        } else if (this.lastConnectionDate == null) { //  If the lastConnectionDate is null, then the car was never connected (STTOPED), reset bluetooth
            this.peripheral = null;
            this.reScanCount = 0;
            this.lastConnectionDate = null;
            this.onBluetoothConectionStateChange({carConnectionStatus: connectionStatusEnum.STOPPED})
        }
    }

    handleDiscoverPeripheral = (peripheral) => {
        if (peripheral.id === BTConfig.carPeripheralId) {
          this.peripheral = peripheral;
          this.tryStopScan();
        }
    }

    tryStopScan = () => {
        console.log(`GiS: tryStopScan - Attemping to stop bluetooth scan`)
        BleManager.stopScan()
        .then(() => { this.handleStopScan() })
        .catch(() => { this.log('GiS: Error stopping scanning.') });
    }

    handleStopScan = () => {
        console.log(`GiS: handleStopScan - scan stopped`);
        if (this.peripheral) {
            console.log(`GiS: Bluetooth: Car found, now synchronizing...`);
            this.startSync(this.peripheral);
        } else {
            console.log(`GiS: Bluetooth: Car not found, retrying`);
            this.startScan(BTConfig.carPeripheralId, BTConfig.scanSeconds);
        }
    }

    startSync = async (peripheral) => {
        try {
            await BleManager.connect(peripheral.id);
            this.peripheral = { ...this.peripheral, connected: true };
            this.reScanCount = 0;
            this.lastConnectionDate = Date.now();
            console.log(`GiS: startSync - Connected to ${peripheral.id}`);
            this.onBluetoothConectionStateChange({carConnectionStatus: connectionStatusEnum.CONNECTED})
        }
        catch(e) {
            console.warn(`GiS: startSync - Error sync bluetooth - ${e.message}`);
        }
    }

    handleDisconnectedPeripheral = () => {
        console.log(`GiS: handleDisconnectedPeripheral - Bluetooth: Lost connection with car ${this.forcedDisconnection ? 'FORCED' : ''}`);
        this.peripheral = null;
        this.reScanCount = 0;
        if (!this.forcedDisconnection) {
            this.startScan(BTConfig.carPeripheralId, BTConfig.scanSeconds);
        }
        this.forcedDisconnection = false;
    }

    sendMessageToPeripheral = async (message) => {
        console.log(`GiS: sendMessageToPeripheral - ${message}`)
        await BleManager.retrieveServices(this.peripheral.id);
        setTimeout(async () => {
            await BleManager.startNotification(this.peripheral.id, BTConfig.carService, BTConfig.carCharacteristic);
            console.log(`GiS: Bluetooth: started notification on ${this.peripheral.id}`);
            setTimeout(async () => {
                await BleManager.write(this.peripheral.id, BTConfig.carService, BTConfig.carCharacteristic, stringToBytes(message));
                console.log(`GiS: Bluetooth: SentMessageToPeripheral - ${message}`);
            }, 500);
        }, 300);
    }

    handleUpdateValueForCharacteristic = (data) => {
        console.log(`GiS: handleUpdateValueForCharacteristic`)
        try {
            const value = bytesToString(data.value);
            if (value.includes('>')) {  //  End of secuence char F.E: "...old secuence part } > { New secuence part..."
                const valueSplit = value.split('>');
                this.characteristicValueBuffer += valueSplit[0];
                const responseJson = JSON.parse(this.characteristicValueBuffer);
                console.log(`GiS: receivedBTData - ${this.characteristicValueBuffer}`);
                this.receiveBluetoothMessage(responseJson);
                this.characteristicValueBuffer = valueSplit[1]; // Set the buffer with the surplus part of the incoming value (after the >)...
            } else {
                this.characteristicValueBuffer += value;
            }
        } catch (error) {
            console.warn(`GiS: Bluetooth: handleUpdateValueForCharacteristic error: ${error.message}`);
        }
    }

    handleBLEUpdateState = (data) => {
        console.log(`GiS: Bluetooth BLE Update state - ${data.state}`);
        //  Estado del bluetooth del telefono, no de la conexion con el arduino --> this.bluetoothStatus = data.state; // 'on', 'off'
        if (data.state === 'off') {
            this.finish();
        }
    }

    finish = () => {
        console.log(`GiS: finish - finishing bluetooth connection`);
        this.forcedDisconnection = true; // Avoid reconnection when handleDisconnectedPeripheral
        if (this.peripheral) {
            this.peripheral.id && BleManager.disconnect(this.peripheral.id);
            this.peripheral = null;
            this.reScanCount = 0;
            this.lastConnectionDate = null;
            this.onBluetoothConectionStateChange({carConnectionStatus: connectionStatusEnum.STOPPED})
        }
    }
};