const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SMS Reklama API - Til Kurslari',
            version: '1.0.0',
            description: '# SMS Reklama API - Ibrat Farzandlari\n' +
                'Eskiz.uz SMS API orqali til o\'quv kurslari uchun reklama SMS yuborish tizimi.\n\n' +
                '## Xususiyatlar\n' +
                '- ✅ Bitta yoki ko\'p raqamlarga SMS yuborish\n' +
                '- ✅ **CHEKSIZ** tillar qabul qilinadi (har qanday til!)\n' +
                '- ✅ Universal SMS shablon\n' +
                '- ✅ Avtomatik token boshqaruvi\n' +
                '- ✅ Balans tekshirish\n' +
                '- ✅ Swagger interaktiv dokumentatsiya\n\n' +
                '## Tillar Qabul Qilish\n' +
                'API **har qanday til nomini** qabul qiladi va avtomatik shablon yaratadi!\n\n' +
                '**Misol tillar:**\n' +
                '- rus, ingliz, turk, koreys, nemis\n' +
                '- fransuz, xitoy, ispan, arab, yapon\n' +
                '- qozoq, italyan, portugal, hindi, yunon\n' +
                '- **va boshqa har qanday til!**\n\n' +
                '**Format:** Har qanday til nomi avtomatik "[TIL NOMI] TILI" formatiga o\'tkaziladi.\n\n' +
                '**Namuna:**\n' +
                '- language: "italyan" → "ITALYAN TILI KURSLARI!"\n' +
                '- language: "norveg" → "NORVEG TILI KURSLARI!"\n\n' +
                '## Authentication\n' +
                'Bu API Eskiz.uz bilan backend tomonida integratsiya qilingan.\n' +
                'Foydalanuvchilar API\'ga to\'g\'ridan-to\'g\'ri kirishlari mumkin.',
            contact: {
                name: 'API Support',
                email: 'support@example.com'
            },
            license: {
                name: 'ISC',
                url: 'https://opensource.org/licenses/ISC'
            }
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 8080}`,
                description: 'Development server'
            },
            {
                url: 'https://your-production-url.com',
                description: 'Production server'
            }
        ],
        tags: [
            {
                name: 'SMS',
                description: 'SMS yuborish operatsiyalari'
            },
            {
                name: 'Languages',
                description: 'Til va shablon operatsiyalari'
            },
            {
                name: 'Balance',
                description: 'Balans va hisob operatsiyalari'
            },
            {
                name: 'Health',
                description: 'Server holati tekshiruvi'
            }
        ],
        components: {
            schemas: {
                SendSMSRequest: {
                    type: 'object',
                    required: ['phone', 'language'],
                    properties: {
                        phone: {
                            type: 'string',
                            description: 'Telefon raqam 998XXXXXXXXX formatida',
                            example: '998901234567',
                            pattern: '^998\\d{9}$'
                        },
                        language: {
                            type: 'string',
                            description: 'Har qanday til nomi (masalan: rus, ingliz, italyan, yunon va h.k.)',
                            example: 'rus',
                            minLength: 1
                        }
                    }
                },
                SendBatchSMSRequest: {
                    type: 'object',
                    required: ['phones', 'language'],
                    properties: {
                        phones: {
                            type: 'array',
                            description: 'Telefon raqamlar ro\'yxati',
                            items: {
                                type: 'string',
                                pattern: '^998\\d{9}$'
                            },
                            example: ['998901234567', '998912345678', '998923456789']
                        },
                        language: {
                            type: 'string',
                            description: 'Har qanday til nomi (masalan: rus, ingliz, italyan, yunon va h.k.)',
                            example: 'rus',
                            minLength: 1
                        }
                    }
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            example: 'SMS muvaffaqiyatli yuborildi'
                        },
                        data: {
                            type: 'object'
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        error: {
                            type: 'string',
                            example: 'Error message'
                        },
                        message: {
                            type: 'string',
                            example: 'Xatolik yuz berdi'
                        }
                    }
                },
                Language: {
                    type: 'object',
                    properties: {
                        code: {
                            type: 'string',
                            example: 'rus'
                        },
                        name: {
                            type: 'string',
                            example: 'RUS TILI'
                        }
                    }
                },
                Template: {
                    type: 'object',
                    properties: {
                        language: {
                            type: 'string',
                            example: 'RUS TILI'
                        },
                        code: {
                            type: 'string',
                            example: 'rus'
                        },
                        template: {
                            type: 'string',
                            example: 'RUS TILI KURSLARI!\n\nRUS TILIni mukammal o\'rganing!...'
                        }
                    }
                }
            },
            responses: {
                BadRequest: {
                    description: 'Noto\'g\'ri so\'rov',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                NotFound: {
                    description: 'Topilmadi',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                ServerError: {
                    description: 'Server xatosi',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js', './index.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
