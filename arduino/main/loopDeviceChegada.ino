void loopDeviceChegada() {
  StaticJsonDocument<500> input;
  StaticJsonDocument<500> output;
  JsonObject data = output.createNestedObject("data");
  
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
    updateLastRfidTag();
  }
}
