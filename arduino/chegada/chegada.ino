// RTC
#include <Wire.h>
#include "RTClib.h"
/*
  SDA = 21
  SCL = 22
*/
RTC_DS1307 rtc;

void setupRTC() {
    while (!rtc.begin()) {
      Serial.println("Erro ao inicializar o módulo RTC!");
    }

    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
}
String getHour() {
  DateTime now = rtc.now();
  
  char time[20];
  sprintf( time, "%04d-%02d-%02d %02d:%02d:%02d", now.year(), now.month(), now.day(), now.hour(), now.minute(), now.second() );
  
  return time;
}
void setHour(String dateTime) {
    char time_char[21] = "";
    strcpy(time_char, dateTime.c_str()); 
    struct tm time_tm;
    
    strptime(time_char,"%Y-%m-%d %H:%M:%S",&time_tm);
  
    int  y = time_tm.tm_year + 1900, 
         m = time_tm.tm_mon + 1,
         d = time_tm.tm_mday,
         H = time_tm.tm_hour,
         M = time_tm.tm_min,
         S = time_tm.tm_sec;
  
    rtc.adjust(DateTime(y, m, d, H, M, S));
}


// 2.4GHz
#include <esp_now.h>
#include <WiFi.h>
String dataReceived;
bool espNowReceivedData = false;
uint8_t broadcastAddress[] = {0x99, 0xB4, 0x7E, 0xFF, 0x24, 0x88}; //Destination ESP32's MAC Address

void setupEspNow(){ 
 WiFi.mode(WIFI_STA);
  
 while (esp_now_init() != ESP_OK) {
    Serial.println("Erro ao inicializar o ESP-NOW!");
 }

 // Register peer
 esp_now_peer_info_t peerInfo;
 memset(&peerInfo, 0, sizeof(peerInfo));
 for (int ii = 0; ii < 6; ++ii )
 {
    peerInfo.peer_addr[ii] = (uint8_t) broadcastAddress[ii];
 }
 peerInfo.channel = 0;
 peerInfo.encrypt = false;

 // Add peer
 while (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("Failed to add peer");
 }

 esp_now_register_recv_cb(espNowOnReceiveData);
 //esp_now_register_send_cb(espNowOnDataSent);
}
void espNowSendData(String message) { 
  esp_now_send(broadcastAddress, (uint8_t *) message.c_str(), strlen(message.c_str()) + 10);
};
void espNowOnReceiveData(const uint8_t * mac, const uint8_t *incomingData, int len) {
  char* buff = (char*) incomingData;        //char buffer
  dataReceived = String(buff);                  //converting into STRING
  espNowReceivedData = true;
}
/*void espNowOnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  espNowReceivedData = false;
  dataReceived = "";
}*/
void resetEspNowVars() {
  espNowReceivedData = false;
  dataReceived = "";
}

// Interruptor
#define SWITCH 2

void setupSwitch() {
  pinMode(SWITCH,INPUT);
}
bool switchPush() {
    return digitalRead(SWITCH) == HIGH;
}

// RFID Reader
#include <SoftwareSerial.h>
SoftwareSerial rfid(38,39); // RX / TX

void setupRfid(){
  rfid.begin(9600);
  rfid.listen(); 
}

// SD Card reader
#include "FS.h"
#include "SD.h"
#include "SPI.h"

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

// Helper
#include <ArduinoJson.h>
#define ever (;;)
void setupSerial(){
  Serial.begin(9600);
  
  while (!Serial) {
    Serial.println("Erro ao inicializar o LoRa!");
  }
}

void setup() {
  setupSerial();
  setupSD();
  setupRTC();
  setupEspNow();
  setupRfid();
}
void loop() {
  for ever {
    StaticJsonDocument<500> input;
    StaticJsonDocument<500> output;
    JsonObject data = output.createNestedObject("data");
  
    // Entrada ESP-NOW
    if (espNowReceivedData) {
      String received = dataReceived;

      Serial.println("Recebeu via ESP-NOW: "+received);

      DeserializationError err = deserializeJson(input, received);
      
      if (err != DeserializationError::Ok) {
        output["status"] = 0;
        output["message"] = "JSON inválido.";
        serializeJson(output, Serial);
        Serial.println();
        resetEspNowVars();
        
        continue;
      }
  
      int device = input["device"].as<int>();
      int operation = input["operation"].as<int>();
  
      output["device"] = device;
      output["operation"] = operation;
  
      if (device != 3) {
        output["status"] = 0;
        output["message"] = "A mensagem recebida é destinada a outro dispositivo.";
        serializeJson(output, Serial);
        Serial.println();
        resetEspNowVars();
        
        continue;
      }

      switch(operation) {
        case 1:
          output["status"] = 1;
          output["message"] = "Conexão realizada com sucesso.";
          espNowSendData(output.as<String>());
          Serial.println("Enviou via ESP-NOW: "+output.as<String>());
          resetEspNowVars();
          
          continue;
          break;
        case 2:
          output["status"] = 1;
          output["message"] = "Competidor 34434 identificado com sucesso.";
          data["rfid"] = "34434"; // Random selected ID
          espNowSendData(output.as<String>());
          Serial.println("Enviou via ESP-NOW: "+output.as<String>());
          resetEspNowVars();
          
          continue;
          break;
        case 3:
          output["status"] = 1;
          setHour(input["data"]["dateTime"].as<String>());
          output["message"] = "A data e hora identificada foi " + getHour();
          data["time"] = getHour();
          espNowSendData(output.as<String>());
          Serial.println("Enviou via ESP-NOW: "+output.as<String>());
          resetEspNowVars();
          
          continue;
          break;

        case 4:
          output["status"] = 1;
          output["message"] = "O interruptor foi acionado.";
          espNowSendData(output.as<String>());
          Serial.println("Enviou via ESP-NOW: "+output.as<String>());
          resetEspNowVars();
          
          continue;
          break;
          
        default:
          output["status"] = 0;
          output["message"] = "Operação inválida.";
          espNowSendData(output.as<String>());
          Serial.println("Enviou via ESP-NOW: "+output.as<String>());
          resetEspNowVars();
          
          continue;
          break;
      }
    }

    // Interruptor
    if (switchPush()) {
      output["device"] = 3;
      output["operation"] = 4;
      output["status"] = 1;
      output["message"] = "O interruptor de chegada foi acionado.";
      data["time"] = getHour();
      espNowSendData(output.as<String>());
      serializeJson(output, Serial);
      Serial.println();
    }

    //RFID
    if (rfid.available() > 0) {
      
      /*String rfidInput = "";
      while(rfid.available()) {
        char character = rfid.read();
        rfidInput += character;
      }
      
      Serial.print("Eu recebi: ");
      Serial.println(rfidInput);*/

      while(rfid.available()) {
        byte character = rfid.read();
        Serial.print(character, HEX);
        Serial.print(' ');
      }
      Serial.println();
    }
  }
}
