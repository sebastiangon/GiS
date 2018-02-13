int oneSecond = 1000;
int oneMinute = 60000;

long garageSearchTimeoutPeriod = 300000;      //  Every 5 minutes, timeout
long garageSearchTimeoutLastMeasurement = 0;  //  Last time that garageSearch did timout



void execTimedRutines() {
  
  long elapsedTime = millis();
  
  if ( (elapsedTime - garageSearchTimeoutLastMeasurement) >= garageSearchTimeoutPeriod ) {
    garageSearchTimeoutLastMeasurement = elapsedTime;
    garageSearchTimeout = true;
  }
  
}

