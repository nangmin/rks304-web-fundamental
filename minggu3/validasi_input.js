document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('registerForm');
    if (!form) return;

    var today = new Date();
    var todayStr = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');
    
    var tanggalLahirInput = document.getElementById('tanggalLahir');
    if (tanggalLahirInput) {
        tanggalLahirInput.setAttribute('max', todayStr);
    }

    var rules = {
        username: function (v) {
            if (v.trim() === '') return 'Username tidak boleh kosong.';
            if (v.trim().length < 3) return 'Username minimal 3 karakter.';
            return '';
        },
        password: function (v) {
            if (v === '') return 'Password tidak boleh kosong.';
            if (v.length < 8) return 'Password minimal 8 karakter.';
            return '';
        },
        nama: function (v) {
            if (v.trim() === '') return 'Nama lengkap tidak boleh kosong.';
            return '';
        },
        tanggalLahir: function (v) {
            if (v === '') return 'Tanggal lahir wajib diisi.';
            if (v > todayStr) return 'Tanggal lahir tidak boleh melebihi hari ini.';
            return '';
        },
        alamat: function (v) {
            if (v.trim() === '') return 'Alamat tidak boleh kosong.';
            return '';
        },
        telepon: function (v) {
            if (v.trim() === '') return 'Nomor telepon wajib diisi.';
            if (!/^[0-9]+$/.test(v.trim())) return 'Nomor telepon hanya boleh berisi angka.';
            if (v.trim().startsWith('0')) return 'Jangan masukkan angka 0 setelah kode +62.';
            return '';
        }
    };

    function showError(id, message) {
        var input = document.getElementById(id);
        var error = document.getElementById(id + 'Error');
        if (!input || !error) return;

        if (message) {
            error.textContent = message;
            input.classList.add('border-rose-400');
            input.classList.remove('border-slate-300');
        } else {
            error.textContent = '';
            input.classList.remove('border-rose-400');
            input.classList.add('border-slate-300');
        }
    }

    function validateField(id) {
        var el = document.getElementById(id);
        if (!el) return true;
        var message = rules[id](el.value);
        showError(id, message);
        return message === '';
    }

    Object.keys(rules).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener('blur', function () { validateField(id); });
            el.addEventListener('input', function () { validateField(id); });
            el.addEventListener('change', function () { validateField(id); });
        }
    });

    form.addEventListener('submit', function (e) {
        var valid = true;
        var firstInvalid = null;

        Object.keys(rules).forEach(function (id) {
            if (!validateField(id)) {
                valid = false;
                if (!firstInvalid) firstInvalid = id;
            }
        });

        if (!valid) {
            e.preventDefault();
            var invalidEl = document.getElementById(firstInvalid);
            if (invalidEl) invalidEl.focus();
        } else {
            e.preventDefault(); // Mencegah submit default HTML agar session tersimpan mulus
            var users = [];
            try { 
                users = JSON.parse(localStorage.getItem('users')) || []; 
            } catch (err) {
                users = [];
            }

            var usernameVal = document.getElementById('username').value.trim();
            var namaVal = document.getElementById('nama').value.trim();
            var passwordVal = document.getElementById('password').value;
            
            var userExists = users.some(function(u) { return u.username === usernameVal; });
            if (userExists) {
                showError('username', 'Username sudah terdaftar. Gunakan yang lain.');
                document.getElementById('username').focus();
                return;
            }

            users.push({
                username: usernameVal,
                password: passwordVal,
                nama: namaVal
            });

            localStorage.setItem('users', JSON.stringify(users));
            sessionStorage.setItem('loggedInUser', usernameVal);
            sessionStorage.setItem('namaPengguna', namaVal);

            window.location.href = "dashboard.html";
        }
    });
});