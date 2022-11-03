#define ever (;;)
#include <ArduinoJson.h>
#include <esp_now.h>
#include <WiFi.h>
#include <SPI.h>
#include <LoRa.h>
#include <Wire.h>
#include "RTClib.h"
#include "FS.h"
#include "SD.h"
#include "SPI.h"

String dataReceived;
bool espNowReceivedData = false;
uint8_t broadcastAddress[] = {0x99, 0xB4, 0x7E, 0xFF, 0x24, 0x88};

String lastRfidTag = "";

#define DEVICE 1
//Devices
//    - 1 = Central
//    - 2 = Largada
//    - 3 = Chegada


void setup() {
  setupDevice();
}

void loop() {
  loopDevice();
}
