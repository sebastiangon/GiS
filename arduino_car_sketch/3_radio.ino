bool execRadio() {
   /***************** Ping Out Role ****************/
  radio.stopListening();                                    // First, stop listening so we can talk.
  
  Serial.println(F("Now sending"));

  unsigned long start_time = micros();                             // Take the time, and send it.  This will block until complete
   if (!radio.write( &start_time, sizeof(unsigned long) )){
     Serial.println(F("failed"));
   }
      
  radio.startListening();                                    // Now, continue listening
  
  unsigned long started_waiting_at = micros();               // Set up a timeout period, get the current microseconds
  boolean timeout = false;                                   // Set up a variable to indicate if a response was received or not
  
  while ( ! radio.available() ){                             // While nothing is received
    if (micros() - started_waiting_at > 200000 ){            // If waited longer than 200ms, indicate timeout and exit while loop
        timeout = true;
        break;
    }      
  }
      
  if ( timeout ){                                             // Describe the results
      Serial.println(F("Failed, response timed out."));
  }else{
      unsigned long got_time;                                 // Grab the response, compare, and send to debugging spew
      radio.read( &got_time, sizeof(unsigned long) );
      unsigned long end_time = micros();
      
      // Spew it
      Serial.print(F("Sent "));
      Serial.print(start_time);
      Serial.print(F(", Got response "));
      Serial.print(got_time);
      Serial.print(F(", Round-trip delay "));
      Serial.print(end_time-start_time);
      Serial.println(F(" microseconds"));
  }
}
