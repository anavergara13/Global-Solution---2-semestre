const usuario = localStorage.getItem("usuario");

if (!usuario) {
    window.location = "login.html";
}