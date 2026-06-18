
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
                    <td>${s.status}</td>
                    <td>

                        <a href="suggestion-details.html?id=${s._id}">
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
        document.getElementById("status").textContent = suggestion.status;

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
        form.addEventListener("submit", createSuggestion);
    }

    const id = new URLSearchParams(window.location.search).get("id");
    if (id && document.getElementById("comment")) {
        loadSuggestionDetails(id);
    }

});
