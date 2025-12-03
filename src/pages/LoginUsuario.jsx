import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/style.css";

export default function LoginUsuario() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarEscolha, setMostrarEscolha] = useState(false);

    useEffect(() => {
        document.body.classList.add("centered-content");
        return () => document.body.classList.remove("centered-content");
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Login enviado:\nEmail: ${email}\nSenha: ${senha}`);
    };

    return (
        <div className="container login-card">
            <div className="logo-wrap">
                <img src="/gate-pass-logo.png" alt="GatePass" className="logo-login" />
            </div>

            <h1 className="titulo-login">Login de Usuário</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">E-mail:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder=""
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="senha">Senha:</label>
                    <input
                        type="password"
                        id="senha"
                        placeholder=""
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-brand">Entrar</button>
            </form>

            <p className="texto-centro link-menor">
                <a href="#" onClick={(e) => { e.preventDefault(); /* implementar recuperação depois */ }}>
                    Esqueci minha senha
                </a>
            </p>

            <div className="texto-centro link-menor" style={{ marginTop: 12 }}>
                Não tem uma conta de usuário?{" "}
                <button className="link-inline" onClick={() => setMostrarEscolha(true)}>
                    Cadastre-se aqui
                </button>.
            </div>

            {mostrarEscolha && (
                <div className="signup-chooser">
                    <p>Escolha como deseja se cadastrar:</p>
                    <div className="chooser-row">
                        <Link to="/cadastro-cliente" className="btn btn-outline" onClick={() => setMostrarEscolha(false)}>
                            Sou Cliente
                        </Link>
                        <Link to="/cadastro-vendedor" className="btn btn-outline" onClick={() => setMostrarEscolha(false)}>
                            Sou Vendedor
                        </Link>
                    </div>
                    <button className="link-inline" onClick={() => setMostrarEscolha(false)}>Fechar</button>
                </div>
            )}
        </div>
    );
}
