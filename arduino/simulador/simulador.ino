// Interruptor
#define SWITCH 13
void setupSwitch() {
  pinMode(SWITCH,INPUT);
}
bool switchPush() {
    return digitalRead(SWITCH) == HIGH;
}

// Serial
void setupSerial(){
  Serial.begin(9600);
  
  while (!Serial) {
    Serial.println("Erro ao inicializar o Serial!");
  }
}

// Helper
#define ever (;;)
#include <ArduinoJson.h>

void setup() {
  setupSerial();
  setupSwitch();
}
void loop() {
  for ever {
    if (switchPush()) {

      StaticJsonDocument<500> output;
      JsonObject data = output.createNestedObject("data");
      
      delay(2000);
      output["device"] = 2;
      output["operation"] = 2;
      output["status"] = 1;
      output["message"] = "O competidor com RFID 14444 iniciou a prova.";
      data["time"] = "2022-08-29 20:00:00";
      data["rfid"] = "14444";
      Serial.println(output.as<String>());

      delay(2000);
      output["device"] = 2;
      output["operation"] = 2;
      output["status"] = 1;
      output["message"] = "O competidor com RFID 24444 iniciou a prova.";
      data["time"] = "2022-08-29 20:01:00";
      data["rfid"] = "24444";
      Serial.println(output.as<String>());

      delay(2000);
      output["device"] = 2;
      output["operation"] = 2;
      output["status"] = 1;
      output["message"] = "O competidor com RFID 34444 iniciou a prova.";
      data["time"] = "2022-08-29 20:02:00";
      data["rfid"] = "34444";
      Serial.println(output.as<String>());

      delay(2000);
      output["device"] = 2;
      output["operation"] = 2;
      output["status"] = 1;
      output["message"] = "O competidor com RFID 44444 iniciou a prova.";
      data["time"] = "2022-08-29 20:03:00";
      data["rfid"] = "44444";
      Serial.println(output.as<String>());

      /* ---------------------------------------------------------------------- */

      delay(2000);
      output["device"] = 3;
      output["operation"] = 2;
      output["status"] = 1;
      output["message"] = "O competidor com RFID 14444 finalizou a prova.";
      data["time"] = "2022-08-29 20:04:00";
      data["rfid"] = "14444";
      Serial.println(output.as<String>());

      delay(2000);
      output["device"] = 3;
      output["operation"] = 2;
      output["status"] = 1;
      output["message"] = "O competidor com RFID 24444 finalizou a prova.";
      data["time"] = "2022-08-29 20:05:00";
      data["rfid"] = "24444";
      Serial.println(output.as<String>());

      delay(2000);
      output["device"] = 3;
      output["operation"] = 2;
      output["status"] = 1;
      output["message"] = "O competidor com RFID 34444 finalizou a prova.";
      data["time"] = "2022-08-29 20:06:00";
      data["rfid"] = "34444";
      Serial.println(output.as<String>());

      delay(2000);
      output["device"] = 3;
      output["operation"] = 2;
      output["status"] = 1;
      output["message"] = "O competidor com RFID 44444 finalizou a prova.";
      data["time"] = "2022-08-29 20:07:00";
      data["rfid"] = "44444";
      Serial.println(output.as<String>());

    }
    
  }
}
