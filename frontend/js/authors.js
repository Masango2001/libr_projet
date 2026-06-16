const API_URL = "http://localhost:5000/api/authors";

function getToken() {
    return localStorage.getItem("token");
}

/* ================= GET AUTHORS ================= */
async function getAuthors() {
    const res = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return await res.json();
}

/* ================= CREATE ================= */
async function createAuthor(data) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
    });

    return await res.json();
}

/* ================= UPDATE ================= */
async function updateAuthor(id, data) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
    });

    return await res.json();
}

/* ================= ARCHIVE ================= */
async function archiveAuthor(id) {
    const res = await fetch(`${API_URL}/${id}/archive`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return await res.json();
}

/* ================= GET BY ID ================= */
async function getAuthorById(id) {
    const res = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    const data = await res.json();
    return data.data.find(a => a._id === id);
}