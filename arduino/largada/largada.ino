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
void setHour(String dateTime) {
    char time_char[21] = "";
    strcpy(time_char, dateTime.c_str()); 
    struct tm time_tm;
    
    strptime(time_char,"%Y-%m-%d %H:%M:%S",&time_tm);
  
    int  y = time_tm.tm_year + 1900, 
         m = time_tm.tm_mon + 1,
         d = time_tm.tm_mday,
         H = time_tm.tm_hour,
         M = time_tm.tm_min,
         S = time_tm.tm_sec;
  
    rtc.adjust(DateTime(y, m, d, H, M, S));
}

// LoRa
#include <SPI.h>
#include <LoRa.h>

#define SCK 5      // GPIO5  SCK
#define MISO 19    // GPIO19 MISO
#define MOSI 27    // GPIO27 MOSI
#define SS 18      // GPIO18 CS
#define RST 14     // GPIO14 RESET
#define DI00 26    // GPIO26 IRQ(Interrupt Request)
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

void setup() {
  setupLoRa();
  setupRTC();
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
