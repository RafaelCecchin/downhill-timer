void setupDevice() {
  setupSerial();
  
  switch(DEVICE) {
    case 1:
      setupDeviceCentral();
      break;
    case 2:
      setupDeviceLargada();
      break;
    case 3:
      setupDeviceChegada();
      break;    
  }
}
