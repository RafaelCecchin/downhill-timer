#include <ArduinoJson.h>
#include <SPI.h>
#include <LoRa.h>

#define SCK 5   // GPIO5  SCK
#define MISO 19 // GPIO19 MISO
#define MOSI 27 // GPIO27 MOSI
#define SS 18   // GPIO18 CS
#define RST 14  // GPIO14 RESET
#define DI00 26 // GPIO26 IRQ(Interrupt Request)
#define BAND 915E6 //Frequência do radio - exemplo: 433E6, 868E6, 915E6

#define ever (;;)

void setupLoRa(){ 
  SPI.begin(SCK, MISO, MOSI, SS);
  LoRa.setPins(SS, RST, DI00);
  
  while (!LoRa.begin(BAND)) {
    Serial.println("Erro ao inicializar o LoRa!");
  }
  
  LoRa.enableCrc();
  LoRa.receive();
}
void setupSerial(){
  Serial.begin(9600);
  
  while (!Serial) {
    Serial.println("Erro ao inicializar o LoRa!");
  }
}
void loraSendData(String message){
    LoRa.beginPacket();
    LoRa.print(message);
    LoRa.endPacket();
}

void setup() {
  setupLoRa();
  setupSerial();
}
void loop() {

  for ever {
    StaticJsonDocument<500> input;
    StaticJsonDocument<500> output;
    JsonObject data = output.createNestedObject("data");

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
          switch(input["operation"].as<int>()) { 
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
          switch(input["operation"].as<int>()) { 
            case 1: // Connection test
              loraSendData(input.as<String>());
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
          
        case 3: // Finish device
          output["status"] = 0;
          output["message"] = "Em desenvolvimento...";
          serializeJson(output, Serial);
          Serial.println();
          
          continue;
          break;   
            
        default:
          output["status"] = 0;
          output["message"] = "Dispositivo inválido.";
          serializeJson(output, Serial);
          Serial.println();
          
          continue;
          break;
      }
    }  

    // Entrada LoRa
    if (LoRa.parsePacket() > 1) {
      String received = "";
      
      while(LoRa.available()){
        received += (char) LoRa.read();
      }

      Serial.println(received);
    }
  }
}
