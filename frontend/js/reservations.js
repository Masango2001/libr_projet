
const RESERVATION_STATUS_LABELS = {
    pending: "En attente - non validee",
    approved: "Validee",
    cancelled: "Refusee",
    completed: "Terminee"
};

const RESERVATION_STATUS_CLASSES = {
    pending: "status-pending",
    approved: "status-approved",
    cancelled: "status-cancelled",
    completed: "status-completed"
};

function getReservationStatusLabel(status) {
    return RESERVATION_STATUS_LABELS[status] || status;
}

function renderReservationStatus(status) {
    const statusClass = RESERVATION_STATUS_CLASSES[status] || "status-pending";

    return `
        <span class="status-badge ${statusClass}">
            ${getReservationStatusLabel(status)}
        </span>
    `;
}

function renderReservationActions(reservation) {
    const actions = [
        `<a href="reservation-details.html?id=${reservation._id}">Voir</a>`
    ];

    if (isLibrarian() && reservation.status === "pending") {
        actions.push(`
            <button type="button" class="btn btn-success btn-sm reservation-action" onclick="changeReservationStatus('${reservation._id}', 'approved')">
                Valider
            </button>
        `);
        actions.push(`
            <button type="button" class="btn btn-danger btn-sm reservation-action" onclick="changeReservationStatus('${reservation._id}', 'cancelled')">
                Refuser
            </button>
        `);
    }

    return `<div class="actions">${actions.join("")}</div>`;
}

async function changeReservationStatus(id, status) {
    try {
        await API.ReservationsAPI.updateStatus(id, status);
        notify("Statut de reservation mis a jour", "success");
        loadReservations();

        if (document.getElementById("status")) {
            loadReservationDetails(id);
        }
    } catch (err) {
        notify(err.message, "error");
    }
}

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
                    <td>${r.book?.title || "-"}</td>
                    <td>${r.user?.firstName || "Moi"}</td>
                    <td>${renderReservationStatus(r.status)}</td>
                    <td>${renderReservationActions(r)}</td>
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

        document.getElementById("status").innerHTML =
            renderReservationStatus(reservation.status);

        const actions = document.getElementById("reservationActions");
        if (actions) {
            actions.innerHTML = renderReservationActions(reservation);
        }

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
        requireRole("member");
        loadReservationBooks();
        form.addEventListener("submit", createReservation);
    }

    const id = new URLSearchParams(window.location.search).get("id");
    if (id && document.getElementById("status")) {
        loadReservationDetails(id);
    }

});
