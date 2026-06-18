// ================= TOKEN =================
function getToken() {
    return localStorage.getItem("token");
}

// ================= LOGOUT =================
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "../auth/login.html";
}

// ================= PROTECT PAGE =================
(function protectPage() {
    if (!getToken()) {
        window.location.href = "../auth/login.html";
    }
})();

// ================= LOAD COUNTS =================
async function loadDashboard() {

    try {

        const headers = {
            Authorization: `Bearer ${getToken()}`
        };

        const [users, books, categories, borrows, reservations, penalties] =
            await Promise.all([
                fetch(`${CONFIG.API_BASE_URL}/users`, { headers }).then(r => r.json()),
                fetch(`${CONFIG.API_BASE_URL}/books`, { headers }).then(r => r.json()),
                fetch(`${CONFIG.API_BASE_URL}/categories`, { headers }).then(r => r.json()),
                fetch(`${CONFIG.API_BASE_URL}/borrows`, { headers }).then(r => r.json()),
                fetch(`${CONFIG.API_BASE_URL}/reservations`, { headers }).then(r => r.json()),
                fetch(`${CONFIG.API_BASE_URL}/penalties`, { headers }).then(r => r.json())
            ]);

        document.getElementById("usersCount").textContent = users.count || 0;
        document.getElementById("booksCount").textContent = books.count || 0;
        document.getElementById("categoriesCount").textContent = categories.count || 0;
        document.getElementById("borrowsCount").textContent = borrows.count || 0;
        document.getElementById("reservationsCount").textContent = reservations.count || 0;
        document.getElementById("penaltiesCount").textContent = penalties.count || 0;

    } catch (err) {
        console.error(err);
        alert("Erreur chargement dashboard");
    }
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", loadDashboard);
