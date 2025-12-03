import { useState, useEffect } from "react";

export default function ListarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

  // Dados mock do usuário (substituir por dados reais da sessão/API)
  const usuario = {
    nome: "Administrador",
    logado: true
  };

  // Carregar usuários ao montar o componente
  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setCarregando(true);
      const dadosUsuarios = await buscarUsuarios();
      setUsuarios(dadosUsuarios);
    } catch (error) {
      setMensagem({
        texto: "Erro ao carregar lista de usuários",
        tipo: "erro"
      });
    } finally {
      setCarregando(false);
    }
  };

  const buscarUsuarios = async () => {
    // Simulação de chamada API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            nome: "João Silva",
            email: "joao@email.com",
            dataCadastro: "2024-01-15 10:30:00",
            ativo: true
          },
          {
            id: 2,
            nome: "Maria Santos",
            email: "maria@email.com",
            dataCadastro: "2024-01-20 14:25:00",
            ativo: true
          },
          {
            id: 3,
            nome: "Pedro Oliveira",
            email: "pedro@email.com",
            dataCadastro: "2024-02-05 09:15:00",
            ativo: false
          },
          {
            id: 4,
            nome: "Ana Costa",
            email: "ana@email.com",
            dataCadastro: "2024-02-10 16:45:00",
            ativo: true
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
          <h1 style={estilos.titulo}>Listagem de Usuários</h1>
          <p style={estilos.subtitulo}>Todos os usuários cadastrados no sistema</p>
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
            <p style={estilos.textoCarregando}>Carregando usuários...</p>
          </div>
        ) : usuarios.length === 0 ? (
          <div style={estilos.semDados}>
            <div style={estilos.iconeSemDados}>📝</div>
            <h3 style={estilos.tituloSemDados}>Nenhum usuário cadastrado</h3>
            <p style={estilos.textoSemDados}>
              Não há usuários cadastrados no sistema no momento.
            </p>
          </div>
        ) : (
          <div style={estilos.tabelaContainer}>
            <table style={estilos.tabela}>
              <thead>
                <tr>
                  <th style={estilos.cabecalhoTabela}>ID</th>
                  <th style={estilos.cabecalhoTabela}>Nome</th>
                  <th style={estilos.cabecalhoTabela}>Email</th>
                  <th style={estilos.cabecalhoTabela}>Data de Cadastro</th>
                  <th style={estilos.cabecalhoTabela}>Status</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} style={estilos.linhaTabela}>
                    <td style={estilos.celulaTabela}>
                      <span style={estilos.idUsuario}>#{usuario.id}</span>
                    </td>
                    <td style={estilos.celulaTabela}>
                      <div style={estilos.infoUsuario}>
                        <div style={estilos.nomeUsuario}>{usuario.nome}</div>
                      </div>
                    </td>
                    <td style={estilos.celulaTabela}>
                      <span style={estilos.emailUsuario}>{usuario.email}</span>
                    </td>
                    <td style={estilos.celulaTabela}>
                      <span style={estilos.dataUsuario}>
                        {formatarData(usuario.dataCadastro)}
                      </span>
                    </td>
                    <td style={estilos.celulaTabela}>
                      <span style={{
                        ...estilos.status,
                        ...(usuario.ativo ? estilos.statusAtivo : estilos.statusInativo)
                      }}>
                        {usuario.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Contador de usuários */}
            <div style={estilos.contador}>
              <span style={estilos.textoContador}>
                Total de {usuarios.length} usuário{usuarios.length !== 1 ? 's' : ''} encontrado{usuarios.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Ações */}
        <div style={estilos.acoesContainer}>
          <a href="/" style={estilos.botaoVoltar}>
            ← Voltar para a Página Principal
          </a>
          <a href="/logout" style={estilos.botaoSair}>
            Sair do Sistema
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
  semDados: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#6b7280"
  },
  iconeSemDados: {
    fontSize: "3rem",
    marginBottom: "16px"
  },
  tituloSemDados: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#374151"
  },
  textoSemDados: {
    fontSize: "0.95rem"
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
  idUsuario: {
    fontFamily: "monospace",
    fontWeight: "600",
    color: "#6b7280"
  },
  infoUsuario: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  nomeUsuario: {
    fontWeight: "500",
    color: "#1f2937"
  },
  emailUsuario: {
    color: "#2563eb"
  },
  dataUsuario: {
    color: "#6b7280",
    fontSize: "0.8rem"
  },
  status: {
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase"
  },
  statusAtivo: {
    backgroundColor: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0"
  },
  statusInativo: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca"
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
  acoesContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "24px",
    borderTop: "1px solid #e5e7eb",
    gap: "16px"
  },
  botaoVoltar: {
    padding: "10px 16px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
    borderRadius: "6px",
    transition: "all 0.2s ease",
    border: "1px solid #2563eb"
  },
  botaoSair: {
    padding: "10px 16px",
    color: "#dc2626",
    textDecoration: "none",
    fontWeight: "500",
    borderRadius: "6px",
    transition: "all 0.2s ease",
    border: "1px solid #dc2626"
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