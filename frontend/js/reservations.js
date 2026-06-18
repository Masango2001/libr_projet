
/* ================= LOAD ALL RESERVATIONS ================= */
async function loadReservations() {

    try {

        const res = isLibrarian()
            ? await API.ReservationsAPI.getAll()
            : await API.ReservationsAPI.getMy();

        const tbody = document.getElementById("reservationsTable");
        if (!tbody) return;

        tbody.innerHTML = "";

        res.data.forEach(r => {

            tbody.innerHTML += `
                <tr>
                    <td>${r.book.title}</td>
                    <td>${r.user?.firstName || "Moi"}</td>
                    <td>${r.status}</td>
                    <td>

                        <a href="reservation-details.html?id=${r._id}">
                            Voir
                        </a>

                    </td>
                </tr>
            `;
        });

    } catch (err) {
        notify(err.message, "error");
    }
}

/* ================= CREATE RESERVATION ================= */
async function createReservation(e) {

    e.preventDefault();

    const data = {
        book: document.getElementById("book").value
    };

    try {

        await API.ReservationsAPI.create(data);

        notify("Réservation créée", "success");

        window.location.href = "reservations.html";

    } catch (err) {
        notify(err.message, "error");
    }
}

async function loadReservationBooks() {
    const select = document.getElementById("book");
    if (!select || select.tagName !== "SELECT") return;

    try {
        const res = await API.BooksAPI.getAll();
        select.innerHTML = '<option value="">Choisir un livre</option>';

        res.data
            .filter(book => book.availableCopies > 0 && !book.isArchived)
            .forEach(book => {
                select.innerHTML += `
                    <option value="${book._id}">
                        ${book.title}
                    </option>
                `;
            });
    } catch (err) {
        notify(err.message, "error");
    }
}

/* ================= LOAD DETAILS ================= */
async function loadReservationDetails(id) {

    try {

        const res = isLibrarian()
            ? await API.ReservationsAPI.getAll()
            : await API.ReservationsAPI.getMy();

        const reservation = res.data.find(r => r._id === id);

        if (!reservation) return;

        document.getElementById("book").textContent =
            reservation.book.title;

        document.getElementById("user").textContent =
            reservation.user?.firstName || "Moi";

        document.getElementById("status").textContent =
            reservation.status;

    } catch (err) {
        notify(err.message, "error");
    }
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
    requireAuth();

    if (document.getElementById("reservationsTable")) {
        loadReservations();
    }

    const form = document.getElementById("reservationForm");

    if (form) {
        loadReservationBooks();
        form.addEventListener("submit", createReservation);
    }

    const id = new URLSearchParams(window.location.search).get("id");
    if (id && document.getElementById("status")) {
        loadReservationDetails(id);
    }

});
