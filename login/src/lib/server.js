import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptador para adicionar token nas requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('ellp_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptador para lidar com respostas de erro (token expirado)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token inválido ou expirado
            localStorage.removeItem('ellp_token');
            localStorage.removeItem('ellp_user');
            
            // Redirecionar para login apenas se não estivermos já na página de login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getUserProfile = async () => {
    try {
        const response = await api.get('/auth/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const resetPassword = async (resetData) => {
    try {
        const response = await api.post('/auth/reset-password', resetData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listStudents = async () => {
    try {
        const response = await api.get('/users/role/STUDENT');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getUserById = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listWorkshops = async () => {
    try {
        const response = await api.get('/workshops');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createWorkshop = async (workshopData) => {
    try {
        const response = await api.post('/workshops', workshopData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getWorkshopById = async (id) => {
    try {
        const response = await api.get(`/workshops/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateWorkshop = async (id, workshopData) => {
    try {
        const response = await api.put(`/workshops/${id}`, workshopData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteWorkshop = async (id) => {
    try {
        const response = await api.delete(`/workshops/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listEnrollments = async () => {
    try {
        const response = await api.get('/enrollments');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createEnrollment = async (enrollmentData) => {
    try {
        const response = await api.post('/enrollments', enrollmentData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getEnrollmentById = async (id) => {
    try {
        const response = await api.get(`/enrollments/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateEnrollment = async (id, enrollmentData) => {
    try {
        const response = await api.put(`/enrollments/${id}`, enrollmentData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteEnrollment = async (id) => {
    try {
        const response = await api.delete(`/enrollments/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listClasses = async () => {
    try {
        const response = await api.get('/classes');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createClass = async (classData) => {
    try {
        const response = await api.post('/classes', classData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getClassById = async (id) => {
    try {
        const response = await api.get(`/classes/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateClass = async (id, classData) => {
    try {
        const response = await api.put(`/classes/${id}`, classData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteClass = async (id) => {
    try {
        const response = await api.delete(`/classes/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getTotalStudentsByClass = async (classId) => {
    try {
        const response = await api.get(`/classes/${classId}/students/count`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

// Grades (Notas)
export const listGrades = async () => {
    try {
        const response = await api.get('/grades');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createGrade = async (gradeData) => {
    try {
        const response = await api.post('/grades', gradeData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getGradeById = async (id) => {
    try {
        const response = await api.get(`/grades/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateGrade = async (id, gradeData) => {
    try {
        const response = await api.put(`/grades/${id}`, gradeData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteGrade = async (id) => {
    try {
        const response = await api.delete(`/grades/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getStudentGrades = async (studentId) => {
    try {
        const response = await api.get(`/grades/student/${studentId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getClassGrades = async (classId) => {
    try {
        const response = await api.get(`/grades/class/${classId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// ===== VOLUNTEERS API =====
export const listVolunteers = async (params = {}) => {
    try {
        const response = await api.get('/volunteers', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getVolunteerById = async (id) => {
    try {
        const response = await api.get(`/volunteers/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateVolunteer = async (id, volunteerData) => {
    try {
        const response = await api.put(`/volunteers/${id}`, volunteerData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getVolunteerStats = async (id) => {
    try {
        const response = await api.get(`/volunteers/${id}/stats`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getVolunteerWorkshops = async (id, params = {}) => {
    try {
        const response = await api.get(`/volunteers/${id}/workshops`, { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getVolunteerAttendances = async (id, params = {}) => {
    try {
        const response = await api.get(`/volunteers/${id}/attendances`, { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Attendance (Presença)
export const listAttendances = async () => {
    try {
        const response = await api.get('/attendances');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createAttendance = async (attendanceData) => {
    try {
        const response = await api.post('/attendances', attendanceData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getAttendanceById = async (id) => {
    try {
        const response = await api.get(`/attendances/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateAttendance = async (id, attendanceData) => {
    try {
        const response = await api.put(`/attendances/${id}`, attendanceData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteAttendance = async (id) => {
    try {
        const response = await api.delete(`/attendances/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getClassAttendances = async (classId, date) => {
    try {
        const response = await api.get(`/attendances/class/${classId}`, {
            params: { date }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const markAttendance = async (attendanceData) => {
    try {
        const response = await api.post('/attendances/mark', attendanceData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
