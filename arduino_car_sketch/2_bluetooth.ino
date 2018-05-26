void execBluetooth() {

  if (btConnected > 0 && BTLastDisconnectionMillis == 0) {
    BTLastDisconnectionMillis = millis(); //take note of the disconnection time, if it doesnt connect again afer timeout, stop engine.
  }
  
  digitalWrite(BTLed,LOW);

  if (BT.available() > 0) {
    
      btConnected = true;
      
  } else {
    
      if (madeBluetoothContact == true ) {
        bTLastDisconnectionMillis = millis();
      }
      btConnected = false;

  }
  
  while (BT.available()) {
    
     Serial.write(BT.read());
     btConnected = true;
     madeBluetoothContact = true;
     bTLastDisconnectionMillis = 0; //  Remove the last disconnection time
     digitalWrite(BTLed,HIGH);
  }
  
  if (BTConnected) {
    
    String garageConnectedStr = RFConnected ? "true" : "false";
    String jsonResponse = "{\"garageConnected\":" + garageConnectedStr + "}" + ">"; //  DONT REMOVE THE >, ITS THE EOS CHARACTER
    Serial.println(jsonResponse);

    for (int i = 0; i < jsonResponse.length(); i++) {
      BT.write(jsonResponse[i]);
    }
  }
  
}
