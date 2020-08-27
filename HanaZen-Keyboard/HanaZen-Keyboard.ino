#include "Keyboard.h"

float s0 = 0.0;
float s1 = 0.0;
bool user_is_sitting = false;
int currentState = 0;
int pState = 0;
int leaveCounter = 0;

void setup() {
  pinMode(A0, INPUT);
  pinMode(A1, INPUT);
//  pinMode(13, OUTPUT);
  pinMode(11,OUTPUT);
  digitalWrite(11,HIGH);
  //Serial.begin(9600);
  Keyboard.begin();
}

void loop() {
  s0 = s0*3/4 + (1.0-(float)digitalRead(A0))*1/4;
  s1 = s1*3/4 + (1.0-(float)digitalRead(A1))*1/4;
  float s = s0 + s1; //0.2,1.8
  if(s > 1.8 && user_is_sitting) {
    if(leaveCounter<30){
      leaveCounter++;
    }else{
      leaveCounter = 0;
      user_is_sitting = false;
//      digitalWrite(13, HIGH);
      Keyboard.press('l');
      digitalWrite(11,HIGH);
      currentState = 0;//
    }
  } else if(s < 0.5) {
    if(!user_is_sitting) {
      user_is_sitting = true;
//        digitalWrite(13, HIGH);
        Keyboard.press('e');
        digitalWrite(11,LOW);
        currentState = 1;
    } else {
//        digitalWrite(13, HIGH);
        Keyboard.press('s');
        currentState = 2;
    }
  } else {
    if (user_is_sitting) {
//      digitalWrite(13, HIGH);
      Keyboard.press('m');
      currentState = 3;
    } else {
      //A0 left  A1 right
      if(digitalRead(A1) && digitalRead(A0) && pState != 3){
        Keyboard.press('3');
        pState = 3;
      }else if(digitalRead(A1) && !digitalRead(A0) && pState != 1){
        Keyboard.press('1');
        pState = 1;
      }else if(!digitalRead(A1) && digitalRead(A0) && pState != 2){
        Keyboard.press('2');
        pState = 2;
      }else if(!digitalRead(A1) && !digitalRead(A0) && pState != 0){
        Keyboard.press('0');
        pState = 0;
      }
    }
  }
  
  delay(150);
//  digitalWrite(13, LOW);
  Keyboard.releaseAll();
  delay(150);
}
