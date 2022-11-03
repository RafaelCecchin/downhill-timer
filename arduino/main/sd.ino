// SD Card reader
#define SD_MISO 13
#define SD_MOSI 12
#define SD_SCK 17
#define SD_CS 23

void setupSD() {
  delay(1000);
  SPIClass sd_spi(HSPI);
  sd_spi.begin(SD_SCK, SD_MISO, SD_MOSI, SD_CS);

  while (!SD.begin(SD_CS, sd_spi)) {
    Serial.println("Erro ao iniciar o cartão SD!");
  }
}
