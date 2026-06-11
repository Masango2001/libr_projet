const errorHandler = (err, req, res, next) => {

    // Si le status code n'existe pas, on met 500
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Erreurs MongoDB (ex: mauvais ObjectId)
    if (err.name === "CastError") {
        statusCode = 400;
        err.message = "Ressource introuvable (ID invalide)";
    }

    // Erreur duplication (unique)
    if (err.code === 11000) {
        statusCode = 400;
        err.message = "Données déjà existantes (doublon détecté)";
    }

    // Erreur validation Mongoose
    if (err.name === "ValidationError") {
        statusCode = 400;

        const messages = Object.values(err.errors).map(
            (val) => val.message
        );

        err.message = messages.join(", ");
    }

    res.status(statusCode).json({
        success: false,
        message: err.message || "Erreur serveur",
        stack:
            process.env.NODE_ENV === "production"
                ? null
                : err.stack
    });
};

module.exports = errorHandler;