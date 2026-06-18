/* =========================
   REGISTER
========================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const data = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            email: document.getElementById("registerEmail").value,
            password: document.getElementById("registerPassword").value
        };

        try {

            await API.AuthAPI.register(data);

            showMessage(
                "registerMessage",
                "Inscription réussie",
                "green"
            );

            notify(
                "Compte créé avec succès",
                "success"
            );

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);

        } catch (err) {

            showMessage(
                "registerMessage",
                err.message,
                "red"
            );

            notify(
                err.message,
                "error"
            );
        }
    });
}


/* =========================
   LOGIN
========================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const data = {
            email: document.getElementById("loginEmail").value,
            password: document.getElementById("loginPassword").value
        };

        try {

            const res = await API.AuthAPI.login(data);

            setAuth(
                res.user,
                res.token
            );

            showMessage(
                "loginMessage",
                "Connexion réussie",
                "green"
            );

            notify(
                `Bienvenue ${res.user.firstName}`,
                "success"
            );

            setTimeout(() => {
                window.location.href = "../dashboard/dashboard.html";
            }, 1000);

        } catch (err) {

            showMessage(
                "loginMessage",
                err.message,
                "red"
            );

            notify(
                err.message,
                "error"
            );
        }
    });
}
