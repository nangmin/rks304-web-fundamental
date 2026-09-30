document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("loginForm");
    if (!form) return;

    function tampilkanError(id, pesan) {
        const errEl = document.getElementById(id + "Error");
        if (errEl) errEl.textContent = pesan;
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        let valid = true;

        tampilkanError("username", "");
        tampilkanError("password", "");

        const pesanForm = document.getElementById("formMessage");
        pesanForm.textContent = "";
        pesanForm.className = "text-sm font-medium text-center";

        if (username === "") {
            tampilkanError("username", "Username tidak boleh kosong.");
            valid = false;
        }

        if (password === "") {
            tampilkanError("password", "Password tidak boleh kosong.");
            valid = false;
        }

        if (!valid) {
            pesanForm.textContent = "Masih ada input yang salah. Silakan periksa kembali.";
            pesanForm.classList.add("text-red-600");
            return;
        }

        // Cek localStorage untuk user yang terdaftar
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem('users')) || [];
        } catch (err) {
            users = [];
        }

        // Akun default admin jika belum ada register
        const defaultAdmin = { username: "admin", password: "password123", nama: "Uzzayri Hakimy" };
        if (!users.some(u => u.username === "admin")) {
            users.push(defaultAdmin);
            localStorage.setItem('users', JSON.stringify(users));
        }

        const foundUser = users.find(u => u.username === username && u.password === password);

        if (foundUser) {
            sessionStorage.setItem("loggedInUser", foundUser.username);
            sessionStorage.setItem("namaPengguna", foundUser.nama || foundUser.username);
            window.location.href = "dashboard.html";
        } else {
            pesanForm.textContent = "Username atau password salah!";
            pesanForm.classList.add("text-red-600");
        }
    });
});