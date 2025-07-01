# Exemplos de Uso da API

## Autenticação

### Registrar novo usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "123456",
    "role": "STUDENT"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Resposta:

```json
{
    "user": {
        "id": 1,
        "name": "Administrador",
        "email": "admin@example.com",
        "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Obter perfil do usuário

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Workshops

### Listar todos os workshops

```bash
curl -X GET http://localhost:3000/api/workshops
```

### Criar novo workshop (requer token de ADMIN ou TEACHER)

```bash
curl -X POST http://localhost:3000/api/workshops \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Avançado",
    "description": "Aprenda conceitos avançados do React",
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-08-31T00:00:00.000Z",
    "maxParticipants": 25
  }'
```

### Obter workshop por ID

```bash
curl -X GET http://localhost:3000/api/workshops/1
```

### Atualizar workshop (requer token de ADMIN ou TEACHER)

```bash
curl -X PUT http://localhost:3000/api/workshops/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Avançado - Atualizado",
    "maxParticipants": 30
  }'
```

## Matrículas

### Criar matrícula

```bash
curl -X POST http://localhost:3000/api/enrollments \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "workshopId": 1,
    "status": "ACTIVE"
  }'
```

### Listar matrículas

```bash
curl -X GET http://localhost:3000/api/enrollments \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Aulas

### Criar aula (requer token de ADMIN ou TEACHER)

```bash
curl -X POST http://localhost:3000/api/classes \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "workshopId": 1,
    "date": "2024-06-05T14:00:00.000Z",
    "subject": "Hooks no React",
    "taughtById": 2,
    "enrolledStudents": 15
  }'
```

### Listar aulas

```bash
curl -X GET http://localhost:3000/api/classes \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Presenças

### Registrar presença

```bash
curl -X POST http://localhost:3000/api/attendances \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 3,
    "classId": 1,
    "present": true
  }'
```

### Listar presenças

```bash
curl -X GET http://localhost:3000/api/attendances \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Notas

### Criar nota (requer token de ADMIN ou TEACHER)

```bash
curl -X POST http://localhost:3000/api/grades \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 3,
    "classId": 1,
    "grade": 9.5,
    "notes": "Excelente compreensão dos conceitos"
  }'
```

### Listar notas

```bash
curl -X GET http://localhost:3000/api/grades \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Usuários

### Listar usuários (requer token de ADMIN)

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Obter usuário por ID (próprio usuário ou ADMIN)

```bash
curl -X GET http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Atualizar usuário (próprio usuário ou ADMIN)

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Atualizado",
    "email": "joao.novo@example.com"
  }'
```

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `401` - Não autenticado (token inválido ou ausente)
- `403` - Acesso negado (permissão insuficiente)
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

## Estrutura de Resposta de Erro

```json
{
    "error": "Mensagem de erro",
    "details": "Detalhes adicionais (opcional)"
}
```

## Estrutura de Resposta de Validação

```json
{
    "errors": [
        {
            "field": "email",
            "message": "E-mail é obrigatório"
        },
        {
            "field": "password",
            "message": "Senha deve ter pelo menos 6 caracteres"
        }
    ]
}
```
