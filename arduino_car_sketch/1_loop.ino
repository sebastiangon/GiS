void loop() {
  digitalWrite(engineLed, HIGH);
  digitalWrite(RFLed, HIGH);
  digitalWrite(BTLed, HIGH);
  delay(1000);
  digitalWrite(engineLed, LOW);
  digitalWrite(RFLed, LOW);
  digitalWrite(BTLed, LOW);
  delay(1000);

  execBluetooth();

  execRadio();

  // Try again 1s later
  delay(1000);
}

