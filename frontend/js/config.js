// ================= CONFIG GLOBAL =================

const CONFIG = {

    API_BASE_URL: "http://localhost:3000/api",

    STORAGE_KEYS: {
        TOKEN: "token",
        USER: "user"
    },

    ENDPOINTS: {
        AUTH: "/auth",
        USERS: "/users",
        AUTHORS: "/authors",
        CATEGORIES: "/categories",
        BOOKS: "/books",
        BORROWS: "/borrows",
        RESERVATIONS: "/reservations",
        PENALTIES: "/penalties",
        SUGGESTIONS: "/suggestions"
    },

    SETTINGS: {
        DEFAULT_LOAN_DAYS: 14,
        PENALTY_PER_DAY: 500
    }
};

window.CONFIG = CONFIG;
