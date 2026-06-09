function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (email.length < 5 || senha.length < 4) {
        alert("Preencha os campos corretamente.");
        return;
    }

    localStorage.setItem("usuario", email);
    window.location = "dashboard.html";
}