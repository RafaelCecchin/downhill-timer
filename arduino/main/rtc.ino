// RTC
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
