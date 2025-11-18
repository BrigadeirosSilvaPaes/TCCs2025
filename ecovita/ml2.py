# ml2_dual_head.py
# Rede neural com duas cabeças:
# 1) Previsão das concentrações de gases (regressão contínua)
# 2) Geração de features compactas para alimentar outro modelo (ML-1)
# Dependências: numpy, pandas, scikit-learn, tensorflow, joblib
# pip install numpy pandas scikit-learn tensorflow joblib

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping
import joblib
import os

# -------------------------
# Configurações globais / Hiperparâmetros
# -------------------------
RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)
tf.random.set_seed(RANDOM_SEED)

N_SAMPLES = 8000         # Quantidade de leituras simuladas
SEQ_WINDOW = 5           # Janela para média móvel (para suavizar dados temporais)
TEST_SIZE = 0.2
BATCH_SIZE = 32
EPOCHS = 200

MODEL_DIR = "./ml2_artifacts"   # Diretório para salvar modelo e scalers
os.makedirs(MODEL_DIR, exist_ok=True)

# -------------------------
# 1) Definição dos gases alvo (cabeça 1)
# -------------------------
gases = ["Metano", "Amonia", "H2S", "Acetona", "Etanol", "Formaldeído"]
NUM_GASES = len(gases)

# -------------------------
# 2) Sensores (entradas)
# -------------------------
# Sensores MQ, CCS e BME (analógicos/I2C)
sensor_names = [
    "MQ2","MQ4","MQ135","MQ136",
    "CCS_TVOC","CCS_eCO2",
    "BME_Temp","BME_Hum","BME_Press"
]
NUM_SENSORS = len(sensor_names)

# -------------------------
# 3) Simulação de dados ambientais e leituras
# -------------------------

def simulate_environment(n):
    """
    Simula o ambiente: temperatura, umidade, pressão
    e concentrações verdadeiras dos gases (ppb)
    """
    temp = np.random.uniform(15, 35, size=n)
    hum  = np.random.uniform(15, 85, size=n)
    press = np.random.uniform(995, 1025, size=n)
    
    # Simula concentrações de gases (ppb), com ruído e correlações
    metano = np.abs(np.random.normal(200, 80, size=n))
    amonia = np.abs(np.random.normal(50, 30, size=n))
    h2s    = np.abs(np.random.normal(20, 15, size=n))
    acetona= np.abs(np.random.normal(30, 25, size=n))
    etanol = np.abs(np.random.normal(40, 35, size=n))
    formal = np.abs(np.random.normal(10, 8, size=n))
    
    concentrations = np.vstack([metano, amonia, h2s, acetona, etanol, formal]).T
    env = pd.DataFrame({"temp": temp, "hum": hum, "press": press})
    return concentrations, env

