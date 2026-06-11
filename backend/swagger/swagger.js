const swaggerJsDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "Système complet de gestion de bibliothèque numérique avec authentification JWT, gestion des utilisateurs, livres, auteurs, catégories, emprunts, réservations, pénalités et suggestions"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: ["./routes/*.js"] // ✔ IMPORTANT
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;