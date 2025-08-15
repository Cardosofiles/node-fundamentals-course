# Node Fundamentals Course

Repositório com o código-fonte desenvolvido durante o curso introdutório de Node.js. O objetivo é apresentar, de forma prática, conceitos essenciais do desenvolvimento backend com Node, incluindo manipulação de arquivos, rotas HTTP e lógica de negócios básica.

## Principais Funcionalidades e Casos de Uso

- Implementação de servidor HTTP básico
- Manipulação de rotas e métodos HTTP (GET, POST, PUT, DELETE)
- Leitura e escrita de arquivos utilizando o módulo `fs`
- Simulação de API RESTful para operações CRUD
- Exercícios práticos para fixação dos conceitos

## Stack e Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript server-side (100% do código)
- **JavaScript**: Linguagem principal do projeto
- **Módulos Nativos Node.js**: `http`, `fs`, `path`, entre outros
- **npm**: Gerenciamento de dependências (se houver)
- **(Opcional)** Bibliotecas auxiliares apresentadas no curso

## Estrutura de Pastas e Explicação

```
node-fundamentals-course/
├── src/               # Código-fonte principal (servidor, rotas, controllers, etc.)
├── data/              # Arquivos de dados simulando persistência (JSON, txt, etc.)
├── test/              # Scripts de teste automatizado/manual (se houver)
├── package.json       # Metadados do projeto e dependências
├── .gitignore         # Arquivos/pastas ignorados pelo git
└── README.md          # Documentação do projeto
```

- **src/**: Onde está a lógica principal da aplicação.
- **data/**: Armazena arquivos de dados utilizados para simular operações de leitura/escrita.
- **test/**: Contém testes automatizados ou scripts de verificação manual (caso existam).
- **package.json**: Lista dependências e scripts de inicialização.

## Instalação e Execução Local

### Pré-requisitos

- [Node.js](https://nodejs.org/) (recomendado: versão 18+)
- [npm](https://www.npmjs.com/) (instalado junto com o Node)

### Passo a passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Cardosofiles/node-fundamentals-course.git
   cd node-fundamentals-course
   ```

2. **Instale as dependências (se houver)**
   ```bash
   npm install
   ```

3. **Configure variáveis de ambiente (se necessário)**
   - Se o projeto exigir, crie um arquivo `.env` com as variáveis necessárias.

4. **Execute o servidor**
   ```bash
   node src/index.js
   # ou conforme instrução no package.json
   npm start
   ```

   O servidor geralmente estará disponível em `http://localhost:3000` (ou porta definida no código).

## Como Executar Testes

Se existirem testes automatizados:
```bash
npm test
```
Caso contrário, recomenda-se testar manualmente via ferramentas como [Postman](https://www.postman.com/) ou [curl](https://curl.se/).

## Exemplos de Uso dos Endpoints

### Criar um registro

```http
POST /items
Content-Type: application/json

{
  "name": "Exemplo",
  "value": 123
}
```

### Listar registros

```http
GET /items
```

### Atualizar um registro

```http
PUT /items/1
Content-Type: application/json

{
  "name": "Novo Nome"
}
```

### Deletar um registro

```http
DELETE /items/1
```

## Boas Práticas e Recomendações

- Siga a padronização do código apresentada no curso.
- Teste individualmente cada rota após alterações.
- Comente trechos de código relevantes para facilitar o entendimento.
- Utilize variáveis de ambiente para informações sensíveis.
- Crie branches para implementar novas funcionalidades ou correções.
- Mantenha o projeto atualizado com novas práticas aprendidas.

---

Contribuições e sugestões são bem-vindas!

## 📫 Contato

<div align="center">

<a href="mailto:cardosofiles@outlook.com">
  <img src="https://img.shields.io/badge/Email-0078D4?style=for-the-badge&logo=microsoftoutlook&logoColor=white" alt="Email"/>
</a>
<a href="https://www.linkedin.com/in/joaobatista-dev/" target="_blank">
  <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
</a>
<a href="https://github.com/Cardosofiles" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
</a>
<a href="https://cardosofiles.dev/" target="_blank">
  <img src="https://img.shields.io/badge/Portfólio-222222?style=for-the-badge&logo=about.me&logoColor=white" alt="Portfólio"/>
</a>

</div>
