void execBluetooth() {

  if (btConnected > 0 && bTLastDisconnectionMillis == 0) {
    bTLastDisconnectionMillis = millis(); //take note of the disconnection time, if it doesnt connect again afer timeout, stop engine.
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

  if (btConnected) {
    String rfConnectedStr = rfConnected ? "true" : "false";
    String madeRadioContactStr = madeRadioContact ? "true" : "false";
    String jsonResponse = "{\"rfConnected\":" + rfConnectedStr + ", \"madeRadioContact\":" + madeRadioContactStr + "}" + ">"; //  DONT REMOVE THE >, ITS THE E.O.S CHARACTER
    Serial.println(jsonResponse);

    for (int i = 0; i < jsonResponse.length(); i++) {
      BT.write(jsonResponse[i]);
    }
  }
  
}
