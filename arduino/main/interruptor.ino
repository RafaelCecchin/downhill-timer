// Interruptor
#define SWITCH 2

void setupSwitch() {
  pinMode(SWITCH,INPUT);
}
bool switchPush() {
    return digitalRead(SWITCH) == HIGH;
}