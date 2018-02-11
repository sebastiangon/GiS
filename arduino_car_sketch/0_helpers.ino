bool lostGarageConnection() {
  
  bool lostConnection = false;

  if (RFFirstConnectionMillis > 0 && !RFConnected) {
    lostConnection = true;
  }

  return lostConnection;
  
}

