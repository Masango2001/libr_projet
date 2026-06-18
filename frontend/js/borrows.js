/* ================= LIST ================= */

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
                        ${borrow.user?.firstName || ""}
                        ${borrow.user?.lastName || ""}
                    </td>

                    <td>
                        ${formatDate(borrow.borrowDate)}
                    </td>

                    <td>
                        ${formatDate(borrow.dueDate)}
                    </td>

                    <td>
                        ${borrow.status}
                    </td>

                    <td>

                        <a href="borrow-details.html?id=${borrow._id}">
                            Voir
                        </a>

                        <a href="borrow-return.html?id=${borrow._id}">
                            Retour
                        </a>

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

        document.getElementById("status").textContent =
            borrow.status;

    } catch (err) {

        notify(err.message, "error");
    }
}

/* ================= RETURN ================= */

async function returnBook(id) {

    try {

        const res =
            await API.BorrowsAPI.returnBook(id);

        notify(
            res.message,
            "success"
        );

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

        loadBorrows();

        loadBooksSelect();

        const form =
            document.getElementById("borrowForm");

        if (form) {

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
