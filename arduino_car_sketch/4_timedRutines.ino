void execTimedRutines() {

  if ( !btConnected && bTLastDisconnectionMillis != 0 && ((millis() - bTLastDisconnectionMillis) >=  stopEngineTimeout)) {
    digitalWrite(engineLed,LOW); // Turn off engine, car stolen
  }
}

