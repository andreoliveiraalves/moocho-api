import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Mooch API',
            version: '1.0.0',
            description: 'Mooch API documentation for authentication and movie features',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            },
        ],
    },
    apis: ['./dist/routes/*.js'], // adjust if your routes live elsewhere
}

export const swaggerSpec = swaggerJsdoc(swaggerOptions)
export { swaggerUi }