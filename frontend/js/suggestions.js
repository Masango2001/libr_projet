const SUGGESTION_STATUS_LABELS = {
    pending: "En attente",
    approved: "Approuvee",
    rejected: "Rejetee"
};

const SUGGESTION_STATUS_CLASSES = {
    pending: "status-pending",
    approved: "status-approved",
    rejected: "status-rejected"
};

function renderSuggestionStatus(status) {
    const label = SUGGESTION_STATUS_LABELS[status] || status;
    const statusClass = SUGGESTION_STATUS_CLASSES[status] || "status-pending";

    return `<span class="status-badge ${statusClass}">${label}</span>`;
}

function renderSuggestionActions(suggestion) {
    const actions = [
        `<a href="suggestion-details.html?id=${suggestion._id}">Voir</a>`
    ];

    if (isLibrarian() && suggestion.status === "pending") {
        actions.push(`
            <button type="button" class="btn btn-success btn-sm" onclick="changeSuggestionStatus('${suggestion._id}', 'approved')">
                Approuver
            </button>
        `);
        actions.push(`
            <button type="button" class="btn btn-danger btn-sm" onclick="changeSuggestionStatus('${suggestion._id}', 'rejected')">
                Rejeter
            </button>
        `);
    }

    return `<div class="actions">${actions.join("")}</div>`;
}

async function changeSuggestionStatus(id, status) {
    try {
        await API.SuggestionsAPI.updateStatus(id, status);
        notify("Statut de suggestion mis a jour", "success");
        loadSuggestions();

        if (document.getElementById("status")) {
            loadSuggestionDetails(id);
        }
    } catch (err) {
        notify(err.message, "error");
    }
}

/* ================= LOAD SUGGESTIONS ================= */
async function loadSuggestions() {

    try {

        const res = isLibrarian()
            ? await API.SuggestionsAPI.getAll()
            : await API.SuggestionsAPI.getMy();

        const tbody = document.getElementById("suggestionsTable");
        if (!tbody) return;

        tbody.innerHTML = "";

        res.data.forEach(s => {

            tbody.innerHTML += `
                <tr>
                    <td>${s.title}</td>
                    <td>${s.author || "-"}</td>
                    <td>${renderSuggestionStatus(s.status)}</td>
                    <td>${renderSuggestionActions(s)}</td>
                </tr>
            `;
        });

    } catch (err) {
        notify(err.message, "error");
    }
}

/* ================= CREATE SUGGESTION ================= */
async function createSuggestion(e) {

    e.preventDefault();

    const data = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        comment: document.getElementById("comment").value
    };

    try {

        await API.SuggestionsAPI.create(data);

        notify("Suggestion envoyée", "success");

        window.location.href = "suggestions.html";

    } catch (err) {
        notify(err.message, "error");
    }
}

/* ================= LOAD DETAILS ================= */
async function loadSuggestionDetails(id) {

    try {

        const res = isLibrarian()
            ? await API.SuggestionsAPI.getAll()
            : await API.SuggestionsAPI.getMy();

        const suggestion = res.data.find(s => s._id === id);

        if (!suggestion) return;

        document.getElementById("title").textContent = suggestion.title;
        document.getElementById("author").textContent = suggestion.author || "-";
        document.getElementById("comment").textContent = suggestion.comment || "-";
        document.getElementById("status").innerHTML = renderSuggestionStatus(suggestion.status);

        const actions = document.getElementById("suggestionActions");
        if (actions) {
            actions.innerHTML = renderSuggestionActions(suggestion);
        }

    } catch (err) {
        notify(err.message, "error");
    }
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
    requireAuth();

    if (document.getElementById("suggestionsTable")) {
        loadSuggestions();
    }

    const form = document.getElementById("suggestionForm");

    if (form) {
        requireRole("member");
        form.addEventListener("submit", createSuggestion);
    }

    const id = new URLSearchParams(window.location.search).get("id");
    if (id && document.getElementById("comment")) {
        loadSuggestionDetails(id);
    }

});