def simulate_sensors_from_gases(conc, env):
    """
    Gera leituras de sensores a partir das concentrações e ambiente.
    Considera:
    - Sensibilidade de cada sensor a diferentes gases
    - Efeito ambiental (temp, hum, press)
    - Ruído aleatório
    """
    n = conc.shape[0]
    # Pesos de influência de cada gás sobre cada sensor
    weights = np.array([
        [0.1, 0.02, 0.01, 0.12, 0.2, 0.01],  # MQ2
        [0.6, 0.01, 0.0,  0.02, 0.03, 0.0 ],  # MQ4
        [0.05,0.4, 0.02, 0.05, 0.06, 0.03],   # MQ135
        [0.01,0.02,0.6,  0.01, 0.01, 0.0 ],   # MQ136
        [0.02,0.1,0.01, 0.15, 0.2, 0.02],     # CCS TVOC
        [0.03,0.05,0.01, 0.02, 0.03, 0.01]    # CCS eCO2
    ])
    # Efeito ambiental sobre cada sensor
    env_weights = np.array([
        [0.01, -0.008, 0.0005],
        [0.005, -0.006, 0.0002],
        [0.012, -0.01,  0.0006],
        [0.008, -0.007, 0.0004],
        [0.006, -0.005, 0.0003],
        [0.004, -0.003, 0.0002]
    ])
    
    sensors = []
    for i in range(weights.shape[0]):
        base = conc.dot(weights[i])
        env_effect = (env.values * env_weights[i]).sum(axis=1)
        noise = np.random.normal(0, 0.05 * (np.std(base)+1e-6), size=base.shape)
        reading = base + env_effect + noise
        sensors.append(reading)
    
    sensors = np.vstack(sensors).T
    
    # Ajustes para CCS e MQ analogicos
    ccs_tvoc = (sensors[:,4] * 1.2) + np.random.normal(0,5,size=sensors.shape[0])
    ccs_eco2 = (sensors[:,5] * 2.5) + np.random.normal(0,10,size=sensors.shape[0])
    mq2 = sensors[:,0] * 3.0 + np.random.normal(0,10,size=sensors.shape[0])
    mq4 = sensors[:,1] * 4.0 + np.random.normal(0,10,size=sensors.shape[0])
    mq135= sensors[:,2] * 2.5 + np.random.normal(0,10,size=sensors.shape[0])
    mq136= sensors[:,3] * 5.0 + np.random.normal(0,5,size=sensors.shape[0])
    
    # Sensores BME com ruído
    bme_temp = env["temp"].values + np.random.normal(0,0.2,size=env.shape[0])
    bme_hum  = env["hum"].values + np.random.normal(0,1.5,size=env.shape[0])
    bme_press= env["press"].values + np.random.normal(0,0.5,size=env.shape[0])
    
    # Cria dataframe final
    df = pd.DataFrame({
        "MQ2": mq2, "MQ4": mq4, "MQ135": mq135, "MQ136": mq136,
        "CCS_TVOC": ccs_tvoc, "CCS_eCO2": ccs_eco2,
        "BME_Temp": bme_temp, "BME_Hum": bme_hum, "BME_Press": bme_press
    })
    return df

# -------------------------
# 3a) Gerar dataset completo
# -------------------------
concentrations, env = simulate_environment(N_SAMPLES)
sensors_df = simulate_sensors_from_gases(concentrations, env)
df = pd.concat([sensors_df.reset_index(drop=True), env.reset_index(drop=True)], axis=1)
for i, gas in enumerate(gases):
    df[gas] = concentrations[:, i]  # adiciona valores reais dos gases (targets cabeça 1)

# -------------------------
# 4) Pré-processamento / Normalizações
# -------------------------
# Normaliza sensores MQ usando média móvel (Ro)
for s in ["MQ2","MQ4","MQ135","MQ136"]:
    df[s + "_ro"] = df[s].rolling(window=SEQ_WINDOW, min_periods=1).median()
    df[s + "_cal"] = df[s] / (df[s + "_ro"] + 1e-8)

# Features extras: média móvel e derivadas para capturar tendência
for s in ["MQ2","MQ4","MQ135","MQ136","CCS_TVOC","CCS_eCO2"]:
    df[s + "_ma"] = df[s].rolling(window=SEQ_WINDOW, min_periods=1).mean()
    df[s + "_diff"] = df[s].diff().fillna(0)

input_cols = [
    "MQ2_cal","MQ4_cal","MQ135_cal","MQ136_cal",
    "CCS_TVOC_ma","CCS_eCO2_ma",
    "BME_Temp","BME_Hum","BME_Press",
    "MQ2_ma","MQ4_ma","MQ135_ma","MQ136_ma",
    "MQ2_diff","MQ4_diff","MQ135_diff","MQ136_diff"
]
df = df.reset_index(drop=True).dropna().reset_index(drop=True)
X = df[input_cols].values

