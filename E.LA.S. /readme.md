📂 Código-Fonte Completo do Projeto E.L.A.S.

Este repositório reúne todo o conjunto de códigos desenvolvidos para o aplicativo E.L.A.S. — Esclarecer, Lutar, Apoiar, Salvar, incluindo frontend, backend, lógica de segurança e integração com serviços nativos do dispositivo.

📱 Aplicativo Mobile (React Native)

Todos os arquivos referentes à interface e fluxo do usuário estão aqui, incluindo:

Tela Inicial (Home): acesso ao login e cadastro.

Tela de Cadastro: coleta de nome completo, telefone, CPF e nº da Medida Protetiva.

Tela de Login: autenticação e validação da usuária.

Dashboard: painel com acesso rápido ao botão “Ajuda”.

Tela SOS: lógica completa para envio automático da localização.

Inclui hooks, componentes, navegação, validações e serviços internos do app.

📡 Módulo de Geolocalização

Implementação da coleta e envio da localização real-time:

Uso de GPS + Wi-Fi + torres de celular.

Extração de coordenadas exatas do dispositivo.

Rotina de atualização periódica conforme boas práticas.

✉️ Envio Automático de SMS

Scripts responsáveis pela função principal do aplicativo:

Integração com APIs nativas de envio de SMS.

Disparo automático da mensagem de emergência.

Inclusão dinâmica da localização + dados da usuária.

🔐 Validação e Atualização de Dados

Códigos que garantem segurança e consistência:

Validação dos dados no cadastro e login.

Rotina de atualização obrigatória a cada 15 dias.

Tratamento de inconsistências e dados incompletos.

📌 Observação

No TCC impresso foram incluídos apenas trechos essenciais dos códigos para apresentação.
Neste repositório está disponível 100% do material utilizado no desenvolvimento do E.L.A.S.
