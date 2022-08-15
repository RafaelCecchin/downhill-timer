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
#define SWITCH 13

void setupSwitch() {
  pinMode(SWITCH,INPUT);
}
bool switchPush() {
    return digitalRead(SWITCH) == HIGH;
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
  setupRTC();
  setupEspNow();
  setupSerial();
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
  }
}
