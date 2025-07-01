import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sistema de Certificação Identitária API',
            version: '1.0.0',
            description: 'API para gerenciamento de workshops, usuários, matrículas, aulas, presenças e notas',
            contact: {
                name: 'Suporte',
                email: 'suporte@example.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desenvolvimento'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único do usuário'
                        },
                        name: {
                            type: 'string',
                            description: 'Nome completo do usuário'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'E-mail do usuário'
                        },
                        role: {
                            type: 'string',
                            enum: ['ADMIN', 'STUDENT', 'VOLUNTEER', 'TEACHER'],
                            description: 'Papel do usuário no sistema'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data da última atualização'
                        }
                    }
                },
                Workshop: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único do workshop'
                        },
                        title: {
                            type: 'string',
                            description: 'Título do workshop'
                        },
                        description: {
                            type: 'string',
                            description: 'Descrição detalhada do workshop'
                        },
                        startDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de início'
                        },
                        endDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de término'
                        },
                        maxParticipants: {
                            type: 'integer',
                            description: 'Número máximo de participantes'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data da última atualização'
                        }
                    }
                },
                Enrollment: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único da matrícula'
                        },
                        userId: {
                            type: 'integer',
                            description: 'ID do usuário matriculado'
                        },
                        workshopId: {
                            type: 'integer',
                            description: 'ID do workshop'
                        },
                        status: {
                            type: 'string',
                            description: 'Status da matrícula'
                        },
                        date: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data da matrícula'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data da última atualização'
                        }
                    }
                },
                Class: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único da aula'
                        },
                        workshopId: {
                            type: 'integer',
                            description: 'ID do workshop'
                        },
                        date: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data e hora da aula'
                        },
                        subject: {
                            type: 'string',
                            description: 'Assunto da aula'
                        },
                        taughtById: {
                            type: 'integer',
                            description: 'ID do professor'
                        },
                        enrolledStudents: {
                            type: 'integer',
                            description: 'Número de estudantes matriculados'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação'
                        }
                    }
                },
                Attendance: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único da presença'
                        },
                        userId: {
                            type: 'integer',
                            description: 'ID do estudante'
                        },
                        classId: {
                            type: 'integer',
                            description: 'ID da aula'
                        },
                        present: {
                            type: 'boolean',
                            description: 'Se o estudante esteve presente'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data da última atualização'
                        }
                    }
                },
                Grade: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único da nota'
                        },
                        userId: {
                            type: 'integer',
                            description: 'ID do estudante'
                        },
                        classId: {
                            type: 'integer',
                            description: 'ID da aula (opcional)'
                        },
                        workshopId: {
                            type: 'integer',
                            description: 'ID do workshop (opcional)'
                        },
                        grade: {
                            type: 'number',
                            format: 'float',
                            description: 'Nota atribuída'
                        },
                        notes: {
                            type: 'string',
                            description: 'Observações sobre a nota'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data da última atualização'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Mensagem de erro'
                        },
                        details: {
                            type: 'string',
                            description: 'Detalhes adicionais do erro'
                        }
                    }
                },
                ValidationError: {
                    type: 'object',
                    properties: {
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: {
                                        type: 'string',
                                        description: 'Campo com erro'
                                    },
                                    message: {
                                        type: 'string',
                                        description: 'Mensagem de erro'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./routes/*.js', './controllers/*.js', './swagger/*.js'], // Caminhos para os arquivos com documentação
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
