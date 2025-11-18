📁 README – BACKEND (API / Server)
📌 Visão Geral

Este diretório contém o backend do aplicativo E.L.A.S., responsável por gerenciar dados das usuárias, autenticação, armazenamento das informações e integração com o sistema de alerta.

A API oferece suporte à comunicação segura entre o app e o banco de dados.

🧩 Estrutura do Código
1. Rotas

/register – Cadastro da usuária

/login – Autenticação

/update – Atualização dos dados a cada 15 dias

/alert – Endpoint chamado quando a usuária envia SOS

2. Controladores

Validação e tratamento dos dados

Comunicação com o banco

Persistência segura das informações

3. Modelos

Usuária

nome

telefone

CPF

número da medida protetiva

data da última atualização

4. Middleware

Autenticação

Sanitização dos dados

Verificação de integridade da requisição

🛠️ Tecnologias Usadas

Node.js

Express.js

MongoDB

JWT

Bcrypt

Axios para comunicação

🚀 Como Rodar
npm install
npm run dev

📘 Observação

O TCC contém apenas os trechos maiores e mais explicativos.
No repositório está o código completo, organizado em pastas.
npm install
npm run dev
