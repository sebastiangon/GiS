void loop() {
  BTConnected = false;
  RFConnected = false;

  execBluetooth();

  if (BTConnected) {
    execRadio();
  }

  execTimedRutines();

  delay(1000);
}

