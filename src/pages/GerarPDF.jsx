import { useState, useEffect } from "react";

export default function GerarIngressoPDF() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [dadosIngresso, setDadosIngresso] = useState(null);

  // Dados mock do usuário (substituir por dados reais da sessão/API)
  const usuario = {
    nome: "João Silva",
    logado: true
  };

  // Obter ID da compra da URL
  const obterIdCompraDaURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id_compra');
  };

  useEffect(() => {
    const idCompra = obterIdCompraDaURL();
    if (!idCompra) {
      setErro("ID da compra não especificado.");
      setCarregando(false);
      return;
    }

    carregarDadosIngresso(idCompra);
  }, []);

  const carregarDadosIngresso = async (idCompra) => {
    try {
      const dados = await buscarDadosIngresso(idCompra);
      setDadosIngresso(dados);
    } catch (error) {
      setErro(error.message || "Erro ao carregar dados do ingresso.");
    } finally {
      setCarregando(false);
    }
  };

  const buscarDadosIngresso = async (idCompra) => {
    // Simulação de chamada API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulação de validação
        if (!idCompra || isNaN(idCompra)) {
          reject(new Error("ID da compra inválido."));
          return;
        }

        // Dados mock do ingresso
        resolve({
          compra: {
            id: parseInt(idCompra),
            dataCompra: "2024-01-15 14:30:00",
            quantidade: 2,
            valorTotal: 240.00,
            metodoPagamento: "Cartão de Crédito"
          },
          produto: {
            nome: "Show de Rock Nacional",
            descricao: "Uma noite inesquecível com as melhores bandas de rock nacional",
            local: "São Paulo, SP",
            dataEvento: "2024-03-15T20:00:00",
            urlFotoFundo: "/images/evento-bg.jpg",
            urlFotoPerfil: "/images/evento-perfil.jpg"
          },
          cliente: {
            nome: "João Silva",
            email: "joao@email.com",
            cpf: "123.456.789-00"
          }
        });
      }, 1000);
    });
  };

  const gerarPDF = () => {
    // Em uma implementação real, isso faria uma requisição para o backend
    // que geraria o PDF usando uma biblioteca como pdfkit, jsPDF, ou similar
    window.open(`/api/gerar-pdf?id_compra=${obterIdCompraDaURL()}`, '_blank');
    
    // Para demonstração, vamos simular o download
    setTimeout(() => {
      alert("PDF gerado com sucesso! Em uma implementação real, o download começaria automaticamente.");
    }, 500);
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
    maxWidth: "800px",
    margin: "0 auto"
  };

  return (
    <div style={containerStyle}>
      {/* Header igual aos outros componentes */}
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
            {usuario.logado ? (
              <>
                <span style={estilos.saudacao}>
                  Olá, <strong>{usuario.nome}</strong>!
                </span>
                <a href="/minhas-compras" style={estilos.navLink}>
                  Minhas Compras
                </a>
                <a href="/carrinho" style={estilos.navLink}>
                  Ver Carrinho (0)
                </a>
                <a href="/logout" style={estilos.botaoSair}>
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
                  Ver Carrinho (0)
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
          <h1 style={estilos.titulo}>Gerar Ingresso</h1>
          <p style={estilos.subtitulo}>Visualize e baixe seu ingresso em PDF</p>
        </div>

        {/* Conteúdo */}
        {carregando ? (
          <div style={estilos.carregandoContainer}>
            <div style={estilos.loader}></div>
            <p style={estilos.textoCarregando}>Carregando dados do ingresso...</p>
          </div>
        ) : erro ? (
          <div style={estilos.mensagemErro}>
            <div style={estilos.iconeErro}>❌</div>
            <h3 style={estilos.tituloErro}>Erro ao carregar ingresso</h3>
            <p style={estilos.textoErro}>{erro}</p>
            <a href="/minhas-compras" style={estilos.botaoPrimario}>
              Voltar para Minhas Compras
            </a>
          </div>
        ) : dadosIngresso ? (
          <>
            {/* Preview do Ingresso */}
            <div style={estilos.previewContainer}>
              <div style={estilos.ingressoPreview}>
                {/* Header do Ingresso */}
                <div style={estilos.ingressoHeader}>
                  <div style={estilos.ingressoLogo}>
                    <img 
                      src="/gate-pass-logo.png" 
                      alt="GatePass" 
                      style={estilos.logoIngresso}
                    />
                  </div>
                  <div style={{
                    ...estilos.ingressoBanner,
                    backgroundImage: dadosIngresso.produto.urlFotoFundo ? `url(${dadosIngresso.produto.urlFotoFundo})` : 'none',
                    backgroundColor: !dadosIngresso.produto.urlFotoFundo ? '#6c757d' : 'transparent'
                  }}>
                    {dadosIngresso.produto.nome}
                  </div>
                </div>

                {/* Título */}
                <h2 style={estilos.ingressoTitulo}>INGRESSO</h2>

                {/* Conteúdo */}
                <div style={estilos.ingressoContent}>
                  {/* Coluna Esquerda */}
                  <div style={estilos.ingressoColuna}>
                    <div style={estilos.ingressoItem}>
                      <strong>Comprador:</strong>
                      <span>{dadosIngresso.cliente.nome}</span>
                    </div>
                    <div style={estilos.ingressoItem}>
                      <strong>Email:</strong>
                      <span>{dadosIngresso.cliente.email}</span>
                    </div>
                    <div style={estilos.ingressoItem}>
                      <strong>CPF:</strong>
                      <span>{dadosIngresso.cliente.cpf || 'Não informado'}</span>
                    </div>
                    <div style={estilos.ingressoItem}>
                      <strong>Produto/Evento:</strong>
                      <span>{dadosIngresso.produto.nome}</span>
                    </div>
                    <div style={estilos.ingressoItem}>
                      <strong>Descrição:</strong>
                      <span>{dadosIngresso.produto.descricao || 'N/A'}</span>
                    </div>
                    <div style={estilos.ingressoItem}>
                      <strong>Local:</strong>
                      <span>{dadosIngresso.produto.local}</span>
                    </div>
                    <div style={estilos.ingressoItem}>
                      <strong>Data do Evento:</strong>
                      <span>{formatarData(dadosIngresso.produto.dataEvento)}</span>
                    </div>
                  </div>

                  {/* Coluna Direita */}
                  <div style={estilos.ingressoColuna}>
                    {dadosIngresso.produto.urlFotoPerfil ? (
                      <img 
                        src={dadosIngresso.produto.urlFotoPerfil} 
                        alt="Foto do Produto"
                        style={estilos.fotoPerfil}
                      />
                    ) : (
                      <div style={estilos.semFoto}>Sem Foto</div>
                    )}
                    <div style={estilos.ingressoItem}>
                      <strong>Data da Compra:</strong>
                      <span>{formatarData(dadosIngresso.compra.dataCompra)}</span>
                    </div>
                    <div style={estilos.ingressoItem}>
                      <strong>Quantidade:</strong>
                      <span>{dadosIngresso.compra.quantidade}</span>
                    </div>
                    <div style={estilos.ingressoItem}>
                      <strong>Valor Total:</strong>
                      <span>{formatarPreco(dadosIngresso.compra.valorTotal)}</span>
                    </div>
                    <div style={estilos.ingressoItem}>
                      <strong>Método de Pagamento:</strong>
                      <span>{dadosIngresso.compra.metodoPagamento}</span>
                    </div>
                    <div style={estilos.ingressoItem}>
                      <strong>ID da Compra:</strong>
                      <span>#{dadosIngresso.compra.id}</span>
                    </div>
                    <div style={estilos.qrCode}>
                      QR Code (simulado)
                    </div>
                  </div>
                </div>

                {/* Rodapé */}
                <div style={estilos.ingressoRodape}>
                  Apresente este ingresso na entrada do evento.<br />
                  GatePass - Seu acesso fácil à diversão.
                </div>
              </div>
            </div>

            {/* Ações */}
            <div style={estilos.acoesContainer}>
              <button onClick={gerarPDF} style={estilos.botaoGerarPDF}>
                📄 Gerar PDF do Ingresso
              </button>
              <a href="/minhas-compras" style={estilos.botaoVoltar}>
                ← Voltar para Minhas Compras
              </a>
            </div>
          </>
        ) : null}
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
  subtitulo: {
    color: "#6b7280",
    fontSize: "1rem"
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
  mensagemErro: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#dc2626"
  },
  iconeErro: {
    fontSize: "3rem",
    marginBottom: "16px"
  },
  tituloErro: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "8px"
  },
  textoErro: {
    fontSize: "1rem",
    marginBottom: "24px",
    color: "#374151"
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
  previewContainer: {
    marginBottom: "32px"
  },
  ingressoPreview: {
    border: "2px solid #333",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    backgroundColor: "white"
  },
  ingressoHeader: {
    borderBottom: "1px solid #e5e7eb"
  },
  ingressoLogo: {
    textAlign: "center",
    padding: "16px 0",
    borderBottom: "1px solid #e5e7eb"
  },
  logoIngresso: {
    height: "50px",
    width: "auto"
  },
  ingressoBanner: {
    height: "120px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "1.5rem",
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
    textAlign: "center",
    padding: "0 20px"
  },
  ingressoTitulo: {
    textAlign: "center",
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#1f2937",
    margin: "20px 0",
    textTransform: "uppercase"
  },
  ingressoContent: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    padding: "0 20px 20px"
  },
  ingressoColuna: {
    flex: "1",
    minWidth: "300px"
  },
  ingressoItem: {
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px dashed #d1d5db"
  },
  ingressoItemStrong: {
    fontSize: "0.9rem",
    color: "#374151",
    display: "block",
    marginBottom: "4px"
  },
  ingressoItemSpan: {
    fontSize: "1rem",
    color: "#1f2937",
    fontWeight: "500"
  },
  fotoPerfil: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #2563eb",
    margin: "0 auto 16px",
    display: "block"
  },
  semFoto: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    fontSize: "0.8rem",
    margin: "0 auto 16px",
    border: "2px dashed #d1d5db"
  },
  qrCode: {
    width: "120px",
    height: "120px",
    backgroundColor: "#f3f4f6",
    border: "2px solid #d1d5db",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    fontSize: "0.8rem",
    margin: "16px auto 0",
    borderRadius: "8px"
  },
  ingressoRodape: {
    textAlign: "center",
    padding: "16px",
    borderTop: "1px solid #e5e7eb",
    fontSize: "0.8rem",
    color: "#6b7280",
    backgroundColor: "#f9fafb"
  },
  acoesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    alignItems: "center"
  },
  botaoGerarPDF: {
    padding: "14px 28px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s ease"
  },
  botaoVoltar: {
    color: "#2563eb",
    textDecoration: "none",
    fontSize: "0.9rem",
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