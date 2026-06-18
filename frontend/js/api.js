// ================= JWT =================

function getToken() {
    return localStorage.getItem(
        CONFIG.STORAGE_KEYS.TOKEN
    );
}

// ================= HEADERS =================

function getHeaders(json = true) {

    const headers = {
        Authorization: `Bearer ${getToken()}`
    };

    if (json) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
}

// ================= RESPONSE =================

async function handleResponse(res) {

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {

        if (res.status === 401) {

            localStorage.removeItem(
                CONFIG.STORAGE_KEYS.TOKEN
            );

            localStorage.removeItem(
                CONFIG.STORAGE_KEYS.USER
            );

            window.location.href = "login.html";
        }

        throw new Error(
            data.message || "Erreur API"
        );
    }

    return data;
}

// ================= AUTH =================

const AuthAPI = {

    login: async (data) => {

        const res = await fetch(
            CONFIG.API_BASE_URL +
            CONFIG.ENDPOINTS.AUTH +
            "/login",
            {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data)
            }
        );

        return handleResponse(res);
    },

    register: async (data) => {

        const res = await fetch(
            CONFIG.API_BASE_URL +
            CONFIG.ENDPOINTS.AUTH +
            "/register",
            {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data)
            }
        );

        return handleResponse(res);
    }
};

// ================= USERS =================

const UsersAPI = {

    getAll: async () => {
        const res = await fetch(
            CONFIG.API_BASE_URL +
            CONFIG.ENDPOINTS.USERS,
            {
                headers: getHeaders(false)
            }
        );

        return handleResponse(res);
    },

    getById: async (id) => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.USERS}/${id}`,
            {
                headers: getHeaders(false)
            }
        );

        return handleResponse(res);
    },

    update: async (id, data) => {

        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.USERS}/${id}`,
            {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(data)
            }
        );

        return handleResponse(res);
    },

    deactivate: async (id) => {

        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.USERS}/${id}/deactivate`,
            {
                method: "PATCH",
                headers: getHeaders()
            }
        );

        return handleResponse(res);
    }
};

// ================= AUTHORS =================

const AuthorsAPI = {

    getAll: async () => {
        const res = await fetch(
            CONFIG.API_BASE_URL +
            CONFIG.ENDPOINTS.AUTHORS,
            {
                headers: getHeaders(false)
            }
        );

        return handleResponse(res);
    },

    getById: async (id) => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.AUTHORS}/${id}`,
            {
                headers: getHeaders(false)
            }
        );

        return handleResponse(res);
    },

    create: async (data) => {
        const res = await fetch(
            CONFIG.API_BASE_URL +
            CONFIG.ENDPOINTS.AUTHORS,
            {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data)
            }
        );

        return handleResponse(res);
    },

    update: async (id, data) => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.AUTHORS}/${id}`,
            {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(data)
            }
        );

        return handleResponse(res);
    },

    archive: async (id) => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.AUTHORS}/${id}/archive`,
            {
                method: "PATCH",
                headers: getHeaders()
            }
        );

        return handleResponse(res);
    }
};

// ================= CATEGORIES =================

const CategoriesAPI = {

    getAll: async () => {
        const res = await fetch(
            CONFIG.API_BASE_URL +
            CONFIG.ENDPOINTS.CATEGORIES,
            {
                headers: getHeaders(false)
            }
        );

        return handleResponse(res);
    },

    getById: async (id) => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.CATEGORIES}/${id}`,
            {
                headers: getHeaders(false)
            }
        );

        return handleResponse(res);
    },

    create: async (data) => {
        const res = await fetch(
            CONFIG.API_BASE_URL +
            CONFIG.ENDPOINTS.CATEGORIES,
            {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data)
            }
        );

        return handleResponse(res);
    },

    update: async (id, data) => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.CATEGORIES}/${id}`,
            {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(data)
            }
        );

        return handleResponse(res);
    },

    archive: async (id) => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.CATEGORIES}/${id}/archive`,
            {
                method: "PATCH",
                headers: getHeaders()
            }
        );

        return handleResponse(res);
    }
};

// ================= BOOKS =================

const BooksAPI = {

    getAll: async () => {
        const res = await fetch(
            CONFIG.API_BASE_URL +
            CONFIG.ENDPOINTS.BOOKS,
            {
                headers: getHeaders(false)
            }
        );

        return handleResponse(res);
    },

    getById: async (id) => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.BOOKS}/${id}`,
            {
                headers: getHeaders(false)
            }
        );

        return handleResponse(res);
    },

    create: async (data) => {
        const res = await fetch(
            CONFIG.API_BASE_URL +
            CONFIG.ENDPOINTS.BOOKS,
            {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data)
            }
        );

        return handleResponse(res);
    },

    update: async (id, data) => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.BOOKS}/${id}`,
            {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(data)
            }
        );

        return handleResponse(res);
    },

    archive: async (id) => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.BOOKS}/${id}/archive`,
            {
                method: "PATCH",
                headers: getHeaders()
            }
        );

        return handleResponse(res);
    }
};

