import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/style.css";

export default function DashboardVendedor() {
    const [vendedor, setVendedor] = useState({ nome: "Vendedor" });
    const [resumo, setResumo] = useState({
        totalVendas: 0,
        produtosAtivos: 0,
        pedidosPendentes: 0,
        saldo: 0,
    });

    useEffect(() => {
        // aqui você puxaria os dados do backend (exemplo: /api/dashboard_vendedor.php)
        // por enquanto é simulado
        setTimeout(() => {
            setResumo({
                totalVendas: 87,
                produtosAtivos: 12,
                pedidosPendentes: 3,
                saldo: 15432.75,
            });
            setVendedor({ nome: "João Ribeiro" });
        }, 800);
    }, []);

    return (
        <div className="page-body">
            <div className="container">
                {/* Cabeçalho */}
                <header className="dash-header">
                    <div className="dash-top">
                        <div>
                            <h1 style={{ textAlign: "left" }}>Painel do Vendedor</h1>
                            <p className="muted">Bem-vindo, {vendedor.nome}</p>
                        </div>
                        <Link className="btn btn-outline" to="/logout">
                            Sair
                        </Link>
                    </div>
                </header>

                {/* Resumo rápido */}
                <section className="dash-resumo">
                    <div className="dash-card">
                        <h3>Total de Vendas</h3>
                        <p className="dash-numero">{resumo.totalVendas}</p>
                    </div>

                    <div className="dash-card">
                        <h3>Produtos Ativos</h3>
                        <p className="dash-numero">{resumo.produtosAtivos}</p>
                    </div>

                    <div className="dash-card">
                        <h3>Pedidos Pendentes</h3>
                        <p className="dash-numero">{resumo.pedidosPendentes}</p>
                    </div>

                    <div className="dash-card">
                        <h3>Saldo Disponível</h3>
                        <p className="dash-numero">
                            {resumo.saldo.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                        </p>
                    </div>
                </section>

                {/* Seções extras */}
                <section className="dash-acoes">
                    <h2>Suas ações</h2>
                    <div className="acoes-grid">
                        <Link className="btn btn-brand" to="/produtos">
                            Gerenciar produtos
                        </Link>
                        <Link className="btn btn-brand" to="/pedidos">
                            Ver pedidos
                        </Link>
                        <Link className="btn btn-brand" to="/relatorios">
                            Relatórios
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
