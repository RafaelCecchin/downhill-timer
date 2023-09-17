
#include <Wire.h>
#include "RTClib.h"
#include <TimeLib.h>
#define ever (;;)

RTC_DS3231 rtc;

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

const String rfids[] = {
  "123456", "234567", "345678", "456789",
  "789012", "890123", "901234", "101234"
};
const int quantityOfCompetitors = sizeof(rfids)/sizeof(rfids[0]);
unsigned long startTime;
const unsigned long timeoutDuration = 500;

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

String getHour() {
  DateTime now = rtc.now();
  
  char time[20];
  sprintf( time, "%04d-%02d-%02d %02d:%02d:%02d", now.year(), now.month(), now.day(), now.hour(), now.minute(), now.second() );
  
  return time;
}
void setHour(String dateTime) {
    int year, month, day, hour, minute, second;
    
    if (sscanf(dateTime.c_str(), "%d-%d-%d %d:%d:%d", &year, &month, &day, &hour, &minute, &second) == 6) {
        rtc.adjust(DateTime(year, month, day, hour, minute, second));
    }
}

int startButton = 7;
int startCount = 0;
int finishButton = 6;
int finishCount = 0;

bool startButtonPressed () {
  return digitalRead(startButton) == HIGH;  
}

bool finishButtonPressed () {
  return digitalRead(finishButton) == HIGH;  
}

void setupButtons() {
  pinMode(startButton, INPUT);
  pinMode(finishButton, INPUT);
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

void clearOutput(JSONData& output) {
  output.device = NULL;
  output.operation = NULL;
  output.status = NULL;
  output.message = "";
}

void setupRTC() {
    while (!rtc.begin()) {
      Serial.println("Erro ao inicializar o módulo RTC!");
    }

    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
}

void setup() {
  Serial.begin(9600);
  setupRTC();
  setupButtons();
}

void loop() {    
  for ever {
    JSONData input;
    JSONData output;
      
    if (startButtonPressed()) {

      if (finishCount >= quantityOfCompetitors && startCount >= quantityOfCompetitors) {
        startCount = 0;
        finishCount = 0;
      }
      
      if (startCount >= quantityOfCompetitors) {
        continue;
      }
            
      output.device = 2;
      output.operation = 2;
      output.status = 1;
      output.message = "Competidor [NOME_COMPETIDOR] (RFID " + rfids[startCount] + ") iniciou o circuito.";
      output.dataInfo.rfid = rfids[startCount];
      output.dataInfo.dateTime = getHour();
      
      sendData(output);
      
      startCount++;
      delay(500);
    }

    if (finishButtonPressed()) {
      
      if (finishCount >= quantityOfCompetitors || finishCount >= startCount) {
        continue;
      }
            
      output.device = 3;
      output.operation = 2;
      output.status = 1;
      output.message = "Competidor [NOME_COMPETIDOR] (RFID " + rfids[finishCount] + ") finalizou o circuito.";
      output.dataInfo.rfid = rfids[finishCount];
      output.dataInfo.dateTime = getHour();
      
      sendData(output);
      
      finishCount++;
      delay(500);
    }
    
    if (hasSerialData()) {
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
          
          setHour(input.dataInfo.dateTime);
          output.dataInfo.dateTime = input.dataInfo.dateTime;
          output.status = 1;
          output.message = "A data e hora identificada foi " + getHour();
          sendData(output);

          break;

        case 4:

          int startTime = millis();
          bool buttonPressed = false;
          
          while (millis() - startTime < 5000) {
            if (startButtonPressed() || finishButtonPressed()) {
              output.status = 1;
              output.message = "O interruptor foi acionado.";
              sendData(output);
  
              buttonPressed = true;
              break;
            }
          }         
  
          break;
  
        default:
          output.status = 0;
          output.message = "Operação inválida.";
          sendData(output);
  
          break;
      }

      clearOutput(output);
    }
  }
}
