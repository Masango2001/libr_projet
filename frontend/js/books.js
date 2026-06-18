/* =========================
   LOAD BOOKS
========================= */
async function loadBooks() {

    try {

        const res = await API.BooksAPI.getAll();

        const tbody = document.getElementById("booksTableBody");
        if (!tbody) return;

        tbody.innerHTML = "";

        res.data.forEach(book => {
            const actions = [
                `<a href="book-details.html?id=${book._id}">Voir</a>`
            ];

            if (isLibrarian()) {
                actions.push(`<a href="book-edit.html?id=${book._id}">Modifier</a>`);
                actions.push(`<button onclick="archiveBook('${book._id}')">Archiver</button>`);
            }

            tbody.innerHTML += `
                <tr>
                    <td>${book.title}</td>
                    <td>${book.isbn}</td>
                    <td>${book.totalCopies}</td>
                    <td>${book.availableCopies}</td>
                    <td>
                        ${book.isArchived ? "Archivé" : "Disponible"}
                    </td>
                    <td>
                        ${actions.join("")}
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        notify(err.message, "error");
    }
}

async function loadBookOptions() {
    const authorSelect = document.getElementById("author");
    const categorySelect = document.getElementById("category");

    if (!authorSelect && !categorySelect) return;

    try {
        const [authors, categories] = await Promise.all([
            API.AuthorsAPI.getAll(),
            API.CategoriesAPI.getAll()
        ]);

        if (authorSelect) {
            authorSelect.innerHTML = '<option value="">Choisir un auteur</option>';
            authors.data
                .filter(author => author.isActive !== false)
                .forEach(author => {
                    authorSelect.innerHTML += `
                        <option value="${author._id}">
                            ${(author.firstName || "")} ${(author.lastName || "")}
                        </option>
                    `;
                });
        }

        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">Choisir une categorie</option>';
            categories.data
                .filter(category => category.isActive !== false)
                .forEach(category => {
                    categorySelect.innerHTML += `
                        <option value="${category._id}">
                            ${category.name}
                        </option>
                    `;
                });
        }
    } catch (err) {
        notify(err.message, "error");
    }
}

/* =========================
   CREATE BOOK
========================= */
async function createBook(e) {

    e.preventDefault();

    const data = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        category: document.getElementById("category").value,
        isbn: document.getElementById("isbn").value,
        totalCopies: Number(document.getElementById("totalCopies").value),
        availableCopies: Number(document.getElementById("availableCopies").value)
    };

    try {

        await API.BooksAPI.create(data);

        notify("Livre créé avec succès", "success");

        window.location.href = "books.html";

    } catch (err) {
        notify(err.message, "error");
    }
}

/* =========================
   LOAD BOOK DETAILS
========================= */
async function loadBookDetails(id) {

    try {

        const res = await API.BooksAPI.getById(id);
        const book = res.data;

        document.getElementById("title").textContent = book.title;
        document.getElementById("isbn").textContent = book.isbn;
        document.getElementById("totalCopies").textContent = book.totalCopies;
        document.getElementById("availableCopies").textContent = book.availableCopies;

        document.getElementById("status").textContent =
            book.isArchived ? "Archivé" : "Disponible";

    } catch (err) {
        notify(err.message, "error");
    }
}

/* =========================
   LOAD BOOK FOR EDIT
========================= */
async function loadBookForEdit(id) {

    try {

        const res = await API.BooksAPI.getById(id);
        const book = res.data;

        document.getElementById("title").value = book.title;
        document.getElementById("author").value = book.author;
        document.getElementById("category").value = book.category;
        document.getElementById("isbn").value = book.isbn;
        document.getElementById("totalCopies").value = book.totalCopies;
        document.getElementById("availableCopies").value = book.availableCopies;

    } catch (err) {
        notify(err.message, "error");
    }
}

/* =========================
   UPDATE BOOK
========================= */
async function updateBook(e, id) {

    e.preventDefault();

    const data = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        category: document.getElementById("category").value,
        isbn: document.getElementById("isbn").value,
        totalCopies: Number(document.getElementById("totalCopies").value),
        availableCopies: Number(document.getElementById("availableCopies").value)
    };

    try {

        await API.BooksAPI.update(id, data);

        notify("Livre mis à jour", "success");

        window.location.href = "books.html";

    } catch (err) {
        notify(err.message, "error");
    }
}

/* =========================
   ARCHIVE BOOK
========================= */
async function archiveBook(id) {
    if (!isLibrarian()) return;

    try {

        await API.BooksAPI.archive(id);

        notify("Livre archivé", "success");

        loadBooks();

    } catch (err) {
        notify(err.message, "error");
    }
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", async () => {
    requireAuth();

    if (document.getElementById("booksTableBody")) {
        loadBooks();
    }

    await loadBookOptions();

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const createForm = document.getElementById("createBookForm");
    const editForm = document.getElementById("editBookForm");

    if (createForm) {
        requireRole("librarian");
        createForm.addEventListener("submit", createBook);
    }

    if (id && document.querySelector(".details-card")) {
        loadBookDetails(id);
    }

    if (id && editForm) {
        requireRole("librarian");
        loadBookForEdit(id);
        editForm.addEventListener("submit", (e) => updateBook(e, id));
    }
});
