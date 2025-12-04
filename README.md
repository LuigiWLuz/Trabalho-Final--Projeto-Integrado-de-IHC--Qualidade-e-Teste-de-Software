# 🎸 Metal Tickets 

Este é o repositório do sistema de venda de ingressos "Metal Tickets".

O projeto é construído em **React**, **Vite** e **Tailwind CSS**.

### 1. Visão Geral e Recursos Principais

* **Tecnologias:** React (v19), Vite, Tailwind CSS + Daisy UI, React Router DOM.
* **Acessibilidade:** Implementação do **Modo de Alto Contraste**.
* **Testes:** Cobertura do fluxo de compra End-to-End usando **Vitest** e **React Testing Library**.

---

### 2. Configuração e Execução Local ⚙️

Para o funcionamento completo, é necessário configurar o Banco de Dados e o Servidor Frontend.

#### Passo 1: Configuração do Banco de Dados e Backend

1.  **Instalação de Servidor:** Instale o **XAMPP** (ou software similar que inclua **MySQL**) para gerenciar o BDD localmente.
2.  **Iniciar BDD:** Inicie o serviço MySQL (via XAMPP Control Panel).
3.  **Executar Script SQL:** Navegue até a pasta do seu projeto **Backend**, localize o arquivo `metal_tickets_db.sql`. Copie o script e **execute-o** no seu banco de dados MySQL para criar a estrutura e os dados iniciais.

#### Passo 2: Configuração e Instalação do Frontend

1.  Navegue até o diretório `Frontend/`.
2.  Instale todas as dependências do projeto:
   
    ```bash
    npm install
    ```

#### Passo 3: Execução do BackEnd

1.  Abra um **novo terminal**, navegue até a pasta `Backend/`.
Inicie o servidor de desenvolvimento do Vite:

```bash
npm run start
```
O servidor Backend deve estar ativo na porta esperada (Ex: `http://localhost:3001`).

#### Passo 4: Execução do Frontend

2.  Abra um **novo terminal**, navegue até a pasta `FrontEnd/`.
Inicie o servidor de desenvolvimento do Vite:

```bash
npm run dev
```


