// LoRa
#define SCK 5      // GPIO5  SCK
#define MISO 19    // GPIO19 MISO
#define MOSI 27    // GPIO27 MOSI
#define SS 18      // GPIO18 CS
#define RST 14     // GPIO14 RESET
#define DI00 26    // GPIO26 IRQ(Interrupt Request)
#define BAND 915E6 //Frequência do radio - exemplo: 433E6, 868E6, 915E6

void setupLoRa(){ 

  SPI.begin(SCK, MISO, MOSI, SS);
  LoRa.setPins(SS, RST, DI00);
  
  while (!LoRa.begin(BAND)) {
    Serial.println("Erro ao inicializar o LoRa!");
  }
  
  LoRa.enableCrc();
  LoRa.receive();
}
void loraReceiveData() {
  if (LoRa.parsePacket() > 1) {
      String received = "";
      
      while(LoRa.available()){
        received += (char) LoRa.read();
      }

      Serial.println(received);
   }
}
void loraSendData(String message){
    LoRa.beginPacket();
    LoRa.print(message);
    LoRa.endPacket();
}