# -------------------------
# 5) Targets (Heads)
# -------------------------
y_head1 = df[gases].values  # cabeça 1: concentração contínua de gases
# cabeça 2: features sintéticas compactas (toxicidade, score químico, ajuste PEL)
conc_norm = (y_head1 / (np.max(y_head1, axis=0, keepdims=True) + 1e-8))
toxicidade_est = conc_norm.sum(axis=1)
classe_quim_score = (conc_norm[:,1]*1.5 + conc_norm[:,2]*1.2 + conc_norm[:,0]*0.6)
pel_adjust = 1.0 / (1.0 + np.exp(-(conc_norm.sum(axis=1)-1.5)))
y_head2 = np.vstack([toxicidade_est, classe_quim_score, pel_adjust]).T

# -------------------------
# 6) Normalização dos inputs
# -------------------------
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# -------------------------
# 7) Divisão treino/teste
# -------------------------
X_train, X_test, y1_train, y1_test, y2_train, y2_test = train_test_split(
    X_scaled, y_head1, y_head2, test_size=TEST_SIZE, random_state=RANDOM_SEED
)

# -------------------------
# 8) Modelo dual-head
# -------------------------
inp = Input(shape=(X_train.shape[1],), name="entrada")
x = Dense(256, activation='relu')(inp)
x = BatchNormalization()(x)
x = Dropout(0.3)(x)
x = Dense(128, activation='relu')(x)
x = BatchNormalization()(x)
x = Dropout(0.2)(x)
x = Dense(64, activation='relu')(x)

# Cabeça 1: gases
out_gases = Dense(NUM_GASES, activation='linear', name="saida_gases")(x)

# Cabeça 2: features compactas
out_features = Dense(32, activation='relu')(x)
out_features = Dropout(0.15)(out_features)
out_features = Dense(3, activation='linear', name="saida_compacta")(out_features)

model = Model(inputs=inp, outputs=[out_gases, out_features])
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    loss={"saida_gases":"mse", "saida_compacta":"mse"},
    loss_weights={"saida_gases":1.0, "saida_compacta":0.5},
    metrics={"saida_gases":["mae"], "saida_compacta":["mae"]}
)
model.summary()

# -------------------------
# 9) Treinamento
# -------------------------
early_stop = EarlyStopping(monitor='val_loss', patience=15, restore_best_weights=True, verbose=1)
history = model.fit(
    X_train, {"saida_gases":y1_train,"saida_compacta":y2_train},
    validation_split=0.15,
    epochs=EPOCHS,
    batch_size=BATCH_SIZE,
    callbacks=[early_stop],
    verbose=2
)

# -------------------------
# 10) Avaliação
# -------------------------
eval_res = model.evaluate(X_test, {"saida_gases":y1_test,"saida_compacta":y2_test}, verbose=0)
print("\n=== Avaliação completa ===")
print(eval_res)

y1_pred, y2_pred = model.predict(X_test)
print(f"\nHead1 (Gases) - MSE: {mean_squared_error(y1_test,y1_pred):.4f}, MAE: {mean_absolute_error(y1_test,y1_pred):.4f}")
print(f"Head2 (Compact) - MSE: {mean_squared_error(y2_test,y2_pred):.4f}, MAE: {mean_absolute_error(y2_test,y2_pred):.4f}")

# -------------------------
# 11) Salvar artefatos
# -------------------------
model.save(os.path.join(MODEL_DIR,"ml2_dual_head.h5"))
joblib.dump(scaler, os.path.join(MODEL_DIR,"scaler_ml2.pkl"))
print(f"Modelos e scalers salvos em: {MODEL_DIR}")

# -------------------------
# 12) Função de predição para ML-1
# -------------------------
def ml2_predict_single(raw_sensor_dict, scaler_obj, model_obj):
    """
    Recebe dict com leituras brutas -> retorna estimativa de gases e features compactas
    """
    row = np.array([raw_sensor_dict.get(c,0.0) for c in input_cols]).reshape(1,-1)
    row_scaled = scaler_obj.transform(row)
    gases_pred, compact_pred = model_obj.predict(row_scaled)
    return gases_pred.flatten(), compact_pred.flatten()
