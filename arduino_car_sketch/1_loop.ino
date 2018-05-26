void loop() {
  
  execBluetooth();    //  Look for mobile app messages

  if (BTLastConnectionMillis) {  //  Start looking a garage if the bluetooth has connected at least once
    execRadio();
  }

  execTimedRutines(); //  Timed events (reconnections, searching timeouts, etc)

  delay(1000);
}

