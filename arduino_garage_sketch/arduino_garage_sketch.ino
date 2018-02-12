#include <SPI.h>
#include "RF24.h"

/****************** User Config ***************************/
/***      Set this radio as radio number 0 or 1         ***/
bool radioNumber = 1;

/* Hardware configuration: Set up nRF24L01 radio on SPI bus plus pins 7 & 8 */
RF24 radio(7,8);
/**********************************************************/
byte addresses[][6] = {"1Node","2Node"};

void setup() {
  Serial.begin(115200);
  radio.begin();

  // Set the PA Level low to prevent power supply related issues since this is a
  // getting_started sketch, and the likelihood of close proximity of the devices. RF24_PA_MAX is default.
  radio.setPALevel(RF24_PA_MIN);
  
  // Open a writing and reading pipe on each radio, with opposite addresses
  
  radio.openWritingPipe(addresses[0]);
  radio.openReadingPipe(1,addresses[1]);
  
  // Start the radio listening for data
  radio.startListening();
}

void loop() {
/****************** Pong Back Role ***************************/
  unsigned long got_time;
  
  if( radio.available()){
                                                                  // Variable for the received timestamp
    while (radio.available()) {                                   // While there is data ready
      radio.read( &got_time, sizeof(unsigned long) );             // Get the payload
    }
   
    radio.stopListening();                                        // First, stop listening so we can talk   
    radio.write( &got_time, sizeof(unsigned long) );              // Send the final one back.      
    radio.startListening();                                       // Now, resume listening so we catch the next packets.     
    Serial.print(F("Sent response "));
    Serial.println(got_time);  
 }
} // Loop

