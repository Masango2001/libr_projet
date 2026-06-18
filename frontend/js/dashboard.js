// ================= TOKEN =================
function getToken() {
    return localStorage.getItem("token");
}

function getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
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
        const user = getUser();
        const isLibrarian = user?.role === "librarian";

        const headers = {
            Authorization: `Bearer ${getToken()}`
        };

        const fetchCount = async (endpoint) => {
            const res = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, { headers });
            const data = await res.json();
            return data.count || 0;
        };

        const [books, categories, borrows, reservations, penalties] =
            await Promise.all([
                fetchCount("/books"),
                fetchCount("/categories"),
                fetchCount(isLibrarian ? "/borrows" : "/borrows/my"),
                fetchCount(isLibrarian ? "/reservations" : "/reservations/my"),
                fetchCount(isLibrarian ? "/penalties" : "/penalties/my")
            ]);

        if (isLibrarian && document.getElementById("usersCount")) {
            document.getElementById("usersCount").textContent = await fetchCount("/users");
        }

        document.getElementById("booksCount").textContent = books;
        document.getElementById("categoriesCount").textContent = categories;
        document.getElementById("borrowsCount").textContent = borrows;
        document.getElementById("reservationsCount").textContent = reservations;
        document.getElementById("penaltiesCount").textContent = penalties;

    } catch (err) {
        console.error(err);
        alert("Erreur chargement dashboard");
    }
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", loadDashboard);
