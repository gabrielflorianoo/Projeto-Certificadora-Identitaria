# API Documentation

## Autenticação

### POST /api/auth/register

Registro de novo usuário

```json
{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123",
    "role": "STUDENT" // ADMIN, STUDENT, VOLUNTEER, TEACHER
}
```

### POST /api/auth/login

Login do usuário

```json
{
    "email": "joao@email.com",
    "password": "senha123"
}
```

### GET /api/auth/me

Obter dados do usuário logado (requer token)

## Usuários

### GET /api/users

Listar todos os usuários (requer autenticação)

### GET /api/users/:id

Obter usuário por ID (requer autenticação)

### PUT /api/users/:id

Atualizar usuário (requer autenticação)

### DELETE /api/users/:id

Deletar usuário (requer autenticação)

## Workshops

### GET /api/workshops

Listar workshops

### POST /api/workshops

Criar workshop (requer autenticação)

```json
{
    "title": "Workshop de Node.js",
    "description": "Aprendendo Node.js do zero",
    "startDate": "2025-07-01T10:00:00.000Z",
    "endDate": "2025-07-10T18:00:00.000Z",
    "maxParticipants": 30
}
```

### GET /api/workshops/:id

Obter workshop por ID

### PUT /api/workshops/:id

Atualizar workshop (requer autenticação)

### DELETE /api/workshops/:id

Deletar workshop (requer autenticação)

## Matrículas

### GET /api/enrollments

Listar matrículas (requer autenticação)

### POST /api/enrollments

Criar matrícula (requer autenticação)

```json
{
    "userId": 1,
    "workshopId": 1,
    "status": "ENROLLED"
}
```

### GET /api/enrollments/:id

Obter matrícula por ID (requer autenticação)

### PUT /api/enrollments/:id

Atualizar matrícula (requer autenticação)

### DELETE /api/enrollments/:id

Cancelar matrícula (requer autenticação)

## Aulas

### GET /api/classes

Listar aulas (requer autenticação)

### POST /api/classes

Criar aula (requer autenticação)

```json
{
    "workshopId": 1,
    "date": "2025-07-01T10:00:00.000Z",
    "subject": "Introdução ao Node.js",
    "taughtById": 2,
    "enrolledStudents": 25
}
```

### GET /api/classes/:id

Obter aula por ID (requer autenticação)

### PUT /api/classes/:id

Atualizar aula (requer autenticação)

### DELETE /api/classes/:id

Deletar aula (requer autenticação)

## Presenças

### GET /api/attendances

Listar presenças (requer autenticação)

### POST /api/attendances

Registrar presença (requer autenticação)

```json
{
    "userId": 1,
    "classId": 1,
    "present": true
}
```

### GET /api/attendances/:id

Obter presença por ID (requer autenticação)

### PUT /api/attendances/:id

Atualizar presença (requer autenticação)

### DELETE /api/attendances/:id

Deletar registro de presença (requer autenticação)

## Notas

### GET /api/grades

Listar notas (requer autenticação)

### POST /api/grades

Criar nota (requer autenticação)

```json
{
    "userId": 1,
    "classId": 1, // opcional
    "workshopId": 1, // opcional
    "grade": 8.5,
    "notes": "Ótimo desempenho"
}
```

### GET /api/grades/:id

Obter nota por ID (requer autenticação)

### PUT /api/grades/:id

Atualizar nota (requer autenticação)

### DELETE /api/grades/:id

Deletar nota (requer autenticação)

## Headers necessários

Para rotas autenticadas, incluir:

```
Authorization: Bearer <token_jwt>
```

## Variáveis de Ambiente

Criar arquivo `.env`:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
JWT_SECRET="seu_jwt_secret_super_secreto"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3000
```
