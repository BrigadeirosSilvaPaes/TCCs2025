# ml3_context_filter.py
# ML-3: Classificador de fase + score de coerência (filtro contextual para ML-1)
# Dependências: numpy, pandas, scikit-learn, tensorflow, joblib
# pip install numpy pandas scikit-learn tensorflow joblib

import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping
import joblib


# ---------------------------
# Config poeticamente técnico
# ---------------------------
RND = 42
np.random.seed(RND)
tf.random.set_seed(RND)

MODEL_DIR = "./ml3_artifacts"
os.makedirs(MODEL_DIR, exist_ok=True)

# ---------------------------
# 1) Conceito de fases
# ---------------------------
fase_labels = ["Inicial", "Termofilica", "Maturacao"]
n_classes = len(fase_labels)

# ---------------------------
# 2) Simulação de dataset
# ---------------------------
def simulate_ml3_data(n=5000):
    """
    Simula Temp (°C), pH, Umidade (%), O2 (%), Tempo (dias).
    Produz label de fase e um score de coerência sintético (0-1) que
    representa se leituras gasosas (ML-1) fariam sentido naquele contexto.
    """
    # Distribuições plausíveis
    temp = np.concatenate([
        np.random.normal(30, 3, size=int(n*0.35)),  # inicial -> moderado
        np.random.normal(60, 6, size=int(n*0.35)),  # termofílica -> alto
        np.random.normal(35, 4, size=int(n*0.30))   # maturação -> médio
    ])[:n]
    ph = np.concatenate([
        np.random.normal(7.5, 0.4, size=int(n*0.35)),  # inicial
        np.random.normal(8.2, 0.3, size=int(n*0.35)),  # termofílica (píc)
        np.random.normal(6.8, 0.5, size=int(n*0.30))   # maturação
    ])[:n]
    hum = np.concatenate([
        np.random.normal(60, 8, size=int(n*0.35)),  # inicial
        np.random.normal(45, 6, size=int(n*0.35)),  # termofílica (mais seco)
        np.random.normal(50, 7, size=int(n*0.30))   # maturação
    ])[:n]
    o2 = np.abs(np.random.normal(15, 5, size=n))  # % O2 ambiente/na pilha
    tempo = np.concatenate([
        np.random.uniform(0, 10, size=int(n*0.35)),   # inicial dias
        np.random.uniform(5, 30, size=int(n*0.35)),   # termofílica dias
        np.random.uniform(20, 120, size=int(n*0.30))  # maturação dias
    ])[:n]

    # Criar fase baseada em regras simples (ground truth)
    fase = []
    for t, phv, humv, tempv in zip(tempo, ph, hum, temp):
        if tempv > 50 and 5 <= t <= 30:
            fase.append("Termofilica")
        elif t < 7:
            fase.append("Inicial")
        else:
            fase.append("Maturacao")
    fase = np.array(fase)

    # Score de coerência sintético:
    # se a fase for Termofílica e ML-1 acusa gases típicos de putrefação (ex: amônia alta), coerência alta.
    # Vamos simular um score que depende de quão "esperado" é o estado ambiental.
    # Aqui usamos uma função que favorece valores ambientais típicos para a fase.
    score = []
    for idx, f in enumerate(fase):
        tv = temp[idx]; phv=ph[idx]; humv=hum[idx]
        if f == "Termofilica":
            base = 0.8 * (1 - abs(tv-60)/40) + 0.1*(1 - abs(phv-8)/3) + 0.1*(1 - abs(humv-45)/50)
        elif f == "Inicial":
            base = 0.7 * (1 - abs(tv-30)/40) + 0.2*(1 - abs(phv-7.5)/3)
        else:  # Maturacao
            base = 0.75*(1 - abs(tv-35)/40) + 0.15*(1 - abs(phv-6.8)/3)
        base = np.clip(base + np.random.normal(0, 0.05), 0, 1)
        score.append(base)
    score = np.array(score)

    df = pd.DataFrame({
        "Temp": temp,
        "pH": ph,
        "Umidade": hum,
        "O2": o2,
        "Tempo": tempo,
        "Fase": fase,
        "Coerencia": score
    })
    return df

