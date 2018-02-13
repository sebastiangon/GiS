void execBluetooth() {

  BTConnected = false;
  
  while (BT.available()) {
    
     Serial.write(BT.read());
     BTConnected = true;
     
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
    
    garageSearchTimeout = false; //  Once sent, reset it 

    Serial.println(jsonResponse);

    for (int i = 0; i < jsonResponse.length(); i++) {
      BT.write(jsonResponse[i]);
    }
  }
  
}
