/* ================= LIST ================= */

const BORROW_STATUS_LABELS = {
    borrowed: "En cours",
    returned: "Retourne",
    overdue: "En retard"
};

const BORROW_STATUS_CLASSES = {
    borrowed: "status-borrowed",
    returned: "status-returned",
    overdue: "status-overdue"
};

function renderBorrowStatus(status) {
    const label = BORROW_STATUS_LABELS[status] || status || "-";
    const statusClass = BORROW_STATUS_CLASSES[status] || "status-borrowed";

    return `<span class="status-badge ${statusClass}">${label}</span>`;
}

function renderBorrowActions(borrow) {
    const actions = [
        `<a href="borrow-details.html?id=${borrow._id}">Voir</a>`
    ];

    if (["borrowed", "overdue"].includes(borrow.status)) {
        actions.push(`
            <button type="button" class="btn btn-success btn-sm" onclick="returnBook('${borrow._id}', true)">
                Marquer retourne
            </button>
        `);
    }

    return `<div class="actions">${actions.join("")}</div>`;
}

async function loadBorrows() {
    const table = document.getElementById("borrowsTableBody");
    if (!table) return;

    try {

        const res = isLibrarian()
            ? await API.BorrowsAPI.getAll()
            : await API.BorrowsAPI.getMy();

        table.innerHTML = "";

        res.data.forEach(borrow => {
            table.innerHTML += `
                <tr>

                    <td>
                        ${borrow.book?.title || "-"}
                    </td>

                    <td>
                        ${borrow.user
                            ? `${borrow.user.firstName || ""} ${borrow.user.lastName || ""}`
                            : "Moi"}
                    </td>

                    <td>
                        ${formatDate(borrow.borrowDate)}
                    </td>

                    <td>
                        ${formatDate(borrow.dueDate)}
                    </td>

                    <td>
                        ${renderBorrowStatus(borrow.status)}
                    </td>

                    <td>
                        ${renderBorrowActions(borrow)}
                    </td>

                </tr>
            `;
        });

    } catch (err) {

        notify(err.message, "error");
    }
}

/* ================= CREATE ================= */

async function createBorrow(e) {

    e.preventDefault();

    const data = {

        book: document.getElementById("book").value,

        dueDate:
            document.getElementById("dueDate").value
    };

    try {

        await API.BorrowsAPI.create(data);

        notify(
            "Emprunt enregistré",
            "success"
        );

        window.location.href =
            "borrows.html";

    } catch (err) {

        notify(err.message, "error");
    }
}

/* ================= DETAILS ================= */

async function loadBorrowDetails(id) {

    try {

        const res =
            isLibrarian()
                ? await API.BorrowsAPI.getAll()
                : await API.BorrowsAPI.getMy();

        const borrow =
            res.data.find(
                b => b._id === id
            );

        if (!borrow) return;

        document.getElementById("book").textContent =
            borrow.book?.title;

        document.getElementById("borrowDate").textContent =
            formatDate(borrow.borrowDate);

        document.getElementById("dueDate").textContent =
            formatDate(borrow.dueDate);

        document.getElementById("status").innerHTML =
            renderBorrowStatus(borrow.status);

        const actions = document.getElementById("borrowActions");
        if (actions) {
            actions.innerHTML = renderBorrowActions(borrow);
        }

    } catch (err) {

        notify(err.message, "error");
    }
}

/* ================= RETURN ================= */

async function returnBook(id, stayOnPage = false) {

    try {

        const res =
            await API.BorrowsAPI.returnBook(id);

        notify(
            res.message,
            "success"
        );

        if (stayOnPage) {
            loadBorrows();

            if (document.getElementById("status")) {
                loadBorrowDetails(id);
            }

            return;
        }

        window.location.href =
            "borrows.html";

    } catch (err) {

        notify(err.message, "error");
    }
}

/* ================= LOAD BOOKS ================= */

async function loadBooksSelect() {

    const select =
        document.getElementById("book");

    if (!select) return;

    try {

        const res =
            await API.BooksAPI.getAll();

        select.innerHTML =
            '<option value="">Choisir</option>';

        res.data.forEach(book => {

            if (
                book.availableCopies > 0 &&
                !book.isArchived
            ) {

                select.innerHTML += `
                    <option value="${book._id}">
                        ${book.title}
                    </option>
                `;
            }
        });

    } catch (err) {

        notify(err.message, "error");
    }
}

/* ================= INIT ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        requireAuth();

        loadBorrows();

        loadBooksSelect();

        const form =
            document.getElementById("borrowForm");

        if (form) {
            requireRole("member");

            form.addEventListener(
                "submit",
                createBorrow
            );
        }

        const params =
            new URLSearchParams(
                window.location.search
            );

        const id =
            params.get("id");

        if (
            id &&
            document.getElementById("book")
        ) {

            loadBorrowDetails(id);
        }

        const returnBtn =
            document.getElementById("returnBtn");

        if (returnBtn && id) {

            returnBtn.addEventListener(
                "click",
                () => returnBook(id)
            );
        }
    }
);
