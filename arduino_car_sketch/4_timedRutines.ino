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

