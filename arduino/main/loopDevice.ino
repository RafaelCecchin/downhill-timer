void loopDevice() {
  switch(DEVICE) {
    case 1: // CENTRAL
      loopDeviceCentral();
      break;
    case 2: // LARGADA
      loopDeviceLargada();  
      break;
    case 3: // CHEGADA
      loopDeviceChegada();  
      break;      
  }
}
