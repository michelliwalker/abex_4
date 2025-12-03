import { useState, useEffect } from "react";

export default function Carrinho() {
  const [carrinho, setCarrinho] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

  // Dados mock do cliente (substituir por dados reais da sessão/API)
  const cliente = {
    nome: "João Silva",
    id: 1,
    logado: true
  };

  useEffect(() => {
    carregarCarrinho();
  }, []);

  const carregarCarrinho = async () => {
    try {
      setCarregando(true);
      const dadosCarrinho = await buscarCarrinho();
      setCarrinho(dadosCarrinho);
    } catch (error) {
      setMensagem({
        texto: "Erro ao carregar carrinho",
        tipo: "erro"
      });
    } finally {
      setCarregando(false);
    }
  };

  const buscarCarrinho = async () => {
    // Simulação de chamada API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            produto: {
              id: 1,
              nome: "Show de Rock Nacional",
              preco: 120.00,
              estoque: 50,
              imagem: "/placeholder.jpg"
            },
            quantidade: 2,
            subtotal: 240.00
          },
          {
            id: 2,
            produto: {
              id: 3,
              nome: "Festival de Comédia",
              preco: 90.00,
              estoque: 30,
              imagem: "/placeholder.jpg"
            },
            quantidade: 1,
            subtotal: 90.00
          }
        ]);
      }, 800);
    });
  };

  const atualizarQuantidade = async (idProduto, novaQuantidade) => {
    try {
      if (novaQuantidade < 1) {
        setMensagem({
          texto: "Quantidade deve ser pelo menos 1",
          tipo: "erro"
        });
        return;
      }

      // Encontra o produto no carrinho
      const item = carrinho.find(item => item.produto.id === idProduto);
      
      if (!item) {
        setMensagem({
          texto: "Produto não encontrado no carrinho",
          tipo: "erro"
        });
        return;
      }

      if (novaQuantidade > item.produto.estoque) {
        setMensagem({
          texto: `Não há estoque suficiente. Disponível: ${item.produto.estoque}`,
          tipo: "erro"
        });
        return;
      }

      // Simulação de atualização no backend
      await atualizarItemCarrinho(idProduto, novaQuantidade);
      
      // Atualiza localmente
      setCarrinho(prev => 
        prev.map(item => 
          item.produto.id === idProduto 
            ? { 
                ...item, 
                quantidade: novaQuantidade,
                subtotal: item.produto.preco * novaQuantidade
              }
            : item
        )
      );

      setMensagem({
        texto: `Quantidade atualizada para "${item.produto.nome}"`,
        tipo: "sucesso"
      });

    } catch (error) {
      setMensagem({
        texto: "Erro ao atualizar quantidade",
        tipo: "erro"
      });
    }
  };

  const removerItem = async (idProduto) => {
    try {
      const item = carrinho.find(item => item.produto.id === idProduto);
      
      // Simulação de remoção no backend
      await removerItemCarrinho(idProduto);
      
      // Remove localmente
      setCarrinho(prev => prev.filter(item => item.produto.id !== idProduto));

      setMensagem({
        texto: `"${item.produto.nome}" removido do carrinho`,
        tipo: "sucesso"
      });

    } catch (error) {
      setMensagem({
        texto: "Erro ao remover item",
        tipo: "erro"
      });
    }
  };

  const atualizarItemCarrinho = async (idProduto, quantidade) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  };

  const removerItemCarrinho = async (idProduto) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  };

  const totalCarrinho = carrinho.reduce((total, item) => total + item.subtotal, 0);

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
            {cliente.logado ? (
              <>
                <span style={estilos.saudacao}>
                  Olá, <strong>{cliente.nome}</strong>!
                </span>
                <a href="/minhas-compras" style={estilos.navLink}>
                  Minhas Compras
                </a>
                <a href="/carrinho" style={estilos.navLink}>
                  Ver Carrinho ({carrinho.length})
                </a>
                <a href="/logout-cliente" style={estilos.botaoSair}>
                  Sair
                </a>
              </>
            ) : (
              <>
                <a href="/login-cliente" style={estilos.botaoCliente}>
                  Login Cliente
                </a>
                <a href="/cadastro-cliente" style={estilos.botaoCliente}>
                  Cadastre-se Cliente
                </a>
                <a href="/carrinho" style={estilos.navLink}>
                  Ver Carrinho ({carrinho.length})
                </a>
              </>
            )}
            <a href="/login-vendedor" style={estilos.botaoSecundario}>
              Acesso Vendedor
            </a>
          </nav>
        </div>
      </header>

      <div style={cardStyle}>
        {/* Cabeçalho */}
        <div style={estilos.cabecalho}>
          <h1 style={estilos.titulo}>Meu Carrinho de Compras</h1>
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
            <p style={estilos.textoCarregando}>Carregando carrinho...</p>
          </div>
        ) : carrinho.length === 0 ? (
          <div style={estilos.carrinhoVazio}>
            <div style={estilos.iconeCarrinhoVazio}>🛒</div>
            <h3 style={estilos.tituloCarrinhoVazio}>Seu carrinho está vazio</h3>
            <p style={estilos.textoCarrinhoVazio}>
              Adicione alguns produtos incríveis ao seu carrinho!
            </p>
            <a href="/vitrine" style={estilos.botaoPrimario}>
              Comece a Comprar!
            </a>
          </div>
        ) : (
          <>
            <div style={estilos.tabelaContainer}>
              <table style={estilos.tabela}>
                <thead>
                  <tr>
                    <th style={estilos.cabecalhoTabela}>Produto</th>
                    <th style={estilos.cabecalhoTabela}>Preço Unit.</th>
                    <th style={estilos.cabecalhoTabela}>Quantidade</th>
                    <th style={estilos.cabecalhoTabela}>Subtotal</th>
                    <th style={estilos.cabecalhoTabela}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {carrinho.map((item) => (
                    <tr key={item.id} style={estilos.linhaTabela}>
                      <td style={estilos.celulaTabela}>
                        <div style={estilos.infoProduto}>
                          <img 
                            src={item.produto.imagem} 
                            alt={item.produto.nome}
                            style={estilos.imagemProduto}
                          />
                          <span style={estilos.nomeProduto}>
                            {item.produto.nome}
                          </span>
                        </div>
                      </td>
                      <td style={estilos.celulaTabela}>
                        <span style={estilos.precoUnitario}>
                          {formatarPreco(item.produto.preco)}
                        </span>
                      </td>
                      <td style={estilos.celulaTabela}>
                        <div style={estilos.controleQuantidade}>
                          <input
                            type="number"
                            value={item.quantidade}
                            min="1"
                            max={item.produto.estoque}
                            onChange={(e) => atualizarQuantidade(item.produto.id, parseInt(e.target.value))}
                            style={estilos.inputQuantidade}
                          />
                        </div>
                      </td>
                      <td style={estilos.celulaTabela}>
                        <span style={estilos.subtotal}>
                          {formatarPreco(item.subtotal)}
                        </span>
                      </td>
                      <td style={estilos.celulaTabela}>
                        <button
                          onClick={() => removerItem(item.produto.id)}
                          style={estilos.botaoRemover}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr style={estilos.linhaTotal}>
                    <td colSpan="3" style={estilos.celulaTotal}>
                      <strong>Total do Carrinho:</strong>
                    </td>
                    <td style={estilos.celulaTotal}>
                      <strong style={estilos.total}>
                        {formatarPreco(totalCarrinho)}
                      </strong>
                    </td>
                    <td style={estilos.celulaTotal}></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Botões de ação */}
            <div style={estilos.botoesAcao}>
              <a href="/vitrine" style={estilos.botaoContinuar}>
                Continuar Comprando
              </a>
              <a href="/checkout" style={estilos.botaoFinalizar}>
                Finalizar Compra
              </a>
            </div>
          </>
        )}
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
  botaoCliente: {
    color: "#2563eb",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    padding: "6px 12px",
    border: "1px solid #2563eb",
    borderRadius: "6px",
    transition: "all 0.2s ease"
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
    color: "#6b7280",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    padding: "6px 12px",
    border: "1px solid #6b7280",
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
  carrinhoVazio: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#6b7280"
  },
  iconeCarrinhoVazio: {
    fontSize: "4rem",
    marginBottom: "16px"
  },
  tituloCarrinhoVazio: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#374151"
  },
  textoCarrinhoVazio: {
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
    minWidth: "700px"
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
    color: "#374151",
    verticalAlign: "middle"
  },
  infoProduto: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  imagemProduto: {
    width: "50px",
    height: "50px",
    borderRadius: "6px",
    objectFit: "cover"
  },
  nomeProduto: {
    fontWeight: "500",
    color: "#1f2937"
  },
  precoUnitario: {
    fontWeight: "600",
    color: "#059669"
  },
  controleQuantidade: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  inputQuantidade: {
    width: "80px",
    padding: "8px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "0.875rem",
    textAlign: "center"
  },
  subtotal: {
    fontWeight: "600",
    color: "#1f2937"
  },
  botaoRemover: {
    padding: "8px 16px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s ease"
  },
  linhaTotal: {
    backgroundColor: "#f8fafc",
    borderTop: "2px solid #e5e7eb"
  },
  celulaTotal: {
    padding: "20px 12px",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#1f2937"
  },
  total: {
    color: "#059669",
    fontSize: "1.2rem"
  },
  botoesAcao: {
    display: "flex",
    gap: "16px",
    justifyContent: "space-between"
  },
  botaoContinuar: {
    flex: 1,
    padding: "16px 24px",
    backgroundColor: "#6b7280",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "600",
    transition: "background-color 0.2s ease"
  },
  botaoFinalizar: {
    flex: 1,
    padding: "16px 24px",
    backgroundColor: "#059669",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "600",
    transition: "background-color 0.2s ease"
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