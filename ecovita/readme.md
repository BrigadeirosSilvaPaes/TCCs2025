📂 Código-Fonte Completo do Projeto EcoVita

Este repositório contém todo o conjunto de códigos desenvolvidos para o projeto EcoVita, abrangendo desde a etapa de coleta de dados via IoT até os modelos de aprendizado de máquina responsáveis pela análise preditiva e pela interpretação dos Compostos Orgânicos Voláteis (COVs).

A estrutura inclui:

1. Módulos de Machine Learning (ML-1, ML-2 e ML-3)

Conjunto de scripts implementados em Python, utilizando bibliotecas como TensorFlow, NumPy e pandas.
Cada módulo possui uma função distinta dentro do sistema:

ML-1 – Pré-processamento e modelagem básica dos dados ambientais.

ML-2 – Modelo preditivo aplicado ao comportamento dos COVs.

ML-3 – Algoritmo do “Nariz Eletrônico”, responsável pela classificação dos padrões de gases emitidos durante o processo de compostagem.

2. Código da Plataforma IoT

Inclui os algoritmos de aquisição, transmissão e tratamento inicial dos dados coletados pelos sensores conectados ao Arduino Mega e ao módulo ESP32.
Abrange:

Leitura de temperatura, umidade, pH e umidade do solo

Conversão e filtragem dos dados

Envio para o servidor via protocolo HTTP

Controle local básico do sistema embarcado

3. Interface Web (Web Painel)

Código completo do painel de monitoramento, incluindo:

Visualização gráfica das variáveis ambientais

Histórico das leituras

Indicadores de desempenho

Integração com o backend da aplicação

Desenvolvido para garantir navegação fluida e acompanhamento em tempo real do sistema EcoVita.

4. Código do Arduino Mega

Aqui estão incluídos todos os scripts utilizados no microcontrolador principal, como:

Configuração dos sensores

Cálculos das médias móveis

Comunicação serial com o ESP32

Rotinas de exibição no display LCD

Loops de manutenção e calibração

📌 Observação

No TCC impresso, foram incluídos apenas os trechos principais do código, utilizados para explicação no dia da apresentação, conforme orientação.
Neste repositório, encontra-se 100% do código utilizado no desenvolvimento do sistema.
