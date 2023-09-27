import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nische Store Api',
      version: '1.0.0',
      description: 'Documentación de la API de Nische Store',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: ['./src/docs/products/products.yaml', './src/docs/carts/carts.yaml'],
};

const specs = swaggerJsdoc(options);

export default specs;
