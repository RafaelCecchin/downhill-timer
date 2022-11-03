void loopDeviceCentral() {
  StaticJsonDocument<500> input;
  StaticJsonDocument<500> output;
  JsonObject data = output.createNestedObject("data");
  
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
