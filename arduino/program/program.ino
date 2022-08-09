#include <ArduinoJson.h>
#define ever (;;)

void setup() {
  Serial.begin(9600);
  while (!Serial) continue;
}

void loop() {
  for ever {
    StaticJsonDocument<500> input;
    StaticJsonDocument<500> output;
    JsonObject data = output.createNestedObject("data");
  
    if (Serial.available() <= 1)
      continue;
    
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
      case 1:
        switch(input["operation"].as<int>()) {
          case 1:
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
        
      case 2:
        output["status"] = 0;
        output["message"] = "Em desenvolvimento...";
        serializeJson(output, Serial);
        Serial.println();
      
        continue;
        break;
        
      case 3:
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
}
