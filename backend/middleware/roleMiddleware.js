const authorize = (...roles) => {
    return (req, res, next) => {

        // Vérifier si l'utilisateur est authentifié
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur non authentifié."
            });
        }

        // Vérifier si le rôle est autorisé
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Accès refusé. Permissions insuffisantes."
            });
        }

        next();
    };
};

module.exports = authorize;