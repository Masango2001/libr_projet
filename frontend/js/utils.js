
/* =========================================================
   🔐 AUTHENTIFICATION (TOKEN + USER)
========================================================= */

function getToken() {
    return localStorage.getItem("token");
}

function getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

function setAuth(user, token) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
}

function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

/* =========================================================
   🛡️ PROTECTION DES PAGES
========================================================= */

function requireAuth() {
    if (!getToken()) {
        window.location.href = "login.html";
    }
}

/* Vérifier rôle spécifique */
function requireRole(role) {
    const user = getUser();

    if (!user || user.role !== role) {
        window.location.href = "unauthorized.html";
    }
}

/* =========================================================
   👤 GESTION DES RÔLES
========================================================= */

function isLoggedIn() {
    return !!getToken();
}

function isLibrarian() {
    const user = getUser();
    return user && user.role === "librarian";
}

function isMember() {
    const user = getUser();
    return user && user.role === "member";
}

function applyRoleVisibility() {
    const user = getUser();
    const role = user?.role;

    document.querySelectorAll("[data-roles]").forEach(el => {
        const roles = el.dataset.roles
            .split(",")
            .map(item => item.trim());

        if (!role || !roles.includes(role)) {
            el.remove();
        }
    });
}

/* =========================================================
   🎨 UI HELPERS
========================================================= */

/* Afficher message dans un élément */
function showMessage(id, message, color = "red") {
    const el = document.getElementById(id);
    if (!el) return;

    el.textContent = message;
    el.style.color = color;
}

/* Loader simple */
function showLoader(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "block";
}

function hideLoader(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
}

/* =========================================================
   📅 FORMATAGE DES DATES
========================================================= */

function formatDate(date) {
    if (!date) return "";

    return new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

/* =========================================================
   ⚠️ VALIDATIONS SIMPLES
========================================================= */

function isEmpty(value) {
    return !value || value.trim() === "";
}

function isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* =========================================================
   💾 SAFE JSON
========================================================= */

function safeJSONParse(data) {
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
}

/* =========================================================
   🔔 NOTIFICATIONS SIMPLES
========================================================= */

function notify(message, type = "success") {
    const div = document.createElement("div");

    div.textContent = message;
    div.style.position = "fixed";
    div.style.top = "20px";
    div.style.right = "20px";
    div.style.padding = "10px 15px";
    div.style.borderRadius = "5px";
    div.style.color = "white";
    div.style.zIndex = "9999";

    div.style.backgroundColor =
        type === "success" ? "green" :
        type === "error" ? "red" :
        type === "warning" ? "orange" : "blue";

    document.body.appendChild(div);

    setTimeout(() => {
        div.remove();
    }, 3000);
}

/* =========================================================
   SCROLL CONTROLS
========================================================= */

function createScrollControls() {
    if (document.querySelector(".scroll-controls")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "scroll-controls";

    const upButton = document.createElement("button");
    upButton.type = "button";
    upButton.className = "scroll-button";
    upButton.textContent = "↑";
    upButton.title = "Monter";
    upButton.setAttribute("aria-label", "Monter");

    const downButton = document.createElement("button");
    downButton.type = "button";
    downButton.className = "scroll-button";
    downButton.textContent = "↓";
    downButton.title = "Descendre";
    downButton.setAttribute("aria-label", "Descendre");

    upButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    downButton.addEventListener("click", () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth"
        });
    });

    wrapper.appendChild(upButton);
    wrapper.appendChild(downButton);
    document.body.appendChild(wrapper);
}

document.addEventListener("DOMContentLoaded", () => {
    applyRoleVisibility();
    createScrollControls();
});
