# banco-api-performance

Projeto de testes de performance e carga para uma API bancária, desenvolvido com k6.

## Objetivo

Validar o comportamento e a estabilidade da API em cenários de:

- autenticação via login
- envio de transferências
- verificação de status HTTP e resposta de payloads
- thresholds de tempo de resposta e taxa de falhas

## Stack e ferramentas

- k6
- JavaScript
- JSON para fixtures e configuração local

## Estrutura do projeto

```text
banco-api-performance/
├── fixtures/
│   └── postLogin.json         # payload de login usado nos testes
├── helpers/
│   └── autenticacao.js        # helper para obter token de autenticação
├── tests/
│   ├── login.test.js          # teste de carga do endpoint /login
│   └── transferencias.js     # teste do endpoint de transferências
├── utils/
│   └── variaveis.js          # leitura da URL base e variáveis de ambiente
├── README.md
└── config/
    └── config.local.json     # arquivo local de configuração (não versionado, se necessário)
```

## Requisitos

- k6 instalado na máquina
- API bancária em execução localmente ou em ambiente de teste
- acesso ao endpoint de autenticação e transferências

## Configuração

O projeto usa a URL base da API a partir de variáveis de ambiente ou de um arquivo local.

### Variáveis de ambiente

```bash
export BASE_URL="http://localhost:3000"
export LOGIN_USERNAME="julio.lima"
export LOGIN_PASSWORD="123456"
```

### Arquivo de configuração local

Crie um arquivo `config/config.local.json` com o seguinte formato:

```json
{
  "baseUrl": "http://localhost:3000"
}
```

> O arquivo `utils/variaveis.js` tenta ler `./config/config.local.json` quando `BASE_URL` não está definido.

## Como executar os testes

### Teste de login

```bash
k6 run tests/login.test.js
```

Com ambiente explícito:

```bash
k6 run --env BASE_URL=http://localhost:3000 --env LOGIN_USERNAME=julio.lima --env LOGIN_PASSWORD=123456 tests/login.test.js
```

### Teste de transferências

```bash
k6 run tests/transferencias.js
```

Com ambiente explícito:

```bash
k6 run --env BASE_URL=http://localhost:3000 tests/transferencias.js
```

## Detalhes dos testes

### login.test.js

- chama o endpoint `/login`
- envia payload com username e senha
- valida:
  - status HTTP 200
  - retorno do token com tipo string
- define thresholds para:
  - latência p(95) < 300ms
  - tempo máximo < 500ms
  - taxa de falhas < 1%

### transferencias.js

- obtém token via helper de autenticação
- chama o endpoint `/transferencias`
- envia dados de conta de origem, conta de destino e valor
- valida status HTTP 201
- usa `iterations: 10` como cenário básico de execução

## Helpers e utilitários

### helpers/autenticacao.js

Responsável por:

- montar a URL de login
- enviar o payload do fixture
- chamar `/login`
- retornar o token em JSON para uso em outros testes

### utils/variaveis.js

Responsável por centralizar a base URL da API:

- usa `__ENV.BASE_URL` quando informado
- cai para `config/config.local.json` em caso contrário

## Boas práticas

- mantenha a base URL em ambiente ou configuração local
- evite hardcode de credenciais no código
- use sempre thresholds que reflitam o SLO da API
- ajuste `stages`, `vus` e `duration` conforme o cenário real de produção
- sempre valide retornos da API antes de considerar o teste estável

## Observação

Este projeto é um exemplo de benchmark de API com foco em carga e performance. Ele pode ser adaptado para qualquer serviço REST que exija autenticação e execução de ações de negócio, como transferências financeiras.
