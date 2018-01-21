#include <SoftwareSerial.h>

SoftwareSerial BT(4,2);      // RX, TX recordar que se cruzan

int enginePin = 8;

long lastTickMss = 0;
long elapsedTime = 0;

boolean bluetoothAlive = false;
boolean fisrtConnectionWasStablished = true;
int lastConnectionMss = 0;


void setup() { 
  Serial.begin(9600);
//  Serial.println("Enter AT commands now:");
  BT.begin(9600);
  pinMode(enginePin, OUTPUT);
  digitalWrite(enginePin, HIGH);
}

void loop() {
  
  delay(1500);
  
  bluetoothAlive = false;
  
  while (BT.available()) {
     Serial.write(BT.read());
     bluetoothAlive = true;
     fisrtConnectionWasStablished = true;
     digitalWrite(enginePin, HIGH);
  }
  
  if (bluetoothAlive) {
    BT.write("pong"); Serial.write("\npong sent\n");
  }
  
  executeTimedRutines();
  
 }

String executeTimedRutines() {
  
  elapsedTime = millis();
  
  if ( (elapsedTime - lastTickMss) >= 10000 ) { // Every 10 seconds
    Serial.println(elapsedTime / 1000);
    lastTickMss = elapsedTime;

    if ( !bluetoothAlive && fisrtConnectionWasStablished ) {
      // retryConnection ???? conter++, cada 10 segundos.... si despues de 100 segundos no paso nada, apagamos motor
    }
  }
}
