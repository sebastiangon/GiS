bool execBluetooth() {
  while (BT.available()) {
      Serial.write(BT.read());
     BTConnected = true;
     BTConnectionStartMillis = millis();
  }
  
  if (BTConnected) {
    BT.write("pong"); Serial.write("\npong sent\n");
  }
}
