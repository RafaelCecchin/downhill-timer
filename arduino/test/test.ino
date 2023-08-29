#include <TimeLib.h>
#define ever (;;)

struct DataInfo {
  String rfid;
  String dateTime;
};
struct JSONData {
  int device;
  int operation;
  int status;
  String message;
  DataInfo dataInfo;
};

unsigned long startTime;
const unsigned long timeoutDuration = 500;
const String rfids[] = {
  "123456", "234567", "345678", "456789", "567890", "678901",
  "789012", "890123", "901234", "101234", "102345", "103456"
};

void sendData(const JSONData& jsonData) {
  String jsonString = "";
  
  if (jsonData.device >= 0) {
    jsonString += "\"device\":\"" + String(jsonData.device) + "\"";
  }
  
  if (jsonData.operation >= 0) {
    if (jsonString.length()) {
      jsonString += ",";
    }
    
    jsonString += "\"operation\":\"" + String(jsonData.operation) + "\"";
  }
  
  if (jsonData.status >= 0) {
    if (jsonString.length()) {
      jsonString += ",";
    }
    jsonString += "\"status\":\"" + String(jsonData.status) + "\"";
  }
  
  if (jsonData.message.length()) {
    if (jsonString.length()) {
      jsonString += ",";
    }
    jsonString += "\"message\":\"" + jsonData.message + "\"";
  }
  
  if (jsonData.dataInfo.rfid.length() || jsonData.dataInfo.dateTime.length()) {
    if (jsonString.length()) {
      jsonString += ",";
    }
    
    jsonString += "\"data\":{";
    if (jsonData.dataInfo.rfid.length()) {
      jsonString += "\"rfid\":\"" + jsonData.dataInfo.rfid + "\"";
    }
    if (jsonData.dataInfo.dateTime.length()) {
      if (jsonData.dataInfo.rfid.length()) {
        jsonString += ",";
      }
      jsonString += "\"dateTime\":\"" + jsonData.dataInfo.dateTime + "\"";
    }
    jsonString += "}";
  }
  
  Serial.print("{");
  Serial.print(jsonString);
  Serial.print("}");

  Serial.println();
}
bool isValidJSON(String str) {
    if (str.length() == 0 || (str.charAt(0) != '{' && str.charAt(str.length() - 1) != '}')) {
        return false; // JSON deve começar e terminar com chaves
    }

    int curlyBraces = 0;
    int squareBrackets = 0;
    bool inString = false;
    bool escapeNext = false;

    for (int i = 0; i < str.length(); i++) {
        char c = str.charAt(i);

        if (inString) {
            if (escapeNext) {
                escapeNext = false;
            } else if (c == '\\') {
                escapeNext = true;
            } else if (c == '"') {
                inString = false;
            }
        } else {
            if (c == '"') {
                inString = true;
            } else if (c == '{') {
                curlyBraces++;
            } else if (c == '}') {
                curlyBraces--;
            } else if (c == '[') {
                squareBrackets++;
            } else if (c == ']') {
                squareBrackets--;
            }
        }
    }

    return curlyBraces == 0 && squareBrackets == 0;
}
JSONData parseJSON(const String& jsonString) {
    JSONData jsonData;
    String compactJsonString = jsonString;
    String cleanedJsonString = "";
    bool insideString = false;
    
    for (char c : compactJsonString) {
        if (c == '"') {
            insideString = !insideString;
        }

        if (!insideString && (c == ' ' || c == '\n' || c == '\r' || c == '\t')) {
            continue;
        }

        cleanedJsonString += c;
    }

    // Parse 'device'
    int devicePos = cleanedJsonString.indexOf("\"device\":");
    if (devicePos != -1) {
        int deviceEnd = devicePos + 11;
        if (deviceEnd != -1) {
            jsonData.device = cleanedJsonString.substring(devicePos + 10, deviceEnd).toInt();
        }
    }

    // Parse 'operation'
    int operationPos = cleanedJsonString.indexOf("\"operation\":");
    if (operationPos != -1) {
        int operationEnd = operationPos + 14;
        if (operationEnd != -1) {
            jsonData.operation = cleanedJsonString.substring(operationPos + 13, operationEnd).toInt();
        }
    }

    // Parse 'rfid'
    int rfidPos = cleanedJsonString.indexOf("\"rfid\":");
    if (rfidPos != -1) {
        int rfidEnd = cleanedJsonString.indexOf('"', rfidPos + 9);
        if (rfidEnd != -1) {
            jsonData.dataInfo.rfid = cleanedJsonString.substring(rfidPos + 8, rfidEnd);
        }
    }

    // Parse 'dateTime'
    int dateTimePos = cleanedJsonString.indexOf("\"dateTime\":");
    if (dateTimePos != -1) {
        int dateTimeEnd = cleanedJsonString.indexOf('"', dateTimePos + 13);
        if (dateTimeEnd != -1) {
            jsonData.dataInfo.dateTime = cleanedJsonString.substring(dateTimePos + 12, dateTimeEnd);
        }
    }

    return jsonData;
}

