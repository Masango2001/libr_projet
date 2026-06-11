const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token;

        // Vérifier si le token existe dans Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // Aucun token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Accès refusé. Veuillez vous connecter."
            });
        }

        // Vérifier et décoder le token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Chercher l'utilisateur
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur introuvable."
            });
        }

        // Vérifier si le compte est actif
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Votre compte est désactivé."
            });
        }

        // Stocker l'utilisateur connecté dans req
        req.user = user;

        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Session expirée. Veuillez vous reconnecter."
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Token invalide."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Erreur serveur lors de l'authentification."
        });
    }
};

module.exports = protect;