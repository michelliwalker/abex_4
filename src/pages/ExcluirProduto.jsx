import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../styles/style.css";
import { isLoggedIn } from "../services/auth";

export default function ExcluirProduto() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [produto, setProduto] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [confirmado, setConfirmado] = useState(false);
    const [msg, setMsg] = useState({ tipo: "", texto: "" });

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate("/login");
        }
    }, []);

    // carregar dados do produto
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/buscar_produto.php?id=${id}`);
                if (!res.ok) throw new Error();

                const data = await res.json();
                setProduto(data);
            } catch (err) {
                setMsg({ tipo: "error", texto: "Produto não encontrado." });
            } finally {
                setCarregando(false);
            }
        })();
    }, [id]);

    async function excluir() {
        try {
            const fd = new FormData();
            fd.append("confirmacao", "sim");

            const res = await fetch(`/excluir_produto.php?id=${id}`, {
                method: "POST",
                body: fd
            });

            const texto = await res.text();

            if (res.ok && texto.toLowerCase().includes("sucesso")) {
                setMsg({ tipo: "success", texto: "Produto excluído com sucesso!" });

                setTimeout(() => {
                    navigate("/meus-produtos");
                }, 1500);
            } else {
                setMsg({ tipo: "error", texto: "Erro ao excluir produto." });
            }
        } catch (err) {
            setMsg({ tipo: "error", texto: "Erro interno ao excluir." });
        }
    }

    if (carregando) {
        return <div className="container">Carregando…</div>;
    }

    if (!produto) {
        return (
            <div className="container">
                <div className="alert error">Produto não encontrado.</div>
                <Link className="btn btn-outline" to="/meus-produtos">Voltar</Link>
            </div>
        );
    }

    return (
        <div className="page-body">
            <div className="container form-card" style={{ maxWidth: 500, textAlign: "center" }}>

                <h1 style={{ color: "#dc3545" }}>Excluir Produto</h1>
                <p>Tem certeza que deseja excluir:</p>

                <h2 style={{ marginTop: -5 }}>{produto.nome}</h2>

                <p style={{ color: "red", fontWeight: 700 }}>
                    Esta ação não poderá ser desfeita!
                </p>

                {msg.texto && (
                    <div className={`alert ${msg.tipo === "success" ? "success" : "error"}`}>
                        {msg.texto}
                    </div>
                )}

                <div style={{ margin: "20px 0" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                        <input
                            type="checkbox"
                            checked={confirmado}
                            onChange={(e) => setConfirmado(e.target.checked)}
                        />
                        Sim, eu quero excluir permanentemente.
                    </label>
                </div>

                <button
                    className="btn btn-brand"
                    style={{ backgroundColor: "#dc3545", border: "none" }}
                    disabled={!confirmado}
                    onClick={excluir}
                >
                    Excluir Produto
                </button>

                <Link className="btn btn-outline" to="/meus-produtos" style={{ marginTop: 10, display: "block" }}>
                    Cancelar
                </Link>

            </div>
        </div>
    );
}
