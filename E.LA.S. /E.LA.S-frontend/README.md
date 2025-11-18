📌 Visão Geral

Este diretório contém o frontend do aplicativo E.L.A.S., desenvolvido em React Native, com foco em experiência segura, intuitiva e responsiva para mulheres em situação de vulnerabilidade.
O app permite cadastro, autenticação, visualização de telas principais e, principalmente, o envio automático da localização via SMS em situações de emergência.

🧩 Estrutura do Código

Os principais módulos incluem:

1. Telas (Screens)

Home – Acesso inicial com opções de Login e Cadastro.

Cadastro – Coleta de nome, telefone, CPF e Medida Protetiva.

Login – Autenticação da usuária.

Dashboard – Menu principal após login, com o botão “Ajuda”.

SOS – Tela crítica responsável por acionar a função de envio de SMS + localização.

2. Componentes

Botões estilizados

Campos de formulário

Header e Footer

Modais de alerta

3. Serviços

serviço de localização (GPS)

envio de SMS

requisições para o backend

4. Lógica Principal

Captura de coordenadas em tempo real

Envio automático para autoridades

Validação dos dados de cadastro

Persistência de sessão

🛠️ Tecnologias e Dependências Principais

React Native 0.xx

Expo ou CLI (dependendo do projeto)

react-navigation

expo-location

expo-sms ou react-native-sms

Axios

📦 Como Rodar
npm install
npm start

📘 Observação

Somente os trechos essenciais aparecem no TCC.
Aqui no repositório está 100% do código completo do aplicativo.
