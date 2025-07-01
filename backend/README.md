# Backend - Sistema de Certificação Identitária

Este é o backend do sistema de certificação identitária, desenvolvido com Node.js, Express e Prisma.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação por tokens
- **bcryptjs** - Criptografia de senhas

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório e navegue até a pasta do backend
2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações.

4. Execute o setup inicial:

```bash
npm run setup
```

5. Execute as migrações do banco de dados:

```bash
npm run db:migrate
```

6. (Opcional) Popule o banco com dados de exemplo:

```bash
npm run db:seed
```

## 🎯 Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run setup` - Executa o setup inicial do projeto
- `npm run db:migrate` - Executa migrações do banco
- `npm run db:reset` - Reset completo do banco
- `npm run db:studio` - Abre o Prisma Studio
- `npm run db:seed` - Popula o banco com dados de exemplo

## 📚 API Endpoints

### Autenticação

- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do usuário (requer token)

### Usuários

- `GET /api/users` - Listar usuários (Admin)
- `GET /api/users/:id` - Buscar usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário (Admin)

### Workshops

- `GET /api/workshops` - Listar workshops
- `POST /api/workshops` - Criar workshop (Admin/Teacher)
- `GET /api/workshops/:id` - Buscar workshop por ID
- `PUT /api/workshops/:id` - Atualizar workshop (Admin/Teacher)
- `DELETE /api/workshops/:id` - Deletar workshop (Admin)

### Matrículas

- `GET /api/enrollments` - Listar matrículas
- `POST /api/enrollments` - Criar matrícula
- `GET /api/enrollments/:id` - Buscar matrícula por ID
- `PUT /api/enrollments/:id` - Atualizar matrícula
- `DELETE /api/enrollments/:id` - Deletar matrícula

### Aulas

- `GET /api/classes` - Listar aulas
- `POST /api/classes` - Criar aula (Admin/Teacher)
- `GET /api/classes/:id` - Buscar aula por ID
- `PUT /api/classes/:id` - Atualizar aula (Admin/Teacher)
- `DELETE /api/classes/:id` - Deletar aula (Admin/Teacher)

### Presenças

- `GET /api/attendances` - Listar presenças
- `POST /api/attendances` - Registrar presença
- `GET /api/attendances/:id` - Buscar presença por ID
- `PUT /api/attendances/:id` - Atualizar presença
- `DELETE /api/attendances/:id` - Deletar presença

### Notas

- `GET /api/grades` - Listar notas
- `POST /api/grades` - Criar nota (Admin/Teacher)
- `GET /api/grades/:id` - Buscar nota por ID
- `PUT /api/grades/:id` - Atualizar nota (Admin/Teacher)
- `DELETE /api/grades/:id` - Deletar nota (Admin/Teacher)

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Para acessar endpoints protegidos, inclua o token no header:

```
Authorization: Bearer <seu-token>
```

## 👥 Níveis de Acesso

- **ADMIN** - Acesso total ao sistema
- **TEACHER** - Pode gerenciar workshops, aulas e notas
- **STUDENT** - Acesso limitado aos próprios dados
- **VOLUNTEER** - Acesso básico

## 🗄️ Banco de Dados

O sistema usa PostgreSQL com Prisma ORM. O esquema inclui:

- **Users** - Usuários do sistema
- **Workshops** - Cursos/oficinas
- **Enrollments** - Matrículas dos usuários nos workshops
- **Classes** - Aulas dos workshops
- **Attendances** - Registro de presença nas aulas
- **Grades** - Notas dos estudantes

## 🛠️ Desenvolvimento

Para visualizar e gerenciar os dados do banco:

```bash
npm run db:studio
```

Para resetar o banco em desenvolvimento:

```bash
npm run db:reset
```

## 📝 Variáveis de Ambiente

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your-very-secure-secret-key-here"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

## 🔍 Logs e Debug

O sistema usa Morgan para logs HTTP. Em desenvolvimento, os logs são mais detalhados.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
