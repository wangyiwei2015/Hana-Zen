#include <Arduino.h>

float s0 = 0.0;
float s1 = 0.0;
bool user_is_sitting = false;

void setup() {
  pinMode(A0, INPUT);
  pinMode(A1, INPUT);
  Serial.begin(9600);
}

void loop() {
  //Serial.print(digitalRead(A0));
  //Serial.print(" ");
  //Serial.println(digitalRead(A1));

  s0 = s0*4/5 + (float)digitalRead(A0)/5;
  s1 = s1*4/5 + (float)digitalRead(A1)/5;
  float s = s0 + s1; //0.2,1.8
  //Serial.println(s);

  if(s > 1.8) {
    if(user_is_sitting) {
      user_is_sitting = false;
      Serial.println("LVE");
    } else {
      Serial.println("NBD");
    }
  } else if(s < 0.2) {
    if(!user_is_sitting) {
      user_is_sitting = true;
      Serial.println("ETR");
    } else {
      Serial.println("STL");
    }
  } else {
    Serial.println("MOV");
  }
  
  delay(200);
}