df = simulate_ml3_data(6000)

# ---------------------------
# 3) Pré-processamento
# ---------------------------
feature_cols = ["Temp","pH","Umidade","O2","Tempo"]
X = df[feature_cols].values
le_fase = LabelEncoder()
y_fase = le_fase.fit_transform(df["Fase"].values)  # 0..2
y_fase_onehot = tf.keras.utils.to_categorical(y_fase, num_classes=n_classes)
y_coerencia = df["Coerencia"].values.reshape(-1,1)  # 0..1

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# split
X_train, X_test, yf_train, yf_test, yc_train, yc_test = train_test_split(
    X_scaled, y_fase_onehot, y_coerencia, test_size=0.2, random_state=RND
)

# ---------------------------
# 4) Modelo: duas saídas
# ---------------------------
inp = Input(shape=(X_train.shape[1],), name="entrada_ml3")
x = Dense(64, activation="relu")(inp)
x = BatchNormalization()(x)
x = Dropout(0.2)(x)
x = Dense(32, activation="relu")(x)
x = Dropout(0.15)(x)

out_phase = Dense(n_classes, activation="softmax", name="saida_fase")(x)
out_coh   = Dense(1, activation="sigmoid", name="saida_coerencia")(x)

model = Model(inputs=inp, outputs=[out_phase, out_coh])
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    loss={"saida_fase": "categorical_crossentropy", "saida_coerencia": "mse"},
    loss_weights={"saida_fase": 1.0, "saida_coerencia": 0.5},
    metrics={"saida_fase": ["accuracy"], "saida_coerencia": ["mae"]}
)
model.summary()

# ---------------------------
# 5) Treino
# ---------------------------
es = EarlyStopping(monitor="val_loss", patience=12, restore_best_weights=True, verbose=1)
history = model.fit(
    X_train, {"saida_fase": yf_train, "saida_coerencia": yc_train},
    validation_split=0.15,
    epochs=200,
    batch_size=64,
    callbacks=[es],
    verbose=2
)

# ---------------------------
# 6) Avaliação
# ---------------------------
eval_res = model.evaluate(X_test, {"saida_fase": yf_test, "saida_coerencia": yc_test}, verbose=0)
print("\nAvaliação ML-3 (loss, fase_loss, coerencia_loss, fase_acc, coerencia_mae):")
print(eval_res)

# Relatório de classificação (fase)
y_phase_pred_prob, y_coh_pred = model.predict(X_test)
y_phase_pred = np.argmax(y_phase_pred_prob, axis=1)
y_phase_true = np.argmax(yf_test, axis=1)
print("\nRelatório de Fase:")
print(classification_report(y_phase_true, y_phase_pred, target_names=le_fase.classes_))
print("Matriz de Confusão:\n", confusion_matrix(y_phase_true, y_phase_pred))

# ROC-like check para coerência (usando AUC com verdadeiros contínuos)
try:
    roc = roc_auc_score(yc_test, y_coh_pred)
    print(f"\nAUC (coerência vs pred): {roc:.4f}")
except Exception:
    pass

# ---------------------------
# 7) Salvar artefatos
# ---------------------------
model.save(os.path.join(MODEL_DIR, "ml3_context_filter.h5"))
joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler_ml3.pkl"))
joblib.dump(le_fase, os.path.join(MODEL_DIR, "label_encoder_fase.pkl"))
print(f"\nArtefatos salvos em {MODEL_DIR}")

