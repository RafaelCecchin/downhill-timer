// RFID Reader
void setupRfid(){
  Serial2.begin(9600, SERIAL_8N1);

  while (!Serial2) {
    Serial.println("Erro ao inicializar o Serial2/RFID Reader!");
  }
}
void updateLastRfidTag() {
  if (Serial2.available() == 25) {
    delay(50);

    byte byteArray[25];
    char hexArray[54];
    String rfid;

    for (int i = 0; i < 25; i++) {
      byteArray[i] = Serial2.read();
      sprintf(&hexArray[i*2], "%02x", byteArray[i]);
    }

    for (int i = 43; i < 48; i++) {
      rfid += hexArray[i];
    }

    lastRfidTag = rfid;
  }
}
