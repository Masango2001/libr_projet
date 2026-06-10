const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");

const seedUser = async () => {
    try {
        await connectDB();

        // 🔐 HASH du mot de passe
        const hashedPassword = await bcrypt.hash("62889201", 10);

        await User.create({
            firstName: "Masango",
            lastName: "Alain Blaise",
            email: "masangoalainblaise8@gmail.com",
            password: hashedPassword,
            role: "librarian"
        });

        console.log("✅ Admin créé avec succès");
        process.exit();
    } catch (error) {
        console.log("❌ Erreur seed :", error);
        process.exit(1);
    }
};

seedUser();