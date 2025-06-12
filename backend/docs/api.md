# Documentação da API - Controle de Despensa

## Visão Geral

Esta API fornece endpoints para gerenciar o controle de despensa, permitindo o cadastro de produtos, usuários e outras funcionalidades relacionadas.

## Base URL

```
http://localhost:3000/api
```

## Autenticação

A API utiliza autenticação JWT (JSON Web Token). Para acessar endpoints protegidos, é necessário incluir o token no cabeçalho da requisição:

```
Authorization: Bearer <token>
```

## Endpoints

### Usuários

#### Cadastro de Usuário

```
POST /users
```

**Corpo da Requisição:**

```json
{
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta de Sucesso:**

```json
{
  "id": "60d21b4667d0d8992e610c85",
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "createdAt": "2023-04-25T14:30:00.000Z"
}
```

#### Login

```
POST /auth/login
```

**Corpo da Requisição:**

```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta de Sucesso:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com"
  }
}
```

### Produtos

#### Listar Produtos

```
GET /products
```

**Resposta de Sucesso:**

```json
[
  {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Arroz",
    "quantity": 5,
    "unit": "kg",
    "expirationDate": "2023-12-31T00:00:00.000Z",
    "createdAt": "2023-04-25T14:30:00.000Z"
  }
]
```

#### Cadastrar Produto

```
POST /products
```

**Corpo da Requisição:**

```json
{
  "name": "Arroz",
  "quantity": 5,
  "unit": "kg",
  "expirationDate": "2023-12-31"
}
```

**Resposta de Sucesso:**

```json
{
  "id": "60d21b4667d0d8992e610c85",
  "name": "Arroz",
  "quantity": 5,
  "unit": "kg",
  "expirationDate": "2023-12-31T00:00:00.000Z",
  "createdAt": "2023-04-25T14:30:00.000Z"
}
```

#### Atualizar Produto

```
PUT /products/:id
```

**Corpo da Requisição:**

```json
{
  "quantity": 3
}
```

**Resposta de Sucesso:**

```json
{
  "id": "60d21b4667d0d8992e610c85",
  "name": "Arroz",
  "quantity": 3,
  "unit": "kg",
  "expirationDate": "2023-12-31T00:00:00.000Z",
  "updatedAt": "2023-04-25T14:35:00.000Z"
}
```

#### Excluir Produto

```
DELETE /products/:id
```

**Resposta de Sucesso:**

```json
{
  "message": "Produto excluído com sucesso"
}
```

## Códigos de Status

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Requisição inválida
- `401 Unauthorized`: Não autorizado
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro interno do servidor

## Tratamento de Erros

Em caso de erro, a API retornará um objeto JSON com a seguinte estrutura:

```json
{
  "message": "Mensagem de erro",
  "errors": [
    {
      "field": "campo com erro",
      "message": "Descrição do erro"
    }
  ]
}
``` 