import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { obterProdutoPorId } from "../services/produtosApi";

export default function DetalhesProduto() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");
    const [produto, setProduto] = useState(null);
    const [hero, setHero] = useState("");

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const p = await obterProdutoPorId(id);
                if (!alive) return;
                setProduto(p);
                setHero(p.imagem || p.imagens?.[0] || "/placeholder.jpg");
                setErro("");
            } catch {
                if (!alive) return;
                setErro("Não foi possível carregar este ingresso agora.");
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [id]);

    const thumbs = useMemo(() => {
        const arr = [];
        if (produto?.imagem) arr.push(produto.imagem);
        if (Array.isArray(produto?.imagens)) arr.push(...produto.imagens);
        return [...new Set(arr)].slice(0, 6);
    }, [produto]);

    if (loading) return <div className="container"><p className="muted">Carregando ingresso…</p></div>;
    if (erro || !produto) {
        return (
            <div className="container">
                <div className="alert error">{erro || "Ingresso não encontrado."}</div>
                <Link className="btn btn-outline" to="/">Voltar à vitrine</Link>
            </div>
        );
    }

    return (
        <div className="page-body">
            <div className="container">
                <div className="logo-wrap">
                    <img className="logo-login" src="/gate-pass-logo.png" alt="Logo" />
                </div>

                <div className="produto-detalhe">
                    {/* Galeria */}
                    <section className="produto-galeria">
                        <img src={hero} alt={produto.nome} className="produto-hero" />
                        {thumbs.length > 1 && (
                            <div className="thumbs">
                                {thumbs.map((src, i) => (
                                    <img
                                        key={src + i}
                                        src={src}
                                        alt={"thumb " + (i + 1)}
                                        onClick={() => setHero(src)}
                                        style={{ cursor: "pointer" }}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Info */}
                    <section className="produto-info">
                        <div className="badges">
                            <span className="badge">{produto.categoria || "Ingresso"}</span>
                            {produto.dataEvento && <span className="badge">{formatarData(produto.dataEvento)}</span>}
                            {produto.local && <span className="badge">{produto.local}</span>}
                        </div>

                        <h1 style={{ textAlign: "left" }}>{produto.nome}</h1>

                        <div className="preco-bloco">
                            <span className="preco">{formatarPreco(produto.preco)}</span>
                            {produto.precoDe && (
                                <span className="muted" style={{ textDecoration: "line-through" }}>
                  {formatarPreco(produto.precoDe)}
                </span>
                            )}
                            {Number(produto.estoque) === 0 && <span className="badge">Esgotado</span>}
                        </div>

                        <div className="comprar">
                            <input
                                type="number"
                                min={1}
                                max={Math.max(1, Number(produto.estoque) || 99)}
                                defaultValue={1}
                            />
                            <a
                                className="btn btn-brand"
                                href={produto.urlCompra || "/login"}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-disabled={Number(produto.estoque) === 0 ? "true" : "false"}
                                onClick={(e) => { if (Number(produto.estoque) === 0) e.preventDefault(); }}
                            >
                                {Number(produto.estoque) === 0 ? "Indisponível" : "Comprar"}
                            </a>
                            <Link className="btn btn-outline" to="/">Voltar</Link>
                        </div>

                        {produto.descricao && (
                            <div className="box">
                                <h3 style={{ marginTop: 0 }}>Sobre o evento</h3>
                                <p style={{ marginBottom: 0 }}>{produto.descricao}</p>
                            </div>
                        )}

                        <div className="box">
                            <h3 style={{ marginTop: 0 }}>Informações</h3>
                            <table className="tabela-specs">
                                <tbody>
                                {produto.dataEvento && (<tr><td>Data</td><td>{formatarData(produto.dataEvento)}</td></tr>)}
                                {produto.horario && (<tr><td>Horário</td><td>{produto.horario}</td></tr>)}
                                {produto.local && (<tr><td>Local</td><td>{produto.local}</td></tr>)}
                                {produto.setor && (<tr><td>Setor</td><td>{produto.setor}</td></tr>)}
                                {produto.politicaMeia && (<tr><td>Meia-entrada</td><td>{produto.politicaMeia}</td></tr>)}
                                {(produto.cidade || produto.uf) && (
                                    <tr><td>Cidade/UF</td><td>{[produto.cidade, produto.uf].filter(Boolean).join(" / ")}</td></tr>
                                )}
                                {produto.classificacao && (<tr><td>Classificação</td><td>{produto.classificacao}</td></tr>)}
                                {typeof produto.estoque !== "undefined" && (
                                    <tr><td>Estoque</td><td>{Number(produto.estoque) > 0 ? produto.estoque : "Esgotado"}</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </section>
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
    if (isNaN(d)) return v;
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
