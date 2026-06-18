function getCategoryId() {
    return new URLSearchParams(window.location.search).get("id");
}

async function loadCategories() {
    const table = document.getElementById("catTable");
    if (!table) return;

    try {
        const res = await API.CategoriesAPI.getAll();
        table.innerHTML = "";

        res.data.forEach(cat => {
            table.innerHTML += `
                <tr>
                    <td>${cat.name}</td>
                    <td>${cat.description || "-"}</td>
                    <td>${cat.isActive ? "Actif" : "Archive"}</td>
                    <td class="actions">
                        <a class="btn btn-info" href="category-details.html?id=${cat._id}">Voir</a>
                        <a class="btn btn-warning" href="category-edit.html?id=${cat._id}">Modifier</a>
                        <button class="btn btn-danger" onclick="archiveCategory('${cat._id}')">Archiver</button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        notify(err.message, "error");
    }
}

async function createCategory(e) {
    e.preventDefault();

    const data = {
        name: document.getElementById("name").value.trim(),
        description: document.getElementById("description").value.trim()
    };

    try {
        await API.CategoriesAPI.create(data);
        notify("Categorie creee avec succes", "success");
        window.location.href = "categories.html";
    } catch (err) {
        notify(err.message, "error");
    }
}

async function updateCategory(e, id) {
    e.preventDefault();

    const data = {
        name: document.getElementById("name").value.trim(),
        description: document.getElementById("description").value.trim()
    };

    try {
        await API.CategoriesAPI.update(id, data);
        notify("Categorie mise a jour", "success");
        window.location.href = "categories.html";
    } catch (err) {
        notify(err.message, "error");
    }
}

async function archiveCategory(id) {
    if (!confirm("Voulez-vous archiver cette categorie ?")) return;

    try {
        await API.CategoriesAPI.archive(id);
        notify("Categorie archivee", "success");
        loadCategories();
    } catch (err) {
        notify(err.message, "error");
    }
}

async function loadCategoryDetails(id) {
    try {
        const res = await API.CategoriesAPI.getById(id);
        const category = res.data;

        document.getElementById("name").textContent = category.name;
        document.getElementById("description").textContent = category.description || "-";
        document.getElementById("status").textContent = category.isActive ? "Actif" : "Archive";
    } catch (err) {
        notify(err.message, "error");
    }
}

async function loadCategoryForEdit(id) {
    try {
        const res = await API.CategoriesAPI.getById(id);
        const category = res.data;

        document.getElementById("name").value = category.name || "";
        document.getElementById("description").value = category.description || "";
    } catch (err) {
        notify(err.message, "error");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    requireAuth();

    const id = getCategoryId();
    const createForm = document.getElementById("createForm");
    const editForm = document.getElementById("editForm");

    if (document.getElementById("catTable")) loadCategories();
    if (createForm) createForm.addEventListener("submit", createCategory);
    if (id && document.querySelector(".details-card")) loadCategoryDetails(id);
    if (id && editForm) {
        loadCategoryForEdit(id);
        editForm.addEventListener("submit", (e) => updateCategory(e, id));
    }
});
