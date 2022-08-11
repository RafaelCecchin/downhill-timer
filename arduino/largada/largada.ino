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
  StaticJsonDocument<500> input;
  StaticJsonDocument<500> output;
  JsonObject data = output.createNestedObject("data");
  
  for ever {
    

    // Entrada LoRa
    if (LoRa.parsePacket() > 1) {
      String received = "";
      
      while(LoRa.available()){
        received += (char) LoRa.read();
      }

      Serial.println("Recebeu via LoRa: "+received);

      DeserializationError err = deserializeJson(input, received);
      
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
  
      if (device != 2) {
        output["status"] = 0;
        output["message"] = "A mensagem recebida é destinada a outro dispositivo.";
        serializeJson(output, Serial);
        Serial.println();
        
        continue;
      }

      switch(operation) {
        case 1:
          output["status"] = 1;
          output["message"] = "Conexão realizada com sucesso.";
          loraSendData(output.as<String>());
          Serial.println("Enviou via LoRa: "+output.as<String>());
          
          continue;
          break;
        case 2:
          output["status"] = 1;
          output["message"] = "Competidor 34434 identificado com sucesso.";
          data["rfid"] = "34434"; // Random selected ID
          loraSendData(output.as<String>());
          Serial.println("Enviou via LoRa: "+output.as<String>());
          
          continue;
          break;
        case 3:
          output["status"] = 1;
          output["message"] = "A data e hora atual identificada foi 10/08/2022 12:30:04:300.";
          data["time"] = "2022-08-10 12:30:04:300";
          loraSendData(output.as<String>());
          Serial.println("Enviou via LoRa: "+output.as<String>());
          
          continue;
          break;

        case 4:
          output["status"] = 1;
          output["message"] = "O interruptor foi acionado.";
          loraSendData(output.as<String>());
          Serial.println("Enviou via LoRa: "+output.as<String>());
          
          continue;
          break;
          
        default:
          output["status"] = 0;
          output["message"] = "Operação inválida.";
          loraSendData(output.as<String>());
          Serial.println("Enviou via LoRa: "+output.as<String>());
          
          continue;
          break;
      }
    }    
  }
}
