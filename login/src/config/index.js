// Configurações da aplicação
export const config = {
    // URL da API do backend
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    
    // URLs dos frontends
    FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:8080',
    LOGIN_URL: import.meta.env.VITE_LOGIN_URL || 'http://localhost:5173',
    
    // Configurações de autenticação
    TOKEN_KEY: 'ellp_token',
    USER_KEY: 'ellp_user',
    
    // Configurações de paginação
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    
    // Configurações de timeout
    REQUEST_TIMEOUT: 30000, // 30 segundos
    
    // Roles disponíveis
    ROLES: {
        ADMIN: 'ADMIN',
        TEACHER: 'TEACHER',
        VOLUNTEER: 'VOLUNTEER',
        STUDENT: 'STUDENT'
    },
    
    // Status de presença
    ATTENDANCE_STATUS: {
        PRESENT: 'present',
        ABSENT: 'absent',
        LATE: 'late'
    },
    
    // Configurações de notas
    GRADE_CONFIG: {
        MIN_GRADE: 0,
        MAX_GRADE: 10,
        PASSING_GRADE: 7,
        DEFAULT_WEIGHT: 1
    }
};

export default config;
