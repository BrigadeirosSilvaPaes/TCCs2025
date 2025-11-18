#include <DHT.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// === PINOS ===
#define DHTPIN 8
#define DHTTYPE DHT11

#define SENSOR_NIVEL 3
#define BOMBA_AGUA 4
#define BOMBA_AR 5
#define VALVULA_SOLENOIDE 6
#define PIN_RELE_LAMPADA 7

#define MQ2_PIN A0
#define MQ135_PIN A1
#define MQ136_PIN A2
#define PH_PIN A3
#define SOLO_UMID_PIN A4

// === LCD I2C ===
LiquidCrystal_I2C lcd(0x27, 16, 2);

// === OBJETOS E VARIÁVEIS ===
DHT dht(DHTPIN, DHTTYPE);
unsigned long tempoAtual, tempoUltimoAr = 0;
const unsigned long intervaloAr = 10000;

float tempSetpoint = 40.0;
float umidSetpoint = 50.0;

// Média móvel
#define WINDOW_SIZE 10
float tempBuffer[WINDOW_SIZE] = {0};
float umidBuffer[WINDOW_SIZE] = {0};
float phBuffer[WINDOW_SIZE] = {0};
int indexBuffer = 0;
bool bufferCheio = false;

// Função de média móvel
float mediaMovel(float *buffer, int size) {
  float soma = 0;
  for (int i = 0; i < size; i++) soma += buffer[i];
  return soma / size;
}

// === SETUP ===
void setup() {
  Serial.begin(9600);  // Debug
  Serial1.begin(9600); // Envio para ESP32

  dht.begin();
  pinMode(BOMBA_AGUA, OUTPUT);
  pinMode(BOMBA_AR, OUTPUT);
  pinMode(VALVULA_SOLENOIDE, OUTPUT);
  pinMode(PIN_RELE_LAMPADA, OUTPUT);
  pinMode(SENSOR_NIVEL, INPUT);

  // Estado inicial dos atuadores
  digitalWrite(BOMBA_AGUA, LOW);
  digitalWrite(BOMBA_AR, LOW);
  digitalWrite(VALVULA_SOLENOIDE, HIGH);
  digitalWrite(PIN_RELE_LAMPADA, LOW);

  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Composteira");
  lcd.setCursor(0, 1);
  lcd.print("Iniciada");
  delay(2000);

  Serial.println("Arduino Mega OK");
}

// === LOOP PRINCIPAL ===
void loop() {
  tempoAtual = millis();

  // --- Leitura dos sensores ---
  float umidade = dht.readHumidity();
  float temperatura = dht.readTemperature();

  if (isnan(umidade) || isnan(temperatura)) {
    Serial.println("Erro leitura DHT");
    return;
  }

  int phRaw = analogRead(PH_PIN);
  float ph = (phRaw * 14.0) / 1023.0;

  int soloRaw = analogRead(SOLO_UMID_PIN);
  int umidSolo = constrain(map(soloRaw, 1023, 400, 0, 100), 0, 100);

  // Atualiza buffers
  tempBuffer[indexBuffer] = temperatura;
  umidBuffer[indexBuffer] = umidade;
  phBuffer[indexBuffer] = ph;

  indexBuffer = (indexBuffer + 1) % WINDOW_SIZE;
  if (indexBuffer == 0) bufferCheio = true;

  int n = bufferCheio ? WINDOW_SIZE : indexBuffer;
  float tempMedia = mediaMovel(tempBuffer, n);
  float umidMedia = mediaMovel(umidBuffer, n);
  float phMedia = mediaMovel(phBuffer, n);

  // --- Controle de atuadores ---
  static bool lampadaLigada = false;
  lampadaLigada = (tempMedia < tempSetpoint - 2) ? true : (tempMedia > tempSetpoint + 2) ? false : lampadaLigada;
  digitalWrite(PIN_RELE_LAMPADA, lampadaLigada);

  digitalWrite(BOMBA_AGUA, umidMedia < umidSetpoint);

  if (tempoAtual - tempoUltimoAr >= intervaloAr) {
    digitalWrite(BOMBA_AR, HIGH);
    delay(2000);
    digitalWrite(BOMBA_AR, LOW);
    tempoUltimoAr = tempoAtual;
  }

  digitalWrite(VALVULA_SOLENOIDE, digitalRead(SENSOR_NIVEL) == HIGH ? LOW : HIGH);

  // --- Leitura dos gases ---
  float mq2PPM = map(analogRead(MQ2_PIN), 0, 1023, 0, 1000);
  float mq135PPM = map(analogRead(MQ135_PIN), 0, 1023, 0, 1000);
  float mq136PPM = map(analogRead(MQ136_PIN), 0, 1023, 0, 1000);

  // --- Envia JSON para ESP32 ---
  Serial1.print("{\"temperatura\":"); Serial1.print(tempMedia, 2);
  Serial1.print(",\"umidade\":"); Serial1.print(umidMedia, 2);
  Serial1.print(",\"ph\":"); Serial1.print(phMedia, 2);
  Serial1.print(",\"umidSolo\":"); Serial1.print(umidSolo);
  Serial1.print(",\"gases\":[");
  Serial1.print("{\"composto\":\"Metano\",\"ppm\":"); Serial1.print(mq2PPM * 0.4, 2); Serial1.print("},");
  Serial1.print("{\"composto\":\"Hidrogênio\",\"ppm\":"); Serial1.print(mq2PPM * 0.3, 2); Serial1.print("},");
  Serial1.print("{\"composto\":\"Álcool\",\"ppm\":"); Serial1.print(mq2PPM * 0.2, 2); Serial1.print("},");
  Serial1.print("{\"composto\":\"Fumaça\",\"ppm\":"); Serial1.print(mq2PPM * 0.1, 2); Serial1.print("},");
  Serial1.print("{\"composto\":\"Amônia\",\"ppm\":"); Serial1.print(mq135PPM * 0.3, 2); Serial1.print("},");
  Serial1.print("{\"composto\":\"Benzeno\",\"ppm\":"); Serial1.print(mq135PPM * 0.2, 2); Serial1.print("},");
  Serial1.print("{\"composto\":\"Formaldeído\",\"ppm\":"); Serial1.print(mq135PPM * 0.2, 2); Serial1.print("},");
  Serial1.print("{\"composto\":\"CO\",\"ppm\":"); Serial1.print(mq135PPM * 0.2, 2); Serial1.print("},");
  Serial1.print("{\"composto\":\"CO2\",\"ppm\":"); Serial1.print(mq135PPM * 0.1, 2); Serial1.print("},");
  Serial1.print("{\"composto\":\"H2S\",\"ppm\":"); Serial1.print(mq136PPM * 0.6, 2); Serial1.print("},");
  Serial1.print("{\"composto\":\"SO2\",\"ppm\":"); Serial1.print(mq136PPM * 0.4, 2); Serial1.print("}]}");
  Serial1.println();

  // --- LCD ---
  lcd.setCursor(0, 0);
  lcd.print("T:"); lcd.print(tempMedia, 1); lcd.print("C U:"); lcd.print(umidMedia, 1); lcd.print("%");

  lcd.setCursor(0, 1);
  lcd.print("pH:"); lcd.print(phMedia, 1); lcd.print(" S:"); lcd.print(umidSolo); lcd.print("%");

  delay(1000);
}
