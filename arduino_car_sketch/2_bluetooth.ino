void execBluetooth() {

  BTConnected = false;
  
  while (BT.available()) {
    
     Serial.write(BT.read());
     BTConnected = true;
     
     if (BTFirstConnectionMillis == 0) {
        BTFirstConnectionMillis = millis(); //  If its the first time connecting, set firstConnectinoMillis
     }
  }
  
  if (BTConnected) {

    String lostGagareConnection = lostGarageConnection() ? "true" : "false";
    String garageConnected = RFConnected ? "true" : "false";

    Serial.write("lostGarageConnectin = " + lostGagareConnection);
    Serial.write("garageConnected = " + garageConnected);

    String jsonResponse = "{}";
    
    BT.write(jsonResponse); Serial.write(jsonResponse);
  }
  
}
