# Caixinha do bem

Projeto desenvolvido para a Universidade de Marília (UNIMAR) no âmbito do Projeto Integrador Extensionista II (PIE II), consistindo em um sistema web para registro e consulta de doações solidárias.

## Tecnologias e Requisitos
- **Stack:** HTML5, CSS3, JavaScript (Vanilla), Vite, Node.js, Express e MySQL.
- **Pré-requisitos:** Node.js, npm e MySQL em execução (XAMPP, Workbench ou terminal).

## Configuração e Instalação

1. **Dependências:** Execute "npm install" na raiz do projeto.
2. **Variáveis de Ambiente:** Configure o arquivo ".env" com base no ".env.example":

   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=sua_senha_aqui
   DB_NAME=caixinha_do_bem
   PORT=3000

   *(Nota: No XAMPP padrão, deixe "DB_PASSWORD=" em branco).*

3. **Banco de Dados:** Importe os arquivos da pasta "database/" ("schema.sql" seguido de "seed.sql") via terminal, MySQL Workbench ou phpMyAdmin (XAMPP).

## Execução

Em terminais separados na pasta do projeto:
* **Back-end:** "npm run api"
* **Front-end:** "npm run dev"

Acesse "http://localhost:5173" no navegador. As principais rotas da API abrangem "/api/health", "/api/doadores", "/api/itens" e "/api/doacoes".

*Segurança: Mantenha as credenciais apenas no arquivo ".env" (protegido pelo ".gitignore").*