String getFormattedDateTime(String dt){
  int year, month, day, hour, minute, second;
  char formattedDateTime[25];

  sscanf(dt.c_str(), "%d-%d-%d %d:%d:%d", &year, &month, &day, &hour, &minute, &second);
  snprintf(formattedDateTime, sizeof(formattedDateTime), "%02d/%02d/%04d %02d:%02d:%02d", day, month, year, hour, minute, second);
  
  return formattedDateTime;
}

bool finishRace = false;
void startRace() {
  if (finishRace) {
    return;
  }
  
  JSONData output;
  
  output.operation = 2;
  output.status = 1;

  tmElements_t tm;
  tm.Year = 53;   // Ano 2023 (anos desde 1970)
  tm.Month = 9;   // Mês 
  tm.Day = 5;     // Dia
  tm.Hour = 0;    // Hora
  tm.Minute = 0;  // Minuto
  tm.Second = 0;  // Segundo
  
  for (int device = 2; device < 4; device++) {
    output.device = device;

    if (device == 3) {
      tm.Minute = 4;
    }
    
    for (int i = 0; i < 12; i++) {
      String message = "Competidor [NOME_COMPETIDOR] (RFID " + rfids[i] + ") ";
      if (device == 2) {
        message += "iniciou o circuito.";
      }
      if (device == 3) {
        message += "finalizou o circuito.";
      }
      
      output.message = message;
      output.dataInfo.rfid = rfids[i];

      tm.Minute++;
      tm.Second += random(35,55);
      time_t t = makeTime(tm);
      char dateTimeStr[25];
      sprintf(dateTimeStr, "%04d-%02d-%02d %02d:%02d:%02d", year(t), month(t), day(t), hour(t), minute(t), second(t));
      
      output.dataInfo.dateTime = dateTimeStr;

      sendData(output);
      delay(20);
    }
  }
        
  finishRace = true;
}

bool hasSerialData() {
  return Serial.available() > 1;
}
String getSerialData() {
  startTime = millis();
  String received = "";

  while (millis() - startTime < timeoutDuration) {
    if (Serial.available()) {
      char c = Serial.read();
      received += c;
    }
  }

  return received;
}

void setup() {
  Serial.begin(9600);
}

void loop() {
  startRace();
  
  for ever {
    if (hasSerialData()) {

      JSONData input;
      JSONData output;

      String received = getSerialData();

      if (!isValidJSON(received)) {
        output.device = NULL;
        output.operation = NULL;
        output.status = 0;
        output.message =  "JSON inválido.";
        sendData(output);

        continue;
      }

      input = parseJSON(received);      
      output.device = input.device;
      output.operation = input.operation;

      switch (input.operation) {
        case 1:
          output.status = 1;
          output.message = "Conexão realizada com sucesso.";
          sendData(output);
  
          break;
  
        case 2:
          output.status = 1;
          output.message = "Competidor de RFID 34434 identificado com sucesso.";
          output.dataInfo.rfid = "34434";
          sendData(output);
  
          break;
  
        case 3:          
          if (!input.dataInfo.dateTime.length()) {
            output.status = 0;
            output.message = "A data e hora não foi informada para o ajuste.";
            sendData(output);
            
            break;
          }
          
          output.dataInfo.dateTime = input.dataInfo.dateTime;
          output.status = 1;
          output.message = "A data e hora identificada foi " + getFormattedDateTime(input.dataInfo.dateTime);
          sendData(output);

          break;

        case 4:
          output.status = 1;
          output.message = "O interruptor foi acionado.";
          sendData(output);
  
          break;
  
        default:
          output.status = 0;
          output.message = "Operação inválida.";
          sendData(output);
  
          break;
      }    
    }
  }
}
