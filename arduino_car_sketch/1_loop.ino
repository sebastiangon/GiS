void loop() {
  
  execBluetooth();    //  Look for mobile app messages

  if (bSendBtResponse) {  //  Start looking a garage if the bluetooth is has connected at least once
    execRadio();
  }

  delay(1000);
}

