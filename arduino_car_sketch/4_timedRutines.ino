void execTimedRutines() {
  if ( !BTConnected && bTLastDisconnectionMillis != 0 && ((millis() - bTLastDisconnectionMillis) >=  stopEngineTimeout)) {
    digitalWrite(engineLed,LOW); // Turn off engine, car stolen
  }
}

