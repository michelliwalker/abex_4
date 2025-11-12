export function isLoggedIn() {
    return localStorage.getItem("cliente_logado") === "1";
}
