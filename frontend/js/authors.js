function getQueryId() {
    return new URLSearchParams(window.location.search).get("id");
}

function authorName(author) {
    return `${author.firstName || ""} ${author.lastName || ""}`.trim() || "-";
}

async function loadAuthors() {
    const table = document.getElementById("authorsTable");
    if (!table) return;

    try {
        const res = await API.AuthorsAPI.getAll();
        table.innerHTML = "";

        res.data.forEach(author => {
            table.innerHTML += `
                <tr>
                    <td>${authorName(author)}</td>
                    <td>${author.nationality || "-"}</td>
                    <td>${author.isActive ? "Actif" : "Archive"}</td>
                    <td class="actions">
                        <a class="btn btn-info" href="author-details.html?id=${author._id}">Voir</a>
                        <a class="btn btn-warning" href="author-edit.html?id=${author._id}">Modifier</a>
                        <button class="btn btn-danger" onclick="archiveAuthor('${author._id}')">Archiver</button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        notify(err.message, "error");
    }
}

async function archiveAuthor(id) {
    if (!confirm("Voulez-vous archiver cet auteur ?")) return;

    try {
        await API.AuthorsAPI.archive(id);
        notify("Auteur archive avec succes", "success");
        loadAuthors();
    } catch (err) {
        notify(err.message, "error");
    }
}

async function createAuthor(e) {
    e.preventDefault();

    const data = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        nationality: document.getElementById("nationality").value.trim(),
        biography: document.getElementById("biography").value.trim()
    };

    try {
        await API.AuthorsAPI.create(data);
        notify("Auteur cree avec succes", "success");
        window.location.href = "authors.html";
    } catch (err) {
        notify(err.message, "error");
    }
}

async function updateAuthor(e, id) {
    e.preventDefault();

    const data = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        nationality: document.getElementById("nationality").value.trim(),
        biography: document.getElementById("biography").value.trim()
    };

    try {
        await API.AuthorsAPI.update(id, data);
        notify("Auteur mis a jour", "success");
        window.location.href = "authors.html";
    } catch (err) {
        notify(err.message, "error");
    }
}

async function loadAuthorDetails(id) {
    try {
        const res = await API.AuthorsAPI.getById(id);
        const author = res.data;

        document.getElementById("name").textContent = authorName(author);
        document.getElementById("nationality").textContent = author.nationality || "-";
        document.getElementById("biography").textContent = author.biography || "-";
        document.getElementById("status").textContent = author.isActive ? "Actif" : "Archive";
    } catch (err) {
        notify(err.message, "error");
    }
}

async function loadAuthorForEdit(id) {
    try {
        const res = await API.AuthorsAPI.getById(id);
        const author = res.data;

        document.getElementById("firstName").value = author.firstName || "";
        document.getElementById("lastName").value = author.lastName || "";
        document.getElementById("nationality").value = author.nationality || "";
        document.getElementById("biography").value = author.biography || "";
    } catch (err) {
        notify(err.message, "error");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    requireAuth();

    const id = getQueryId();
    const createForm = document.getElementById("createAuthorForm");
    const editForm = document.getElementById("editAuthorForm");

    if (document.getElementById("authorsTable")) loadAuthors();
    if (createForm) createForm.addEventListener("submit", createAuthor);
    if (id && document.getElementById("name")) loadAuthorDetails(id);
    if (id && editForm) {
        loadAuthorForEdit(id);
        editForm.addEventListener("submit", (e) => updateAuthor(e, id));
    }
});