# ---------------------------
# 8) Função de integração (ML-1 + ML-3)
# ---------------------------
def ajustar_confianca_ml1(ml1_output, ml3_phase_prob, ml3_coh_score,
                           fase_names=fase_labels,
                           pesos={"coerencia":0.6, "ml1":0.4}):
    """
    Ajusta a confiança nas detecções do ML-1 com base no contexto do ML-3.
    - ml1_output: dict com {'gas': nome, 'confianca': 0..1, 'tipo': opcional}
      ou lista de detecções [ {'gas':..., 'confianca':...}, ... ]
    - ml3_phase_prob: probabilidade predita por ML-3 para cada fase (array len=3)
    - ml3_coh_score: coerencia 0..1 (float)
    Retorna lista com detecções ajustadas e uma flag 'suspeito' quando baixa coerência.
    Regra simples:
      confiança_ajustada = ml1_confianca * (  w1 * coh + w2 * prob_fase_esperada )
    Aqui tomamos prob_fase_esperada = max prob das fases relevantes para o gás (heurística).
    """
    # heurística: mapa de gases esperados por fase (exemplo)
    gas_phase_map = {
        "Ammonia": ["Inicial","Maturacao"],
        "H2S": ["Inicial","Termofilica"],
        "Metano": ["Termofilica","Inicial"],
        "Formaldeido": ["Maturacao"],
        "Etanol": ["Inicial","Termofilica"]
    }
    # normalize
    ml3_coh = float(np.clip(ml3_coh_score, 0, 1))
    phase_probs = np.array(ml3_phase_prob).flatten()
    phase_idx_best = int(np.argmax(phase_probs))
    phase_best_name = fase_names[phase_idx_best]
    phase_prob_best = float(phase_probs[phase_idx_best])

    results = []
    detections = ml1_output if isinstance(ml1_output, list) else [ml1_output]
    for det in detections:
        gas = det.get("gas", "unknown")
        conf = float(det.get("confianca", det.get("confidence", 0.5)))
        expected_phases = gas_phase_map.get(gas, fase_names)  # se desconhecido, assume qualquer fase
        # probabilidade de fase esperada = soma das probs das fases onde gas é esperado
        prob_expected = 0.0
        for i,fn in enumerate(fase_names):
            if fn in expected_phases:
                prob_expected += float(phase_probs[i])
        # combine
        new_conf = conf * ( pesos["coerencia"] * ml3_coh + pesos["ml1"] * prob_expected )
        new_conf = float(np.clip(new_conf, 0, 1))
        suspeito = new_conf < 0.35  # threshold arbitrário
        results.append({
            "gas": gas,
            "conf_original": conf,
            "conf_ajustada": new_conf,
            "fase_predita": phase_best_name,
            "fase_prob": phase_prob_best,
            "coerencia_ml3": ml3_coh,
            "suspeito": suspeito
        })
    return results

# ---------------------------
# 9) Exemplo de uso integrado
# ---------------------------
# Carrega modelos/salvados (exemplo)
scaler_loaded = joblib.load(os.path.join(MODEL_DIR, "scaler_ml3.pkl"))
model_loaded = tf.keras.models.load_model(os.path.join(MODEL_DIR, "ml3_context_filter.h5"))
le_loaded = joblib.load(os.path.join(MODEL_DIR, "label_encoder_fase.pkl"))

# Simula uma amostra real (inputs)
amostra = {
    "Temp": 62.0,  # quente -> termofílica
    "pH": 8.0,
    "Umidade": 42.0,
    "O2": 12.0,
    "Tempo": 18.0
}
vec = np.array([amostra[c] for c in feature_cols]).reshape(1,-1)
vec_scaled = scaler_loaded.transform(vec)
phase_prob, coh_score = model_loaded.predict(vec_scaled)
print("\nExemplo integração - ML3:")
print("phase_prob:", phase_prob, "coherence:", coh_score)

# Exemplo ML-1 output (detectou Ammonia com confiança 0.8)
ml1_example = {"gas":"Ammonia","confianca":0.8}

aj = ajustar_confianca_ml1(ml1_example, phase_prob, float(coh_score))
print("\nAjuste de confiança ML-1 com ML-3:")
print(aj)
