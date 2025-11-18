import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, f1_score
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping
import joblib

# ==================================================
# 1. Base inicial de compostos químicos
# ==================================================
# Criamos um DataFrame com:
# - Nome do composto
# - Família química
# - Valor médio de toxicidade (PEL_IDHL) em ppb
dados = pd.DataFrame({
    'Nome Comum': [
        'Acetaldeído', 'Acetona', 'Acroleína', 'Ácido acético', 'Ácido butírico',
        'Ácido caproico', 'Ácido fórmico', 'Ácido isovalérico', 'Ácido lático', 'Ácido propiônico',
        'Amônia', 'Cadaverina', 'Dimetil sulfeto', 'Escatol', 'Fenol'
    ],
    'Família Química': [
        'Aldeído', 'Cetona', 'Aldeído insaturado', 'Ácido carboxílico', 'Ácido carboxílico',
        'Ácido carboxílico', 'Ácido carboxílico', 'Ácido carboxílico ramificado', 'Ácido hidroxi-carboxílico', 'Ácido carboxílico',
        'Amina inorgânica', 'Amina alifática', 'Sulfeto orgânico', 'Amina heterocíclica', 'Fenol'
    ],
    'PEL_IDHL_media': [
        200, 1000, 0.1, 10, 10,
        10, 50, 10, 10, 10,
        50, 50, 10, 10, 5
    ]
})

# ==================================================
# 2. Funções Auxiliares
# ==================================================

# Classificação simplificada do tipo de COV (Composto Orgânico Volátil)
def classificar_tipo_cov(familia):
    familia = familia.lower()
    if 'ácido' in familia:
        return 'ácido'
    elif 'álcool' in familia:
        return 'álcool'
    elif 'aldeído' in familia:
        return 'aldeído'
    elif 'cetona' in familia:
        return 'cetona'
    elif 'sulfeto' in familia:
        return 'sulfurado'
    elif 'amina' in familia:
        return 'amina'
    elif 'hidrocarboneto' in familia:
        return 'hidrocarboneto'
    else:
        return 'outro'

# Regras heurísticas para toxicidade
def classificar_toxicidade_refinada(ppb, tipo_cov, tempo_exp=8):
    # Se não existe valor ou é zero → classe desconhecida
    if pd.isna(ppb) or ppb == 0:
        return 'desconhecido'
    # Amina abaixo de 50 ppb (com longa exposição) é altamente tóxica
    if tipo_cov == 'amina' and ppb < 50 and tempo_exp >= 8:
        return 'alta'
    # Regras gerais de toxicidade
    elif ppb < 10:
        return 'alta'
    elif ppb < 100:
        return 'média'
    else:
        return 'baixa'

# Identificação da fase da compostagem associada ao composto
def classificar_fase(composto, familia):
    comp = composto.lower()
    fam = familia.lower()
    if 'amina' in fam or comp in ['amônia', 'cadaverina', 'putrescina', 'trimetilamina']:
        return 'inicial'
    elif 'ácido' in fam or comp in ['ácido acético', 'ácido butírico']:
        return 'intermediária'
    elif comp in ['indol', 'escatol', 'fenol', 'benzeno']:
        return 'final'
    else:
        return 'geral'

# Geração de combinações simuladas de compostos
# → aumenta o dataset com pares de compostos e adiciona ruído (variabilidade realista)
def gerar_combinacoes_simuladas(dados, n_simulacoes=10, ruido_ppb=0.05):
    combinacoes = []
    for i in range(len(dados)):
        for j in range(i+1, len(dados)):
            base1 = dados.iloc[i]
            base2 = dados.iloc[j]
            for _ in range(n_simulacoes):
                ppb_1 = base1['PEL_IDHL_media'] * (1 + np.random.uniform(-ruido_ppb, ruido_ppb))
                ppb_2 = base2['PEL_IDHL_media'] * (1 + np.random.uniform(-ruido_ppb, ruido_ppb))
                combinacoes.append({
                    'composto_verde': base1['Nome Comum'],
                    'composto_marrom': base2['Nome Comum'],
                    'tipo_verde': base1['Família Química'],
                    'tipo_marrom': base2['Família Química'],
                    'ppb_verde': ppb_1,
                    'ppb_marrom': ppb_2,
                    'ppb_media': (ppb_1 + ppb_2)/2
                })
    return pd.DataFrame(combinacoes)

# ==================================================
# 3. Expansão da Base de Dados
# ==================================================
df_simulado = gerar_combinacoes_simuladas(dados, n_simulacoes=10)

# Classificação de tipos químicos
df_simulado['tipo_verde_cod'] = df_simulado['tipo_verde'].apply(classificar_tipo_cov)
df_simulado['tipo_marrom_cod'] = df_simulado['tipo_marrom'].apply(classificar_tipo_cov)

# Definição se o composto é rico em Carbono (C) ou Nitrogênio (N)
compostos_nitrogenados = ['Amônia', 'Cadaverina', 'Putrescina', 'Trimetilamina']
df_simulado['CN_verde'] = df_simulado['composto_verde'].apply(lambda x: 'N' if x in compostos_nitrogenados else 'C')
df_simulado['CN_marrom'] = df_simulado['composto_marrom'].apply(lambda x: 'N' if x in compostos_nitrogenados else 'C')

