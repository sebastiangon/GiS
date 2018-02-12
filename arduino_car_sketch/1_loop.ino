void loop() {
  
  execBluetooth();    //  Look for mobile app messages

  if (BTFirstConnectionMillis) {  //  Start looking a garage if the bluetooth is has connected at least once
    execRadio();
  }

  execTimedRutines(); //  Timed events (reconnections, searching timeouts, etc)

  delay(1000);
}

