# 📔 Agenda Digital

## 📋 Descrição
A Agenda Digital é uma solução completa para o gerenciamento de clientes e seus contatos, desenvolvida utilizando **Java/Spring Boot** no backend e **React com Vite** no frontend. O projeto atende aos requisitos do desafio de estágio da Comércio S.A., proporcionando uma interface intuitiva e responsiva para operações CRUD.

---

## 🛠️ Tecnologias Utilizadas
### **Backend:**
- ![Java](https://img.shields.io/badge/Java-17-red?logo=openjdk)
- ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.1.5-green?logo=spring)
- ![Hibernate](https://img.shields.io/badge/Hibernate-6.2-blue?logo=hibernate)
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-purple?logo=postgresql)
- ![Lombok](https://img.shields.io/badge/Lombok-1.18.26-pink?logo=lombok)
- ![Maven](https://img.shields.io/badge/Maven-3.9.3-orange?logo=apache-maven)

### **Frontend:**
- ![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)
- ![Vite](https://img.shields.io/badge/Vite-6.2.0-purple?logo=vite)
- ![React Router](https://img.shields.io/badge/React_Router-7.4.1-red?logo=react-router)
- ![Axios](https://img.shields.io/badge/Axios-1.8.4-green?logo=axios)
- ![Date-fns](https://img.shields.io/badge/Date--fns-4.1.0-orange?logo=date-fns)
- ![ESLint](https://img.shields.io/badge/ESLint-Standard-blue?logo=eslint)

---

## ✅ Requisitos Atendidos
### **Requisitos Funcionais (RF)**
| ID  | Descrição | Endpoint | Status |
|-----|-----------|----------|--------|
| RF01 | Cadastro de clientes | `POST /clientes` | ✔️ |
| RF02 | Edição de clientes | `PUT /clientes/{id}` | ✔️ |
| RF03 | Exclusão de clientes | `DELETE /clientes/{id}` | ✔️ |
| RF04 | Listagem de clientes | `GET /clientes` | ✔️ |
| RF05 | Busca por Nome/CPF | `GET /clientes?search=` | ✔️ |
| RF06 | Cadastro de contatos | `POST /contatos` | ✔️ |
| RF07 | Edição de contatos | `PUT /contatos/{id}` | ✔️ |
| RF08 | Exclusão de contatos | `DELETE /contatos/{id}` | ✔️ |
| RF09 | Listagem de contatos por cliente | `GET /clientes/{id}/contatos` | ✔️ |

### **Regras de Negócio (RN)**
| ID  | Descrição | Implementação             |
|-----|-----------|---------------------------|
| RN01 | Campos obrigatórios (Nome, CPF) | Validação na entidade     |
| RN02 | Campos obrigatórios (Tipo, Valor) | Validação no entidade     |
| RN03 | CPF único | `@UniqueConstraint` no BD |
| RN04 | Nome não vazio | `@NotBlank`               |
| RN05 | Data de nascimento válida | `@Past`                   |
| RN06 | Múltiplos contatos por cliente | Relação `OneToMany`       |
| RN07 | Exclusão em cascata | `CascadeType.ALL`         |
| RN08 | Validação pré-persistência | `@Valid` + Handler        |

---

## 🗃️ Modelo de Dados
```sql
-- Tabela Cliente
CREATE TABLE IF NOT EXISTS cliente (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    endereco VARCHAR(255)
);

-- Tabela Contato
CREATE TABLE IF NOT EXISTS contato (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    valor VARCHAR(100) NOT NULL,
    observacao VARCHAR(255),
    FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
);
```

---

## 📂 Estrutura de Diretórios
### **Frontend**
```
src/
├── assets/          # Imagens e ícones
├── components/      # Componentes reutilizáveis
├── hooks/           # Hooks personalizados
├── pages/           # Páginas principais da aplicação
├── services/        # Integração com a API (Axios)
├── styles/          # Arquivos CSS
└── main.jsx         # Ponto de entrada da aplicação
```

---

## 🚀 Instalação e Execução
### **Backend**
#### **Pré-requisitos**
- Java 17
- Maven
- PostgreSQL

#### **Passos**
1. Clone o repositório:
   ```sh
   git clone <url-do-repositorio>
   ```
2. Acesse a pasta do backend:
   ```sh
   cd agenda-digital-api
   ```
3. Configure o banco de dados:
   ```sql
   CREATE DATABASE agenda_digital;
   ```
4. Atualize as credenciais no arquivo `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/agenda_digital
   spring.datasource.username=seu_usuario
   spring.datasource.password=sua_senha
   ```
5. Compile e execute a API:
   ```sh
   mvn spring-boot:run
   ```
A API estará rodando em `http://localhost:8080`.

---

### **Frontend**
#### **Pré-requisitos**
- Node.js
- NPM ou Yarn

#### **Passos**
1. Clone o repositório:
   ```sh
   git clone <url-do-repositorio>
   ```
2. Acesse a pasta do frontend:
   ```sh
   cd agendadigital
   ```
3. Instale as dependências:
   ```sh
   npm install
   ```
4. Execute a aplicação:
   ```sh
   npm run dev
   ```
Acesse `http://localhost:5173` no navegador.

---

## 🔗 Rotas
### **Backend**
#### Cliente
- `GET /clientes` - Lista todos os clientes
- `POST /clientes` - Adiciona um novo cliente
- `GET /clientes/{id}` - Obtém detalhes de um cliente
- `PUT /clientes/{id}` - Atualiza um cliente existente
- `DELETE /clientes/{id}` - Remove um cliente

#### Contato
- `GET /contatos` - Lista todos os contatos
- `POST /contatos` - Adiciona um novo contato
- `GET /contatos/{id}` - Obtém detalhes de um contato
- `PUT /contatos/{id}` - Atualiza um contato existente
- `DELETE /contatos/{id}` - Remove um contato

### **Frontend**
- `/` - Página Inicial
- `/adicionar` - Cadastro de Cliente
- `/clientes` - Listagem de Clientes
- `/editar/:id` - Edição de Cliente
- `/clientes/:clienteId/contatos/adicionar` - Adição de Contato
- `/clientes/:clienteId/contatos/editar/:contatoId` - Edição de Contato

---

## ✨ Autor
Desenvolvido por **Vinícius**.

