
/* ================= LOAD PENALTIES ================= */

const PENALTY_STATUS_LABELS = {
    unpaid: "Non payee",
    paid: "Payee"
};

const PENALTY_STATUS_CLASSES = {
    unpaid: "status-unpaid",
    paid: "status-paid"
};

function renderPenaltyStatus(status) {
    const label = PENALTY_STATUS_LABELS[status] || status || "-";
    const statusClass = PENALTY_STATUS_CLASSES[status] || "status-unpaid";

    return `<span class="status-badge ${statusClass}">${label}</span>`;
}

async function loadPenalties() {

    try {

        const res = isLibrarian()
            ? await API.PenaltiesAPI.getAll()
            : await API.PenaltiesAPI.getMy();

        const tbody = document.getElementById("penaltiesTable");
        if (!tbody) return;

        tbody.innerHTML = "";

        res.data.forEach(p => {

            tbody.innerHTML += `
                <tr>
                    <td>${p.user ? `${p.user.firstName} ${p.user.lastName}` : "Moi"}</td>
                    <td>${p.borrow._id}</td>
                    <td>${p.amount} F</td>
                    <td>${renderPenaltyStatus(p.status)}</td>
                    <td>

                        <a href="penalty-details.html?id=${p._id}">
                            Voir
                        </a>

                        ${
                            isLibrarian() && p.status === "unpaid"
                                ? `<button type="button" class="btn btn-success btn-sm" onclick="markPaid('${p._id}')">
                                        Marquer payé
                                   </button>`
                                : ""
                        }

                    </td>
                </tr>
            `;
        });

    } catch (err) {
        notify(err.message, "error");
    }
}

/* ================= MARK AS PAID ================= */
async function markPaid(id) {
    if (!isLibrarian()) return;

    try {

        await API.PenaltiesAPI.updateStatus(id, "paid");

        notify("Pénalité payée", "success");

        loadPenalties();

    } catch (err) {
        notify(err.message, "error");
    }
}

/* ================= LOAD DETAILS ================= */
async function loadPenaltyDetails(id) {

    try {

        const res = isLibrarian()
            ? await API.PenaltiesAPI.getAll()
            : await API.PenaltiesAPI.getMy();

        const penalty = res.data.find(p => p._id === id);

        if (!penalty) return;

        document.getElementById("user").textContent =
            penalty.user
                ? penalty.user.firstName + " " + penalty.user.lastName
                : "Moi";

        document.getElementById("book").textContent =
            penalty.borrow.book || "Livre";

        document.getElementById("borrow").textContent =
            penalty.borrow._id;

        document.getElementById("amount").textContent =
            penalty.amount;

        document.getElementById("status").innerHTML =
            renderPenaltyStatus(penalty.status);

    } catch (err) {
        notify(err.message, "error");
    }
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
    requireAuth();

    if (document.getElementById("penaltiesTable")) {
        loadPenalties();
    }

    const id = new URLSearchParams(window.location.search).get("id");
    if (id && document.getElementById("amount")) {
        loadPenaltyDetails(id);
    }

});
