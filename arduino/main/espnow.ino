// 2.4GHz
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
    peerInfo.peer_addr[ii] = (uint8_t) broadcastAddress[ii];
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
  esp_now_send(broadcastAddress, (uint8_t *) message.c_str(), strlen(message.c_str()) + 10);
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
