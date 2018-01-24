import { NativeEventEmitter } from 'react-native';
import BleManager from 'react-native-ble-manager';
import * as BTConfig from '../utils/bluetooth.config';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export class Bluetooth {
    constructor() {
        this.scanning = false;
        this.peripheral = null;
        this.lostConnectionIntervalId = null;
        this.lostConnectionSeconds = 0;

        this.init = this.init.bind(this);
        this.startScan = this.startScan.bind(this);

        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
        this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );
    }

    async init() {
        await BleManager.start({showAlert: false});
        console.log(`Bluetooth: Bluetooth Module initialized`);
        this.startScan(BTConfig.carPeripheralId, BTConfig.scanSeconds);
    }

    async startScan(carPeripheralId, scanTimeout) {
        if (!this.scanning) {
            this.peripheral = null;
            await BleManager.scan([], scanTimeout, true);
            console.log(`Bluetooth: Searching car...`);
            this.scanning = true;
        }
    }

    async handleDiscoverPeripheral(peripheral) {
        if (peripheral.id === BTConfig.carPeripheralId) {
          this.peripheral = peripheral;
          await BleManager.stopScan();
          this.handleStopScan();
        }
    }

    handleStopScan() {
        this.scanning = false;
        if (this.peripheral) {
          console.log(`Bluetooth: Car found, now synchronizing...`);
          this.startSync(this.state.peripheral);
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
            this.sendNotificationToCar(this.peripheral); 
            console.log(`Bluetooth: Connected to ${peripheral.id}`);
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

    handleDisconnectedPeripheral() {
        console.log(`Bluetooth: Lost connection with car, reconnectig...`);
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