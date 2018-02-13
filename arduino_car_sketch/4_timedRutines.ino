int oneSecond = 1000;
int oneMinute = 60000;

long garageSearchTimeoutPeriod = 30000;      //  Every 5 minutes, timeout --> 300000 ms
long garageSearchTimeoutLastMeasurement = 0;  //  Last time that garageSearch did timout

long bluetoothDisconnectionMaxTime = 10000;

void execTimedRutines() {
  
  long elapsedTime = millis();
  
  if ( (elapsedTime - garageSearchTimeoutLastMeasurement) >= garageSearchTimeoutPeriod ) {
    garageSearchTimeoutLastMeasurement = elapsedTime;
    if (!RFConnected) {
      garageSearchTimeout = true;
    }
  }

  if ( !BTConnected && BTLastDisconnectionMillis != 0 && ((elapsedTime - BTLastDisconnectionMillis) >=  bluetoothDisconnectionMaxTime)) {
    digitalWrite(engineLed,LOW); // Turn off engine, car stolen
  }
}

