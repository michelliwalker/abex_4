import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listarProdutosPublico } from "../services/produtosApi";
import { isLoggedIn } from "../services/auth";

export default function VitrinePublica() {
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");
    const [produtos, setProdutos] = useState([]);

    const [q, setQ] = useState("");
    const [categoria, setCategoria] = useState("todas");
    const [ordem, setOrdem] = useState("relevancia");

    const [msg, setMsg] = useState({ tipo: "", texto: "" });

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const data = await listarProdutosPublico();
                if (isMounted) setProdutos(data);
            } catch {
                if (isMounted) setErro("Não foi possível carregar a vitrine agora.");
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, []);

    const categorias = useMemo(() => {
        const set = new Set(produtos.map(p => p.categoria || "Outros"));
        return ["todas", ...Array.from(set)];
    }, [produtos]);

    const filtrados = useMemo(() => {
        let arr = produtos.slice();
        if (q.trim()) {
            const t = q.trim().toLowerCase();
            arr = arr.filter(p =>
                (p.nome || "").toLowerCase().includes(t) ||
                (p.descricao || "").toLowerCase().includes(t) ||
                (p.local || "").toLowerCase().includes(t)
            );
        }
        if (categoria !== "todas") {
            arr = arr.filter(p => (p.categoria || "Outros") === categoria);
        }
        switch (ordem) {
            case "menor-preco": arr.sort((a,b)=>(a.preco||0)-(b.preco||0)); break;
            case "maior-preco": arr.sort((a,b)=>(b.preco||0)-(a.preco||0)); break;
            case "data": arr.sort((a,b)=>new Date(a.dataEvento||0)-new Date(b.dataEvento||0)); break;
            default: break; // relevância mantém ordem vinda
        }
        return arr;
    }, [produtos, q, categoria, ordem]);

    async function handleComprar(produto) {
        if (produto.estoque === 0) {
            setMsg({ tipo: "error", texto: "Este ingresso está indisponível no momento." });
            return;
        }

        if (!isLoggedIn()) {
            navigate("/login");
            return;
        }

        try {
            // se o PHP espera GET, isso aqui funciona
            const res = await fetch(
                `/adicionar_carrinho.php?id=${encodeURIComponent(produto.id)}&quantidade=1`
            );

            if (!res.ok) {
                throw new Error("HTTP " + res.status);
            }

            // se seu PHP devolver JSON, você pode ler aqui:
            // const data = await res.json();

            setMsg({
                tipo: "success",
                texto: "Ingresso adicionado ao carrinho com sucesso."
            });
        } catch (e) {
            setMsg({
                tipo: "error",
                texto: "Não foi possível adicionar ao carrinho. Tente novamente."
            });
        }
    }

    if (loading) {
        return <div className="container"><p className="muted">Carregando vitrine…</p></div>;
    }
    if (erro) {
        return <div className="container"><div className="alert error">{erro}</div></div>;
    }

    return (
        <div className="page-body">
            <div className="container">
                <div className="logo-wrap">
                    <img className="logo-login" src="/gate-pass-logo.png" alt="Logo" />
                </div>
                <h1>Ingressos</h1>

                {/* Mensagem global */}
                {msg.texto && (
                    <div className={`alert ${msg.tipo === "error" ? "error" : "success"}`}>
                        {msg.texto}
                    </div>
                )}

                {/* Filtros */}
                <div className="vitrine-filtros">
                    <input
                        type="search"
                        placeholder="Buscar evento, cidade…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />

                    <div className="actions-row" style={{ justifyContent: "flex-end" }}>
                        <select value={categoria} onChange={e => setCategoria(e.target.value)}>
                            {categorias.map(c => (
                                <option key={c} value={c}>
                                    {c === "todas" ? "Todas categorias" : c}
                                </option>
                            ))}
                        </select>

                        <select value={ordem} onChange={e => setOrdem(e.target.value)}>
                            <option value="relevancia">Ordenar: Relevância</option>
                            <option value="menor-preco">Menor preço</option>
                            <option value="maior-preco">Maior preço</option>
                            <option value="data">Data do evento</option>
                        </select>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid-produtos">
                    {filtrados.map((p) => (
                        <article key={p.id} className="card-produto">
                            <Link to={`/produto/${encodeURIComponent(p.id)}`}>
                                <img
                                    src={p.imagem || "/placeholder.jpg"}
                                    alt={p.nome}
                                    className="img-produto"
                                    loading="lazy"
                                />
                            </Link>

                            <h3 style={{ margin: "10px 0 4px" }}>
                                <Link to={`/produto/${encodeURIComponent(p.id)}`}>{p.nome}</Link>
                            </h3>

                            <div className="muted" style={{ fontSize: 14 }}>
                                {(p.local || "").trim()}
                                {p.dataEvento ? ` • ${formatarData(p.dataEvento)}` : ""}
                            </div>

                            <div className="preco-bloco">
                                <span className="preco">{formatarPreco(p.preco)}</span>
                                {p.estoque === 0 && <span className="badge">Esgotado</span>}
                            </div>

                            {p.descricao && (
                                <p style={{ margin: "8px 0 0", color: "#334155", fontSize: 14 }}>
                                    {p.descricao.length > 120 ? p.descricao.slice(0, 117) + "..." : p.descricao}
                                </p>
                            )}

                            {/* BOTÕES */}
                            <div className="acoes-produto">
                                <button
                                    type="button"
                                    className="btn btn-brand"
                                    onClick={() => handleComprar(p)}
                                >
                                    {p.estoque === 0 ? "Indisponível" : "Comprar"}
                                </button>

                                <Link
                                    className="btn btn-outline"
                                    to={`/produto/${encodeURIComponent(p.id)}`}
                                >
                                    Ver detalhes
                                </Link>
                            </div>
                        </article>
                    ))}

                    {filtrados.length === 0 && (
                        <div className="muted" style={{ padding: 20 }}>
                            Sem resultados para sua busca.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function formatarPreco(v) {
    const n = Number(v || 0);
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatarData(v) {
    const d = new Date(v);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}