// ================= BORROWS =================

const BorrowsAPI = {

    create: async (data) => {
        const res = await fetch(
            CONFIG.API_BASE_URL +
            CONFIG.ENDPOINTS.BORROWS,
            {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data)
            }
        );

        return handleResponse(res);
    },

    getMy: async () => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.BORROWS}/my`,
            {
                headers: getHeaders(false)
            }
        );

        return handleResponse(res);
    },

    getAll: async () => {
        const res = await fetch(
            CONFIG.API_BASE_URL +
            CONFIG.ENDPOINTS.BORROWS,
            {
                headers: getHeaders(false)
            }
        );

        return handleResponse(res);
    },

    returnBook: async (id) => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.BORROWS}/${id}/return`,
            {
                method: "PATCH",
                headers: getHeaders()
            }
        );

        return handleResponse(res);
    }
};

// ================= RESERVATIONS =================

const ReservationsAPI = {

    create: async (data) => {
        const res = await fetch(
            CONFIG.API_BASE_URL +
            CONFIG.ENDPOINTS.RESERVATIONS,
            {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data)
            }
        );

        return handleResponse(res);
    },

    getMy: async () => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.RESERVATIONS}/my`,
            {
                headers: getHeaders(false)
            }
        );

        return handleResponse(res);
    },

    getAll: async () => {
        const res = await fetch(
            CONFIG.API_BASE_URL +
            CONFIG.ENDPOINTS.RESERVATIONS,
            {
                headers: getHeaders(false)
            }
        );

        return handleResponse(res);
    },

    updateStatus: async (id, status) => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.RESERVATIONS}/${id}/status`,
            {
                method: "PATCH",
                headers: getHeaders(),
                body: JSON.stringify({ status })
            }
        );

        return handleResponse(res);
    }
};

// ================= PENALTIES =================

const PenaltiesAPI = {

    getMy: async () => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.PENALTIES}/my`,
            {
                headers: getHeaders(false)
            }
        );

        return handleResponse(res);
    },

    getAll: async () => {
        const res = await fetch(
            CONFIG.API_BASE_URL +
            CONFIG.ENDPOINTS.PENALTIES,
            {
                headers: getHeaders(false)
            }
        );

        return handleResponse(res);
    },

    updateStatus: async (id, status) => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.PENALTIES}/${id}`,
            {
                method: "PATCH",
                headers: getHeaders(),
                body: JSON.stringify({ status })
            }
        );

        return handleResponse(res);
    }
};

// ================= SUGGESTIONS =================

const SuggestionsAPI = {

    create: async (data) => {
        const res = await fetch(
            CONFIG.API_BASE_URL +
            CONFIG.ENDPOINTS.SUGGESTIONS,
            {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data)
            }
        );

        return handleResponse(res);
    },

    getMy: async () => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.SUGGESTIONS}/my`,
            {
                headers: getHeaders(false)
            }
        );

        return handleResponse(res);
    },

    getAll: async () => {
        const res = await fetch(
            CONFIG.API_BASE_URL +
            CONFIG.ENDPOINTS.SUGGESTIONS,
            {
                headers: getHeaders(false)
            }
        );

        return handleResponse(res);
    },

    updateStatus: async (id, status) => {
        const res = await fetch(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.SUGGESTIONS}/${id}/status`,
            {
                method: "PATCH",
                headers: getHeaders(),
                body: JSON.stringify({ status })
            }
        );

        return handleResponse(res);
    }
};

// ================= GLOBAL EXPORT =================

window.API = {
    AuthAPI,
    UsersAPI,
    AuthorsAPI,
    CategoriesAPI,
    BooksAPI,
    BorrowsAPI,
    ReservationsAPI,
    PenaltiesAPI,
    SuggestionsAPI
};
