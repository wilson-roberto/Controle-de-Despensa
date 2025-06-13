module.exports = {
    // Configurações do servidor
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost'
    },

    // Configurações do banco de dados
    database: {
        url: process.env.DATABASE_URL,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true
        }
    },

    // Configurações de segurança
    security: {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true
        },
        rateLimit: {
            windowMs: 15 * 60 * 1000, // 15 minutos
            max: 100 // limite de 100 requisições por windowMs
        }
    },

    // Configurações de logging
    logging: {
        level: 'info',
        filename: 'logs/production.log',
        maxSize: '10m',
        maxFiles: '7d'
    },

    // Configurações de cache
    cache: {
        enabled: true,
        ttl: 3600 // 1 hora em segundos
    }
}; 