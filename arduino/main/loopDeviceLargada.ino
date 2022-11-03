void loopDeviceLargada() {
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
          setHour(input["data"]["dateTime"].as<String>());
          output["message"] = "A data e hora identificada foi " + getHour();
          data["time"] = getHour();
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
  
    // Interruptor
    if (switchPush()) {
      output["device"] = 2;
      output["operation"] = 4;
      output["status"] = 1;
      output["message"] = "O interruptor de largada foi acionado.";
      data["time"] = getHour();
      loraSendData(output.as<String>());
      serializeJson(output, Serial);
      Serial.println();
    }
  }
}
