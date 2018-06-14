void execBluetooth() {

  digitalWrite(BTLed,LOW);

  if (BT.available() > 0) {
    
     bSendBtResponse = true;
     madeBluetoothContact = true;
     btMissingDataCount = 0;  //  Reset missing data count
     digitalWrite(BTLed,HIGH);
     
  } else {
    
      bSendBtResponse = false;
      if (madeBluetoothContact == true ) {    // Only increment if at least once, we've received signal from mobile app
        btMissingDataCount = btMissingDataCount + 1;
        logStrInt("btMissingDataCount: ", btMissingDataCount);
      }
      
  }
  
  while (BT.available()) {
     Serial.write(BT.read());
  }

  if (bSendBtResponse) {
    String rfConnectedStr = rfConnected ? "true" : "false";
    String madeRadioContactStr = madeRadioContact ? "true" : "false";
    String jsonResponse = "{\"rfConnected\":" + rfConnectedStr + ", \"madeRadioContact\":" + madeRadioContactStr + "}" + ">"; //  DONT REMOVE THE >, ITS THE E.O.S CHARACTER
    Serial.println(jsonResponse);

    for (int i = 0; i < jsonResponse.length(); i++) {
      BT.write(jsonResponse[i]);
    }
  } else {
    Serial.println("No BT data received");
  }

  if (btMissingDataCount > maxCountToStopEngine) {  //Lost car connection
    digitalWrite(engineLed,LOW);
    Serial.println("CAR STOPPED, RESTART ARDUINO");
  }
}

void logStrInt(String a, int b) {
  Serial.println(a+b);
}

