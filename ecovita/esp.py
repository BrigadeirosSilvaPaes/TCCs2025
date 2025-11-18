import machine
import time
import network
import urequests as requests
import ujson as json

# -------- CONFIGURAÇÕES DO WIFI --------
SSID = "SEU_WIFI"
PASSWORD = "SUA_SENHA_WIFI"

# -------- URL DA API --------
API_URL = "http://192.168.0.10:8000/esp32/leitura"  # Substitua pelo endpoint da sua API

# -------- CONEXÃO WIFI --------
def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)
    while not wlan.isconnected():
        print("Conectando ao Wi-Fi...")
        time.sleep(1)
    print("Wi-Fi conectado!", wlan.ifconfig())

connect_wifi()

# -------- SERIAL COM ARDUINO MEGA --------
uart = machine.UART(2, tx=17, rx=16, baudrate=9600)  # ajuste pinos conforme sua ligação

# -------- LOOP PRINCIPAL --------
while True:
    if uart.any():
        try:
            # Lê a linha recebida do Mega
            linha = uart.readline().decode('utf-8').strip()
            print("Recebido do Mega:", linha)

            # Valida se é JSON
            dados = json.loads(linha)

            # Envia POST para API
            response = requests.post(API_URL, json=dados, headers={"Content-Type": "application/json"})
            print("Status da API:", response.status_code, "Resposta:", response.text)
            response.close()

        except Exception as e:
            print("Erro:", e)
    
    time.sleep(2)
