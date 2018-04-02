void execBluetooth() {

  BTConnected = false;

  if (BTLastConnectionMillis > 0 && BTLastDisconnectionMillis == 0) {
    BTLastDisconnectionMillis = millis(); //take note of the disconnection time, if it doesnt connect again afer timeout, stop engine.
  }
  digitalWrite(BTLed,LOW);
  
  while (BT.available()) {
    
     Serial.write(BT.read());
     BTConnected = true;
     BTLastDisconnectionMillis = 0; //  Remove the last disconnection time
     digitalWrite(BTLed,HIGH);
     
     if (BTLastConnectionMillis == 0) {
        BTLastConnectionMillis = millis(); //  If its the first time connecting, set firstConnectinoMillis
     }
  }
  
  if (BTConnected) {
    
    String lostGarageConnectionStr = "false";
    Serial.println(RFretryCount );
    if ( RFLastConnectionMillis > 0 && !RFConnected && RFretryCount >= RFMaxRetries) {
      lostGarageConnectionStr = "true";
    }

    String garageConnectedStr = RFConnected ? "true" : "false";
    String garageSearchTimeoutStr = garageSearchTimeout ? "true" : "false";
    
    String jsonResponse = "{ \"lostGarageConnection\":" + lostGarageConnectionStr + ",\"garageConnected\":" + garageConnectedStr + ",\"garageSearchTimeout\":" + garageSearchTimeoutStr + "}" + ">"; //  DONT REMOVE THE >, ITS THE EOS CHARACTER
    
    garageSearchTimeout = false; //  Once sent, reset the flag

    Serial.println(jsonResponse);

    for (int i = 0; i < jsonResponse.length(); i++) {
      BT.write(jsonResponse[i]);
    }
  }
  
}
