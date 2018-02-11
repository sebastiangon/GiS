void execBluetooth() {
  
  while (BT.available()) {
    
     Serial.write(BT.read());
     BTConnected = true;
     
     if (BTFirstConnectionMillis == 0) {
        BTFirstConnectionMillis = millis(); //  If its the first time connecting, set firstConnectinoMillis
     }
  }
  
  if (BTConnected) {
    //Build response JSON
    
    BT.write("pong"); Serial.write("\npong sent\n");
  }
  
}
