#include "Keyboard.h"

float s0 = 0.0;
float s1 = 0.0;
bool user_is_sitting = false;
int currentState = 0;

void setup() {
  pinMode(A0, INPUT);
  pinMode(A1, INPUT);
  pinMode(13, OUTPUT);
  //Serial.begin(9600);
  Keyboard.begin();
}

void loop() {

  s0 = s0*4/5 + (float)digitalRead(A0)/5;
  s1 = s1*4/5 + (float)digitalRead(A1)/5;
  float s = s0 + s1; //0.2,1.8

  if(s > 1.8) {
    if(user_is_sitting) {
      user_is_sitting = false;
      //Serial.println("LVE");
      //if(currentState != 0) {
        digitalWrite(13, HIGH);
        Keyboard.press('L');
        currentState = 0;
      //}
    } else {
      //Serial.println("NBD");
    }
  } else if(s < 0.2) {
    if(!user_is_sitting) {
      user_is_sitting = true;
      //Serial.println("ETR");
      //if(currentState != 1) {
        digitalWrite(13, HIGH);
        Keyboard.press('E');
        currentState = 1;
      //}
    } else {
      //Serial.println("STL");
      //if(currentState != 2) {
        digitalWrite(13, HIGH);
        Keyboard.press('S');
        currentState = 2;
      //}
    }
  } else {
    //Serial.println("MOV");
    //if(currentState != 3) {
      digitalWrite(13, HIGH);
      Keyboard.press('M');
      currentState = 3;
    //}
  }
  
  delay(200);
  digitalWrite(13, LOW);
  Keyboard.releaseAll();
  delay(200);
}
