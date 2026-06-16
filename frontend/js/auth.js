const API_URL = "http://localhost:5000/api/auth";

/* ======================
   REGISTER
====================== */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            });

            const data = await response.json();

            const msg = document.getElementById("registerMessage");

            if (data.success) {
                msg.style.color = "green";
                msg.textContent = "Inscription réussie.";

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1500);
            } else {
                msg.style.color = "red";
                msg.textContent = data.message;
            }

        } catch (error) {
            document.getElementById("registerMessage").textContent =
                "Erreur serveur.";
        }
    });
}

/* ======================
   LOGIN
====================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            const msg = document.getElementById("loginMessage");

            if (data.success) {

                localStorage.setItem("token", data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                msg.style.color = "green";
                msg.textContent = "Connexion réussie.";

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000);

            } else {
                msg.style.color = "red";
                msg.textContent = data.message;
            }

        } catch (error) {
            document.getElementById("loginMessage").textContent =
                "Erreur serveur.";
        }
    });
}