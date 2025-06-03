const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "CRM API",
      version: "1.0.0",
      description: "API Docs for CRM Application",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files with JSDoc comments
};

const specs = swaggerJsdoc(options);
module.exports = specs;
