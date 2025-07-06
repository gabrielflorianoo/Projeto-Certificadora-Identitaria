# Sistema ELLP - Educação Lógica, Lúdica e Programação

## 🎯 Objetivo do Sistema

O Sistema ELLP (Educação Lógica, Lúdica e Programação) é uma plataforma web desenvolvida para gerenciar workshops educacionais da UTFPR - Campus Cornélio Procópio. O sistema permite o controle completo de usuários, workshops, aulas, matrículas, frequência e notas, facilitando a administração de projetos educacionais voltados ao ensino de programação e lógica. (usamos lovable.dev para deixar o design um pouco mais moderno, pois estava dando conflitos com varios navegadores)

## Integrantes do grupo
- Gabriel Fernando Floriano 2564149
- Matheus Marinho Rodrigues 2575299
- Robson Luís de Carvalho 2539039

## 🚀 Funcionalidades Desenvolvidas

### ✅ Funcionalidades Implementadas e Avaliáveis:

#### **Autenticação e Autorização**
- [x] Sistema de login com JWT
- [x] Registro de usuários com validação completa
- [x] Recuperação de senha por email
- [x] Controle de acesso baseado em roles (ADMIN, TEACHER, STUDENT, VOLUNTEER)
- [x] Middleware de autenticação e autorização

#### **Gestão de Usuários**
- [x] CRUD completo de usuários
- [x] Listagem com paginação e filtros
- [x] Perfis diferenciados por tipo de usuário
- [x] Dashboard personalizado para cada role
- [x] Campos obrigatórios: nome, email, telefone, data de nascimento, idade

#### **Gestão de Workshops**
- [x] CRUD completo de workshops
- [x] Controle de modalidade (Presencial, Online, Híbrido)
- [x] Gestão de vagas e período de realização
- [x] Associação com semestre e localização

#### **Sistema de Matrículas**
- [x] Inscrição em workshops
- [x] Controle de status (Pendente, Aprovado, Rejeitado, Cancelado, Participando)
- [x] Validação de vagas disponíveis
- [x] Histórico de matrículas

#### **Gestão de Aulas**
- [x] CRUD de aulas vinculadas aos workshops
- [x] Associação com professores
- [x] Controle de data e assunto
- [x] Contagem de alunos matriculados

#### **Sistema de Frequência**
- [x] Marcação de presença por aula
- [x] Relatórios de frequência
- [x] Marcação em lote
- [x] Histórico de presenças

#### **Sistema de Notas**
- [x] Lançamento de notas por aula ou workshop
- [x] Diferentes tipos de avaliação (Prova, Trabalho, Participação, Exame Final)
- [x] Sistema de pesos para cálculo de médias
- [x] Relatórios de desempenho

#### **Relatórios e Dashboards**
- [x] Dashboard administrativo com estatísticas
- [x] Dashboard específico para estudantes
- [x] Relatórios de frequência e notas
- [x] Gráficos de desempenho

#### **Interface e Experiência do Usuário**
- [x] Design responsivo com Tailwind CSS
- [x] Componentes reutilizáveis (Glass Card, Tables, Forms)
- [x] Navegação intuitiva com Navbar
- [x] Feedback visual (toasts, loading states)
- [x] Tema escuro com efeitos glassmorphism

## 🛠️ Ferramentas e Tecnologias Utilizadas

