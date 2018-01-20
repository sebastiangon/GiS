#include <SoftwareSerial.h>

SoftwareSerial BT(4,2);      // RX, TX recordar que se cruzan

int enginePin = 8;
long lastShownTime = 0;
long elapsedTime = 0;
boolean BLUETOOTH_ALIVE = false;

void setup() { 
  Serial.begin(9600);
  Serial.println("Enter AT commands now:");
  BT.begin(9600);
  pinMode(enginePin, OUTPUT);
}

void loop() {
  delay(1500);
  
  BLUETOOTH_ALIVE = false;
  while (BT.available()) {
     Serial.write(BT.read());
     BLUETOOTH_ALIVE = true;
     digitalWrite(enginePin, HIGH);
  }
  
  if (BLUETOOTH_ALIVE) { BT.write("pong"); Serial.write("\nsent pong\n"); }

  showElapsedTime();

 }

String showElapsedTime() {
  elapsedTime = millis();
  
  if ( (elapsedTime - lastShownTime) >= 10000 ) { // Every 10 seconds at least
    Serial.println(elapsedTime / 1000);
    lastShownTime = elapsedTime;
  }
}
