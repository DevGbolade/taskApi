import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Management API',
            version: '1.0.0',
            description: 'API documentation for Task Management System',
        },
        servers: [{ url: 'http://localhost:5070' }],
    },
    apis: ['./src/routes/*.ts'], 
};
export const swaggerSpec = swaggerJsdoc(options);
export const serveSwagger = swaggerUi.serve;
export const setupSwagger = swaggerUi.setup(swaggerSpec);