### **Backend:**
- **Node.js** v18.17.0+ - [Download](https://nodejs.org/)
- **Express.js** v4.18.2 - Framework web para Node.js
- **Prisma ORM** v6.10.1 - ORM para banco de dados - [Documentação](https://www.prisma.io/)
- **MySQL** v8.0+ - Sistema de gerenciamento de banco de dados - [Download](https://dev.mysql.com/downloads/)

### **Frontend:**
- **React** v18.2.0 - Biblioteca para interfaces de usuário - [Documentação](https://react.dev/)
- **Vite** v5.0.8 - Build tool - [Documentação](https://vitejs.dev/)
- **Tailwind CSS** v3.3.0 - Framework CSS - [Documentação](https://tailwindcss.com/)
- **shadcn/ui** - Componentes de UI - [Documentação](https://ui.shadcn.com/)

### **Bibliotecas Complementares:**
- **bcryptjs** v2.4.3 - Hash de senhas
- **jsonwebtoken** v9.0.0 - Autenticação JWT
- **express-validator** v6.15.0 - Validação de dados
- **cors** v2.8.5 - Cross-Origin Resource Sharing
- **swagger-ui-express** v4.6.2 - Documentação da API
- **react-router-dom** v6.8.1 - Roteamento no React
- **axios** v1.3.4 - Cliente HTTP

## 📦 Instalação e Configuração

### **Pré-requisitos:**
- Node.js v18.17.0 ou superior
- MySQL v8.0 ou superior
- npm ou yarn

### **1. Clonando o Repositório:**
```bash
git clone [URL_DO_REPOSITORIO]
cd Projeto-Certificadora-Identitaria
```

### **2. Configuração do Banco de Dados:**

#### **2.1. Instalar MySQL:**
- Baixe e instale o MySQL: https://dev.mysql.com/downloads/
- Configure um usuário root com senha

#### **2.2. Criar Base de Dados: (caso precise)**
```sql
CREATE DATABASE certificadora_db;
CREATE USER 'certificadora_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';
GRANT ALL PRIVILEGES ON certificadora_db.* TO 'certificadora_user'@'localhost';
FLUSH PRIVILEGES;
```

### **3. Configuração do Backend:**

#### **3.1. Navegar para a pasta do backend:**
```bash
cd backend
```

#### **3.2. Instalar dependências:**
```bash
npm install
```

#### **3.3. Configurar variáveis de ambiente:**
Crie um arquivo `.env` na pasta `backend` com o seguinte conteúdo:
```env
# Database
DATABASE_URL="mysql://certificadora_user:sua_senha_segura@localhost:3306/certificadora_db"
DATABASE_PROVIDER="mysql"

# JWT
JWT_SECRET="seu_jwt_secret_muito_seguro_aqui"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# Email (Para recuperação de senha)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="seu_email@gmail.com"
SMTP_PASS="sua_senha_de_app"
EMAIL_FROM="seu_email@gmail.com"
```

#### **3.4. Configurar o banco de dados:**
```bash
# Gerar o Prisma Client
npx prisma generate

# Aplicar o schema ao banco
npx prisma db push

# Popular o banco com dados de exemplo
npx prisma db seed
```

#### **3.5. Executar o backend:**
```bash
npm start
```
O backend estará rodando em: http://localhost:5000

### **4. Configuração do Frontend:**

#### **4.1. Abrir um novo terminal e navegar para a pasta do frontend:**
```bash
cd login
```

#### **4.2. Instalar dependências:**
```bash
npm install
```

#### **4.3. Configurar variáveis de ambiente:**
Crie um arquivo `.env` na pasta `login` com:
```env
VITE_API_URL=http://localhost:5000/api
```

#### **4.4. Executar o frontend:**
```bash
npm run dev
```
O frontend estará rodando em: http://localhost:5173

## 🧪 Roteiro para Testar o Sistema

### **1. Acesso Inicial:**
Acesse: http://localhost:5173

### **2. Contas de Acesso Padrão:**

#### **Administrador:**
- **Email:** admin@example.com
- **Senha:** admin123
- **Permissões:** Acesso total ao sistema

#### **Professor:**
- **Email:** joao@example.com
- **Senha:** 123456
- **Permissões:** Gerenciar aulas, frequência e notas

#### **Estudante:**
- **Email:** ana@example.com
- **Senha:** 123456
- **Permissões:** Visualizar dashboard e se inscrever em workshops

#### **Voluntário:**
- **Email:** beatriz@example.com
- **Senha:** 123456
- **Permissões:** Auxiliar em atividades e workshops

### **3. Sequência de Testes Recomendada:**

#### **3.1. Teste de Autenticação:**
1. Acesse a página de login
2. Teste login com credenciais válidas
3. Teste login com credenciais inválidas
4. Teste a funcionalidade "Esqueci minha senha"
5. Teste logout

#### **3.2. Teste de Registro:**
1. Acesse "Criar Conta"
2. Preencha todos os campos obrigatórios
3. Observe o cálculo automático da idade
4. Teste validações de campos

#### **3.3. Teste como Administrador:**
1. Faça login como admin
2. Acesse "Usuários" → Visualize lista de usuários
3. Acesse "Workshops" → Crie um novo workshop
4. Acesse "Relatórios" → Visualize estatísticas

#### **3.4. Teste como Professor:**
1. Faça login como professor
2. Acesse "Aulas" → Crie uma nova aula
3. Acesse "Frequência" → Marque presença dos alunos
4. Acesse "Notas" → Lance notas para os alunos

#### **3.5. Teste como Estudante:**
1. Faça login como estudante
2. Visualize o dashboard personalizado
3. Acesse "Workshops" → Inscreva-se em um workshop
4. Visualize suas notas e frequência

#### **3.6. Teste como Voluntário:**
1. Faça login como voluntário
2. Visualize workshops disponíveis
3. Acesse seu perfil e histórico

### **4. Funcionalidades Específicas para Testar:**

#### **4.1. Sistema de Matrículas:**
- Inscrição em workshops
- Controle de vagas
- Status de matrícula

#### **4.2. Sistema de Frequência:**
- Marcação individual
- Marcação em lote
- Relatórios de presença

#### **4.3. Sistema de Notas:**
- Lançamento por aula
- Lançamento por workshop
- Cálculo de médias com pesos

#### **4.4. Dashboards:**
- Estatísticas em tempo real
- Gráficos de desempenho
- Dados personalizados por usuário

## 📚 Documentação da API

A documentação completa da API está disponível em:
http://localhost:5000/api-docs

## 🔧 Scripts Úteis

### **Backend:**
```bash
npm start          # Iniciar servidor
npm run dev        # Iniciar em modo desenvolvimento
npm run seed       # Popular banco com dados de exemplo
```

### **Frontend:**
```bash
npm run dev        # Iniciar em modo desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build
```

## 📝 Estrutura do Projeto

```
├── backend/                 # API e servidor
│   ├── controllers/         # Controladores da API
│   ├── middleware/          # Middlewares de auth e roles
│   ├── prisma/             # Schema e migrations
│   ├── routes/             # Rotas da API
│   └── utils/              # Utilitários
├── login/                  # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── contexts/       # Contextos React
│   │   └── lib/            # Utilitários e API client
└── README.md
```

## 🐛 Solução de Problemas Comuns

### **Erro de conexão com banco:**
- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão manualmente

### **Erro de CORS:**
- Verifique se o backend está rodando na porta 5000
- Confirme a URL da API no frontend

### **Erro de autenticação:**
- Verifique se o JWT_SECRET está configurado
- Confirme se o token não expirou

## 📧 Contato

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

**Universidade:** UTFPR - Campus Cornélio Procópio