# Definição de toxicidade refinada
df_simulado['toxicidade'] = df_simulado.apply(lambda row: classificar_toxicidade_refinada(
    row['ppb_media'], row['tipo_verde_cod']), axis=1)

# Definição da fase da compostagem
df_simulado['fase_compostagem'] = df_simulado.apply(lambda row: classificar_fase(
    row['composto_verde'], row['tipo_verde']), axis=1)

# ==================================================
# 4. Codificação de variáveis categóricas
# ==================================================
# Usamos LabelEncoder para transformar strings em números
encoders = {
    "verde": LabelEncoder(),
    "marrom": LabelEncoder(),
    "tipo_verde": LabelEncoder(),
    "tipo_marrom": LabelEncoder(),
    "CN_verde": LabelEncoder(),
    "CN_marrom": LabelEncoder(),
    "toxicidade": LabelEncoder(),
    "fase": LabelEncoder()
}

for col in ['composto_verde','composto_marrom','tipo_verde_cod','tipo_marrom_cod','CN_verde','CN_marrom','toxicidade','fase_compostagem']:
    df_simulado[col+'_enc'] = encoders[col.split('_')[0]].fit_transform(df_simulado[col])

# ==================================================
# 5. Preparação de Features e Targets
# ==================================================
# Features de entrada (X)
X = df_simulado[[
    "composto_verde_enc","composto_marrom_enc","tipo_verde_cod_enc","tipo_marrom_cod_enc",
    "CN_verde_enc","CN_marrom_enc","ppb_verde","ppb_marrom"
]].values

# Targets (saídas do modelo)
y_tox = tf.keras.utils.to_categorical(df_simulado["toxicidade_enc"])       # Toxicidade
y_fase = tf.keras.utils.to_categorical(df_simulado["fase_compostagem_enc"]) # Fase compostagem

# Normalização das features
scaler = StandardScaler()
X = scaler.fit_transform(X)

# Divisão em treino e teste
X_train, X_test, y_tox_train, y_tox_test, y_fase_train, y_fase_test = train_test_split(
    X, y_tox, y_fase, test_size=0.2, random_state=42
)

# ==================================================
# 6. Modelo Multi-Output (duas saídas)
# ==================================================
entrada = Input(shape=(X.shape[1],))

# Camadas ocultas
x = Dense(128, activation='relu')(entrada)
x = BatchNormalization()(x)
x = Dropout(0.3)(x)
x = Dense(64, activation='relu')(x)
x = BatchNormalization()(x)
x = Dropout(0.2)(x)

# Saídas
saida_toxicidade = Dense(y_tox.shape[1], activation='softmax', name="saida_toxicidade")(x)
saida_fase = Dense(y_fase.shape[1], activation='softmax', name="saida_fase")(x)

# Construção e compilação do modelo
modelo = Model(inputs=entrada, outputs=[saida_toxicidade, saida_fase])
modelo.compile(
    optimizer='adam',
    loss={'saida_toxicidade': 'categorical_crossentropy','saida_fase': 'categorical_crossentropy'},
    metrics=['accuracy']
)

# Early stopping → interrompe o treino quando não há melhora
early_stop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)

# Treinamento
modelo.fit(
    X_train,
    {"saida_toxicidade": y_tox_train, "saida_fase": y_fase_train},
    validation_split=0.2,
    epochs=200,
    batch_size=8,
    verbose=1,
    callbacks=[early_stop]
)

# ==================================================
# 7. Avaliação do Modelo
# ==================================================
resultados = modelo.evaluate(X_test, [y_tox_test, y_fase_test], verbose=0)
print("\n--- Avaliação ---")
print(f"Toxicidade - Loss: {resultados[1]:.4f}, Acc: {resultados[3]:.4f}")
print(f"Fase       - Loss: {resultados[2]:.4f}, Acc: {resultados[4]:.4f}")

# Predições
y_pred_tox, y_pred_fase = modelo.predict(X_test)

# Conversão para classes
y_pred_tox_classes = np.argmax(y_pred_tox, axis=1)
y_pred_fase_classes = np.argmax(y_pred_fase, axis=1)
y_test_tox_classes = np.argmax(y_tox_test, axis=1)
y_test_fase_classes = np.argmax(y_fase_test, axis=1)

# Relatórios detalhados
print("\n--- Relatório de Toxicidade ---")
print(classification_report(y_test_tox_classes, y_pred_tox_classes, target_names=encoders["toxicidade"].classes_))

print("\n--- Relatório de Fase da Compostagem ---")
print(classification_report(y_test_fase_classes, y_pred_fase_classes, target_names=encoders["fase"].classes_))

# Matrizes de confusão + F1-score
print("\nMatriz Confusão - Toxicidade:\n", confusion_matrix(y_test_tox_classes, y_pred_tox_classes))
print("F1-score Toxicidade:", f1_score(y_test_tox_classes, y_pred_tox_classes, average='macro'))

print("\nMatriz Confusão - Fase:\n", confusion_matrix(y_test_fase_classes, y_pred_fase_classes))
print("F1-score Fase:", f1_score(y_test_fase_classes, y_pred_fase_classes, average='macro'))

# ==================================================
# 8. Salvando modelo e pré-processadores
# ==================================================
modelo.save("modelo_toxicidade_fase.h5")                        # Rede neural
joblib.dump(encoders, "encoders_toxicidade_fase.pkl")           # Encoders de categorias
joblib.dump(scaler, "scaler_toxicidade_fase.pkl")               # Normalizador
