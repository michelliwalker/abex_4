import { useState, useEffect } from "react";

export default function MinhasCompras() {
  const [compras, setCompras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

  // Dados mock do cliente (substituir por dados reais da sessão/API)
  const cliente = {
    nome: "João Silva",
    id: 1
  };

  useEffect(() => {
    carregarCompras();
  }, []);

  const carregarCompras = async () => {
    try {
      setCarregando(true);
      const dadosCompras = await buscarComprasCliente(cliente.id);
      setCompras(dadosCompras);
    } catch (error) {
      setMensagem({
        texto: "Erro ao carregar suas compras",
        tipo: "erro"
      });
    } finally {
      setCarregando(false);
    }
  };

  const buscarComprasCliente = async (idCliente) => {
    // Simulação de chamada API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            idCompra: 1001,
            produto: {
              nome: "Show de Rock Nacional",
              id: 1
            },
            quantidade: 2,
            valorTotal: 240.00,
            metodoPagamento: "Cartão de Crédito",
            dataCompra: "2024-01-15 14:30:00"
          },
          {
            idCompra: 1002,
            produto: {
              nome: "Festival de Comédia",
              id: 3
            },
            quantidade: 1,
            valorTotal: 90.00,
            metodoPagamento: "PIX",
            dataCompra: "2024-01-20 09:15:00"
          },
          {
            idCompra: 1003,
            produto: {
              nome: "Peça de Teatro Clássico",
              id: 5
            },
            quantidade: 4,
            valorTotal: 320.00,
            metodoPagamento: "Boleto",
            dataCompra: "2024-02-01 16:45:00"
          }
        ]);
      }, 1000);
    });
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarPreco = (valor) => {
    return valor.toLocaleString("pt-BR", { 
      style: "currency", 
      currency: "BRL" 
    });
  };

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "20px",
    fontFamily: "system-ui, -apple-system, sans-serif"
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: "1000px",
    margin: "0 auto"
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={estilos.header}>
        <div style={estilos.headerContent}>
          <a href="/vitrine" style={estilos.logo}>
            <img 
              src="/gate-pass-logo.png" 
              alt="GatePass" 
              style={estilos.logoImagem}
            />
          </a>
          <nav style={estilos.nav}>
            <span style={estilos.saudacao}>
              Olá, <strong>{cliente.nome}</strong>!
            </span>
            <a href="/minhas-compras" style={estilos.navLink}>
              Minhas Compras
            </a>
            <a href="/carrinho" style={estilos.navLink}>
              Ver Carrinho (0)
            </a>
            <a href="/logout-cliente" style={estilos.botaoSair}>
              Sair
            </a>
            <a href="/login-vendedor" style={estilos.botaoSecundario}>
              Acesso Vendedor
            </a>
          </nav>
        </div>
      </header>

      <div style={cardStyle}>
        {/* Cabeçalho */}
        <div style={estilos.cabecalho}>
          <h1 style={estilos.titulo}>Minhas Compras</h1>
          <p style={estilos.subtitulo}>
            Estas são suas compras registradas
          </p>
        </div>

        {/* Mensagem de feedback */}
        {mensagem.texto && (
          <div style={{
            ...estilos.mensagem,
            ...(mensagem.tipo === "erro" ? estilos.mensagemErro : estilos.mensagemSucesso)
          }}>
            {mensagem.texto}
          </div>
        )}

        {/* Conteúdo */}
        {carregando ? (
          <div style={estilos.carregandoContainer}>
            <div style={estilos.loader}></div>
            <p style={estilos.textoCarregando}>Carregando suas compras...</p>
          </div>
        ) : compras.length === 0 ? (
          <div style={estilos.semCompras}>
            <div style={estilos.iconeSemCompras}>🎫</div>
            <h3 style={estilos.tituloSemCompras}>Nenhuma compra encontrada</h3>
            <p style={estilos.textoSemCompras}>
              Você ainda não realizou nenhuma compra.
            </p>
            <a href="/vitrine" style={estilos.botaoPrimario}>
              Explorar Ingressos e Produtos
            </a>
          </div>
        ) : (
          <div style={estilos.tabelaContainer}>
            <table style={estilos.tabela}>
              <thead>
                <tr>
                  <th style={estilos.cabecalhoTabela}>ID Compra</th>
                  <th style={estilos.cabecalhoTabela}>Produto</th>
                  <th style={estilos.cabecalhoTabela}>Quantidade</th>
                  <th style={estilos.cabecalhoTabela}>Valor Total</th>
                  <th style={estilos.cabecalhoTabela}>Método Pgto.</th>
                  <th style={estilos.cabecalhoTabela}>Data da Compra</th>
                  <th style={estilos.cabecalhoTabela}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((compra) => (
                  <tr key={compra.idCompra} style={estilos.linhaTabela}>
                    <td style={estilos.celulaTabela}>
                      <span style={estilos.idCompra}>#{compra.idCompra}</span>
                    </td>
                    <td style={estilos.celulaTabela}>
                      <strong style={estilos.nomeProduto}>
                        {compra.produto.nome}
                      </strong>
                    </td>
                    <td style={estilos.celulaTabela}>
                      <span style={estilos.quantidade}>
                        {compra.quantidade}
                      </span>
                    </td>
                    <td style={estilos.celulaTabela}>
                      <span style={estilos.valorTotal}>
                        {formatarPreco(compra.valorTotal)}
                      </span>
                    </td>
                    <td style={estilos.celulaTabela}>
                      <span style={estilos.metodoPagamento}>
                        {compra.metodoPagamento}
                      </span>
                    </td>
                    <td style={estilos.celulaTabela}>
                      <span style={estilos.dataCompra}>
                        {formatarData(compra.dataCompra)}
                      </span>
                    </td>
                    <td style={estilos.celulaTabela}>
                      <a 
                        href={`/gerar-ingresso/${compra.idCompra}`}
                        target="_blank"
                        style={estilos.botaoPDF}
                      >
                        Gerar Ingresso
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Contador de compras */}
            <div style={estilos.contador}>
              <span style={estilos.textoContador}>
                Total de {compras.length} compra{compras.length !== 1 ? 's' : ''} encontrada{compras.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Links de navegação */}
        <div style={estilos.linksNavegacao}>
          <a href="/vitrine" style={estilos.linkNavegacao}>
            Ver Mais Ingressos/Produtos
          </a>
          <a href="/logout-cliente" style={estilos.linkNavegacao}>
            Sair da Conta
          </a>
        </div>
      </div>
    </div>
  );
}

// Estilos
const estilos = {
  header: {
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "24px"
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logo: {
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "1.5rem",
    color: "#2563eb"
  },
  logoImagem: {
    height: "40px",
    width: "auto"
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  saudacao: {
    color: "#6b7280",
    fontSize: "0.9rem"
  },
  navLink: {
    color: "#374151",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "color 0.2s ease"
  },
  botaoSair: {
    color: "#dc2626",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    padding: "6px 12px",
    border: "1px solid #dc2626",
    borderRadius: "6px",
    transition: "all 0.2s ease"
  },
  botaoSecundario: {
    color: "#2563eb",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    padding: "6px 12px",
    border: "1px solid #2563eb",
    borderRadius: "6px",
    transition: "all 0.2s ease"
  },
  cabecalho: {
    textAlign: "center",
    marginBottom: "32px"
  },
  titulo: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "8px"
  },
  subtitulo: {
    color: "#6b7280",
    fontSize: "1rem"
  },
  mensagem: {
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "0.9rem",
    textAlign: "center"
  },
  mensagemSucesso: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#166534"
  },
  mensagemErro: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626"
  },
  carregandoContainer: {
    textAlign: "center",
    padding: "60px 20px"
  },
  loader: {
    width: "48px",
    height: "48px",
    border: "4px solid #f3f4f6",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    margin: "0 auto 16px",
    animation: "spin 1s linear infinite"
  },
  textoCarregando: {
    color: "#6b7280",
    fontSize: "1rem"
  },
  semCompras: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#6b7280"
  },
  iconeSemCompras: {
    fontSize: "4rem",
    marginBottom: "16px"
  },
  tituloSemCompras: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#374151"
  },
  textoSemCompras: {
    fontSize: "1rem",
    marginBottom: "24px"
  },
  botaoPrimario: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "#2563eb",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
    transition: "background-color 0.2s ease"
  },
  tabelaContainer: {
    overflowX: "auto",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    marginBottom: "24px"
  },
  tabela: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "800px"
  },
  cabecalhoTabela: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "16px 12px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "0.875rem",
    borderBottom: "1px solid #1d4ed8"
  },
  linhaTabela: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background-color 0.2s ease"
  },
  celulaTabela: {
    padding: "16px 12px",
    fontSize: "0.875rem",
    color: "#374151"
  },
  idCompra: {
    fontFamily: "monospace",
    fontWeight: "600",
    color: "#6b7280"
  },
  nomeProduto: {
    color: "#1f2937"
  },
  quantidade: {
    fontWeight: "600",
    color: "#059669"
  },
  valorTotal: {
    fontWeight: "700",
    color: "#059669",
    fontSize: "1rem"
  },
  metodoPagamento: {
    color: "#6b7280"
  },
  dataCompra: {
    color: "#6b7280",
    fontSize: "0.8rem"
  },
  botaoPDF: {
    backgroundColor: "#dc2626",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "0.75rem",
    fontWeight: "600",
    transition: "background-color 0.2s ease",
    display: "inline-block"
  },
  contador: {
    padding: "12px 16px",
    backgroundColor: "#f8fafc",
    borderTop: "1px solid #e5e7eb",
    textAlign: "center"
  },
  textoContador: {
    fontSize: "0.875rem",
    color: "#6b7280",
    fontWeight: "500"
  },
  linksNavegacao: {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    paddingTop: "24px",
    borderTop: "1px solid #e5e7eb"
  },
  linkNavegacao: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.2s ease"
  }
};

// Adicionar keyframes para a animação do loader
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);