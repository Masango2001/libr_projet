
/* ================= LOAD PENALTIES ================= */
async function loadPenalties() {

    try {

        const res = await API.PenaltiesAPI.getAll();

        const tbody = document.getElementById("penaltiesTable");
        if (!tbody) return;

        tbody.innerHTML = "";

        res.data.forEach(p => {

            tbody.innerHTML += `
                <tr>
                    <td>${p.user.firstName} ${p.user.lastName}</td>
                    <td>${p.borrow._id}</td>
                    <td>${p.amount} F</td>
                    <td>${p.status}</td>
                    <td>

                        <a href="penalty-details.html?id=${p._id}">
                            Voir
                        </a>

                        ${
                            p.status === "unpaid"
                                ? `<button onclick="markPaid('${p._id}')">
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

        const res = await API.PenaltiesAPI.getAll();

        const penalty = res.data.find(p => p._id === id);

        if (!penalty) return;

        document.getElementById("user").textContent =
            penalty.user.firstName + " " + penalty.user.lastName;

        document.getElementById("book").textContent =
            penalty.borrow.book || "Livre";

        document.getElementById("borrow").textContent =
            penalty.borrow._id;

        document.getElementById("amount").textContent =
            penalty.amount;

        document.getElementById("status").textContent =
            penalty.status;

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
