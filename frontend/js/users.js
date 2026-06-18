async function loadUsers() {
    try {
        const result = await API.UsersAPI.getAll();
        const tbody = document.getElementById("usersTableBody");
        if (!tbody) return;

        tbody.innerHTML = "";

        result.data.forEach(user => {
            const statusActionLabel = user.isActive ? "Desactiver" : "Activer";
            const statusActionClass = user.isActive ? "btn-danger" : "btn-success";

            tbody.innerHTML += `
                <tr>
                    <td>${user.firstName || ""} ${user.lastName || ""}</td>
                    <td>${user.email || "-"}</td>
                    <td>${user.role || "-"}</td>
                    <td>${user.isActive ? "Actif" : "Inactif"}</td>
                    <td class="actions">
                        <a class="btn btn-info" href="user-details.html?id=${user._id}">Voir</a>
                        <a class="btn btn-warning" href="user-edit.html?id=${user._id}">Modifier</a>
                        <button class="btn ${statusActionClass}" onclick="toggleUserStatus('${user._id}', ${!user.isActive})">
                            ${statusActionLabel}
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        notify(err.message, "error");
    }
}

async function toggleUserStatus(id, isActive) {
    const label = isActive ? "activer" : "desactiver";

    if (!confirm(`Voulez-vous ${label} cet utilisateur ?`)) return;

    try {
        await API.UsersAPI.update(id, { isActive });
        notify(`Utilisateur ${isActive ? "active" : "desactive"}`, "success");
        loadUsers();
    } catch (err) {
        notify(err.message, "error");
    }
}

async function loadUserDetails(id) {
    try {
        const res = await API.UsersAPI.getById(id);
        const user = res.data;

        document.getElementById("fullName").textContent =
            `${user.firstName || ""} ${user.lastName || ""}`.trim();
        document.getElementById("email").textContent = user.email || "-";
        document.getElementById("phone").textContent = user.phone || "-";
        document.getElementById("role").textContent = user.role || "-";
        document.getElementById("status").textContent = user.isActive ? "Actif" : "Inactif";
    } catch (err) {
        notify(err.message, "error");
    }
}

async function loadUserForEdit(id) {
    try {
        const res = await API.UsersAPI.getById(id);
        const user = res.data;

        document.getElementById("firstName").value = user.firstName || "";
        document.getElementById("lastName").value = user.lastName || "";
        document.getElementById("email").value = user.email || "";
        document.getElementById("role").value = user.role || "member";
    } catch (err) {
        notify(err.message, "error");
    }
}

async function updateUser(e, id) {
    e.preventDefault();

    const data = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        role: document.getElementById("role").value
    };

    try {
        await API.UsersAPI.update(id, data);
        notify("Utilisateur mis a jour", "success");
        window.location.href = "users.html";
    } catch (err) {
        notify(err.message, "error");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    requireAuth();
    requireRole("librarian");

    const id = new URLSearchParams(window.location.search).get("id");
    const editForm = document.getElementById("editUserForm");

    if (document.getElementById("usersTableBody")) loadUsers();
    if (id && document.getElementById("fullName")) loadUserDetails(id);
    if (id && editForm) {
        loadUserForEdit(id);
        editForm.addEventListener("submit", (e) => updateUser(e, id));
    }
});
