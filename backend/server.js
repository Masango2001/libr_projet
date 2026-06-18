const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

// ✅ FIX IMPORTANT
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// DB
const connectDB = require("./config/db");

// Swagger
const swaggerDocs = require("./swagger/swagger");

// Middlewares
const notFound = require("./middleware/notFoundMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const borrowRoutes = require("./routes/borrowRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const penaltyRoutes = require("./routes/penaltyRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");
const authorRoutes = require("./routes/authorRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// Connexion MongoDB
connectDB();

const app = express();

// ================= GLOBAL MIDDLEWARES =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ],
    credentials: true
}));

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
    res.json({
        message: "Library API is running 🚀",
        status: "OK"
    });
});

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/borrows", borrowRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/penalties", penaltyRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/categories", categoryRoutes);

// ================= SWAGGER =================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ================= 404 MIDDLEWARE =================
app.use(notFound);

// ================= ERROR HANDLER =================
app.use(errorHandler);

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
});
