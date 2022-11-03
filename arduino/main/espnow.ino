// 2.4GHz
uint8_t* espNowGetBroadcastAddress() {
  uint8_t broadcastAddress[6];

 if (DEVICE == 1) {
  broadcastAddress[0] = 0xC8;
  broadcastAddress[1] = 0xC9;
  broadcastAddress[2] = 0xA3;
  broadcastAddress[3] = 0xC8;
  broadcastAddress[4] = 0xBD;
  broadcastAddress[5] = 0x60;
 }

 if (DEVICE == 3) {
  broadcastAddress[0] = 0x99;
  broadcastAddress[1] = 0xB4;
  broadcastAddress[2] = 0x7E;
  broadcastAddress[3] = 0xFF;
  broadcastAddress[4] = 0x24;
  broadcastAddress[5] = 0x88;
 }

 return broadcastAddress;
}
void setupEspNow(){    
 WiFi.mode(WIFI_STA);
  
 while (esp_now_init() != ESP_OK) {
    Serial.println("Erro ao inicializar o ESP-NOW!");
 }

 // Register peer
 esp_now_peer_info_t peerInfo;
 memset(&peerInfo, 0, sizeof(peerInfo));
 for (int ii = 0; ii < 6; ++ii )
 {
    peerInfo.peer_addr[ii] = (uint8_t) espNowGetBroadcastAddress()[ii];
 }
 peerInfo.channel = 0;
 peerInfo.encrypt = false;

 // Add peer
 while (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("Failed to add peer");
 }

 esp_now_register_recv_cb(espNowOnReceiveData);
 //esp_now_register_send_cb(espNowOnDataSent);
}
void espNowSendData(String message) { 
  
  esp_now_send(espNowGetBroadcastAddress(), (uint8_t *) message.c_str(), strlen(message.c_str()) + 10);
};
void espNowOnReceiveData(const uint8_t * mac, const uint8_t *incomingData, int len) {
  char* buff = (char*) incomingData;        //char buffer
  dataReceived = String(buff);                  //converting into STRING
  espNowReceivedData = true;
}
void resetEspNowVars() {
  espNowReceivedData = false;
  dataReceived = "";
}
