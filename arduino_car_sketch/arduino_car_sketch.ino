#include <printf.h>
#include <nRF24L01.h>
#include <RF24_config.h>
#include <RF24.h>
#include <SoftwareSerial.h>

SoftwareSerial BT(4,2); //  Bluetooth RX,TX Recordar que se cruzan
RF24 radio(7,8);

int engineLed = 3;  //  Yellow led
int BTLed = 5;      //  Blue led
int RFLed = 6;      //  Green led

bool bSendBtResponse = false;
bool rfConnected = false;
bool madeRadioContact = false;
bool madeBluetoothContact = false;
int btMissingDataCount = 0;
long maxCountToStopEngine = 60; //  60 cicles (1 seg aprox) without 

byte addresses[][6] = {"1Node","2Node"};

void setup() {
  pinMode(engineLed,OUTPUT);
  pinMode(BTLed,OUTPUT);
  pinMode(RFLed,OUTPUT);

  digitalWrite(engineLed,HIGH);

  BT.begin(9600);

  radio.begin();
  radio.setPALevel(RF24_PA_LOW);
  radio.openWritingPipe(addresses[1]);
  radio.openReadingPipe(1,addresses[0]);
  radio.startListening();

  Serial.begin(115200);
}

//  Loop in next tab
