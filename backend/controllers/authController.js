const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sanitizeUser = (user) => {
    const safeUser = user.toObject ? user.toObject() : { ...user };
    delete safeUser.password;
    return safeUser;
};

const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "firstName, lastName, email et password sont obligatoires."
            });
        }

        const exist = await User.findOne({ email });

        if (exist) {
            return res.status(400).json({
                success: false,
                message: "Email deja utilise."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            data: sanitizeUser(user)
        });

    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email et password sont obligatoires."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email incorrect."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Mot de passe incorrect."
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Compte desactive."
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            token,
            user: sanitizeUser(user)
        });

    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res) => {
    res.json({
        success: true,
        data: req.user
    });
};

module.exports = { register, login, getProfile };
