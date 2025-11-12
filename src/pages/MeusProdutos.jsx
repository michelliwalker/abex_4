import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/style.css";
import { isLoggedIn } from "../services/auth";

export default function MeusProdutos() {
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [produtos, setProdutos] = useState([]);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate("/login");
            return;
        }

        (async () => {
            try {
                // Ajusta essa URL conforme você fizer o retorno em JSON
                const res = await fetch("/listar_produtos.php?formato=json");
                if (!res.ok) throw new Error("HTTP " + res.status);
                const data = await res.json();

                // pode ser data.produtos ou data, depende de como você devolver
                setProdutos(data.produtos || data);

                if (data.mensagem) {
                    setMsg(data.mensagem);
                }
            } catch (e) {
                setErro("Não foi possível carregar seus produtos agora.");
            } finally {
                setCarregando(false);
            }
        })();
    }, [navigate]);

    if (carregando) {
        return (
            <div className="page-body">
                <div className="container">
                    <p className="muted">Carregando seus produtos…</p>
                </div>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="page-body">
                <div className="container">
                    <div className="alert error">{erro}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-body">
            <div className="container form-card">
                <h1>Meus Produtos Cadastrados</h1>

                {msg && (
                    <div className="alert success" style={{ textAlign: "center" }}>
                        {msg}
                    </div>
                )}

                <div className="meus-produtos-header">
                    <span className="muted">
                        Você possui {produtos.length} produto(s) cadastrado(s).
                    </span>

                    <Link className="btn btn-brand" to="/cadastrar-produto" style={{ width: "auto" }}>
                        Cadastrar novo produto
                    </Link>
                </div>

                {produtos.length === 0 ? (
                    <div style={{ padding: 20 }}>
                        <p className="muted">
                            Você ainda não cadastrou nenhum produto.
                        </p>
                        <Link className="btn btn-brand" to="/cadastrar-produto" style={{ marginTop: 10 }}>
                            Cadastrar agora
                        </Link>
                    </div>
                ) : (
                    <div className="tabela-wrapper">
                        <table className="tabela-lista">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Preço</th>
                                <th>Total</th>
                                <th>Disponível</th>
                                <th>Reservado</th>
                                <th>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {produtos.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.nome}</td>
                                    <td>{formatarPreco(p.preco)}</td>
                                    <td>{p.quantidade_total}</td>
                                    <td>{p.quantidade_disponivel}</td>
                                    <td>{p.quantidade_reservada}</td>
                                    <td>
                                        <div className="acoes-tabela">
                                            <Link
                                                className="btn btn-outline"
                                                to={`/editar-produto/${p.id}`}
                                            >
                                                Editar
                                            </Link>
                                            <Link
                                                className="btn btn-outline btn-danger"
                                                to={`/excluir-produto/${p.id}`}
                                            >
                                                Excluir
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div style={{ marginTop: 20, textAlign: "center" }}>
                    <Link className="btn btn-outline" to="/">
                        Voltar para a vitrine
                    </Link>
                </div>
            </div>
        </div>
    );
}

function formatarPreco(v) {
    const n = Number(v || 0);
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
