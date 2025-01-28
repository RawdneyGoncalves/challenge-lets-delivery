# Customer Management API

Este projeto é uma API serverless para gerenciamento de clientes, implementada usando AWS Lambda, API Gateway e DynamoDB. A aplicação fornece operações CRUD completas para gerenciar informações de clientes.

## Padrões Arquiteturais e de Design

### Padrões Principais

1. **Repository Pattern**
   - Implementado através da classe `CustomerRepository`
   - Abstrai a camada de persistência de dados
   - Permite trocar facilmente a implementação do banco de dados
   - Interface `ICustomerRepository` define o contrato

2. **Factory Pattern**
   - `CustomerFactory` encapsula a criação de objetos Customer
   - Gera IDs únicos e valida os dados na criação
   - Facilita a criação de objetos complexos

3. **Service Layer Pattern**
   - `CustomerService` implementa a lógica de negócios
   - Atua como intermediário entre os handlers e o repository
   - Encapsula regras de negócio e validações

4. **Domain Model Pattern**
   - Classe `Customer` como entidade rica com comportamentos
   - Validações internas e regras de negócio encapsuladas
   - Método `toggleActiveStatus()` como exemplo de comportamento

5. **Error Handler Pattern**
   - Classes customizadas de erro: `ValidationError`, `NotFoundError`, `ApplicationError`
   - Tratamento centralizado de erros nos handlers
   - Mapeamento de erros para status HTTP apropriados

6. **Dependency Injection**
   - Injeção do repository no service
   - Facilita testes e manutenção
   - Reduz acoplamento entre componentes

##  Tecnologias

- Node.js (v22)
- TypeScript
- AWS Lambda
- Amazon DynamoDB
- AWS API Gateway
- Jest para testes

##  Requisitos

- Node.js v22.x
- AWS CLI configurado
- DynamoDB Local (para desenvolvimento)
- TypeScript

##  Estrutura do Projeto

```
project/
├── src/
│   ├── handlers/
│   │   ├── createCustomer.ts
│   │   ├── getCustomer.ts
│   │   ├── updateCustomer.ts
│   │   └── deleteCustomer.ts
│   ├── models/
│   │   └── Customer.ts
│   ├── repositories/
│   │   └── CustomerRepository.ts
│   ├── services/
│   │   └── CustomerService.ts
│   ├── utils/
│   │   ├── validator.ts
│   │   └── errors.ts
│   ├── tests/
│   └── index.ts
└── package.json
```

##  Instalação


2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Configure o DynamoDB Local:
```bash
docker run -p 8000:8000 amazon/dynamodb-local
```

5. Crie a tabela no DynamoDB Local:
```bash
aws dynamodb create-table \
  --table-name Customers \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --endpoint-url http://localhost:8000
```

## Estrutura do Cliente

```typescript
interface Customer {
  id: string;
  name: string;
  birthDate: string; /* Formato: YYYY-MM-DD */
  isActive: boolean;
  addresses: string[];
  contacts: {
    email: string;
    phone: string;
    isPrimary: boolean;
  }[];
}
```

##  Endpoints da API

### Criar Cliente
```http
POST /customers

{
  "name": "João Silva",
  "birthDate": "1990-01-01",
  "isActive": true,
  "addresses": ["Rua A, 123"],
  "contacts": [
    {
      "email": "joao@email.com",
      "phone": "11999999999",
      "isPrimary": true
    }
  ]
}
```

### Buscar Cliente
```http
GET /customers/{id}
```

### Atualizar Cliente
```http
PUT /customers/{id}

{
  "name": "João Silva Atualizado",
  "isActive": false
}
```

### Deletar Cliente
```http
DELETE /customers/{id}
```

##  Testes

Execute os testes unitários:
```bash
npm test
```

Para ver a cobertura de testes:
```bash
npm run test:coverage
```

##  Deploy

1. Construa o projeto:
```bash
npm run build
```

2. Faça o deploy usando o AWS SAM ou diretamente pelo console da AWS:
```bash
sam deploy
```

## Variáveis de Ambiente

```env
AWS_REGION=us-east-1
CUSTOMERS_TABLE=Customers
IS_OFFLINE=true # apenas para desenvolvimento local
```

## Desenvolvimento Local

1. Inicie o DynamoDB Local:
```bash
docker start dynamodb-local
```

2. Configure as variáveis de ambiente para desenvolvimento local:
```bash
export IS_OFFLINE=true
export AWS_REGION=us-east-1
export CUSTOMERS_TABLE=Customers
```

3. Execute os testes para verificar se tudo está funcionando:
```bash
npm test
```

##  Validações

O sistema inclui as seguintes validações:
- Nome não pode ser vazio
- Data de nascimento deve estar no formato YYYY-MM-DD
- Pelo menos um endereço é obrigatório
- Pelo menos um contato deve ser marcado como principal
- Email deve ser válido
- Telefone deve ser válido (10-11 dígitos)

##  Status Codes

- 200: Sucesso
- 201: Criado com sucesso
- 204: Deletado com sucesso
- 400: Erro de validação
- 404: Recurso não encontrado
- 500: Erro interno do servidor
