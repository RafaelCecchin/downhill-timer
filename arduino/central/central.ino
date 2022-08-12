// 2.4GHz
#include <esp_now.h>
#include <WiFi.h>
String dataReceived;
bool espNowReceivedData = false;
uint8_t broadcastAddress[] = {0xC8, 0xC9, 0xA3, 0xC8, 0xBD, 0x60}; //Destination ESP32's MAC Address

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
  Serial.println(dataReceived);
}
/*void espNowOnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  espNowReceivedData = false;
  dataReceived = "";
}*/
void resetEspNowVars() {
  espNowReceivedData = false;
  dataReceived = "";
}

// LoRa
#include <SPI.h>
#include <LoRa.h>

#define SCK 5   // GPIO5  SCK
#define MISO 19 // GPIO19 MISO
#define MOSI 27 // GPIO27 MOSI
#define SS 18   // GPIO18 CS
#define RST 14  // GPIO14 RESET
#define DI00 26 // GPIO26 IRQ(Interrupt Request)
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

void loraSendData(String message){
    LoRa.beginPacket();
    LoRa.print(message);
    LoRa.endPacket();
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
  setupLoRa();
  setupEspNow();
}
void loop() {
  for ever {
    StaticJsonDocument<500> input;
    StaticJsonDocument<500> output;
    JsonObject data = output.createNestedObject("data");

    // Entrada LoRa
    loraReceiveData();

    // Entrada serial
    if (Serial.available() > 1) {
      DeserializationError err = deserializeJson(input, Serial);
      
      if (err != DeserializationError::Ok) {
        output["status"] = 0;
        output["message"] = "JSON inválido.";
        serializeJson(output, Serial);
        Serial.println();
        
        continue;
      }
  
      int device = input["device"].as<int>();
      int operation = input["operation"].as<int>();
  
      output["device"] = device;
      output["operation"] = operation;
  
      switch(device) {
        case 1: // Central device
          switch(operation) { 
            case 1: // Connection test
              output["status"] = 1;
              output["message"] = "Conexão realizada com sucesso.";
              serializeJson(output, Serial);
              Serial.println();
              
              continue;
              break;
            default:
              output["status"] = 0;
              output["message"] = "Operação inválida.";
              serializeJson(output, Serial);
              Serial.println();
              
              continue;
              break;
          }
          break;
          
        case 2: // Start device

          if (operation != 1 && operation != 2 && operation != 3 && operation != 4) {
            output["status"] = 0;
            output["message"] = "Operação inválida.";
            serializeJson(output, Serial);
            Serial.println();
            
            continue;
          }
          
          loraSendData(input.as<String>());
          
          continue;
          break;
          
        case 3: // Finish device
          if (operation != 1 && operation != 2 && operation != 3 && operation != 4) {
            output["status"] = 0;
            output["message"] = "Operação inválida.";
            serializeJson(output, Serial);
            Serial.println();
            
            continue;
          }
          
          espNowSendData(input.as<String>());
          
          continue;
          break;
            
        default:
          output["status"] = 0;
          output["message"] = "Dispositivo inválido.";
          serializeJson(output, Serial);
          Serial.println();
          break;
      }
    }
  }
}
