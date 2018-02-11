void loop() {
  
  execBluetooth();    //  Look for mobile app messages

  if (BTConnected) {  //  Start looking a garage if the bluetooth is connected
    execRadio();
  }

  execTimedRutines(); //  Timed events (reconnections, searching timeouts, etc)

  //  Reset connection flags for next loop
  BTConnected = false;
  RFConnected = false;
  delay(1000);
}

