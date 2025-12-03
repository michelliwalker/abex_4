import { useState, useEffect } from "react";

// Constantes para validação
const VALIDACAO = {
  SENHA_MIN_CARACTERES: 6
};

export default function EditarPerfil() {
  const [dados, setDados] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmaSenha: ""
  });
  
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

  // Dados mock do usuário (substituir por dados reais da sessão/API)
  const usuario = {
    nome: "João Silva",
    logado: true
  };

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  const carregarDadosUsuario = async () => {
    try {
      const dadosUsuario = await buscarDadosUsuario();
      setDados(prev => ({
        ...prev,
        nome: dadosUsuario.nome || "",
        email: dadosUsuario.email || ""
      }));
    } catch (error) {
      setMensagem({
        texto: "Erro ao carregar dados do usuário",
        tipo: "erro"
      });
    }
  };

  const buscarDadosUsuario = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          nome: "João Silva",
          email: "joao@email.com"
        });
      }, 500);
    });
  };

  const handleChange = (campo, valor) => {
    setDados(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const validarFormulario = () => {
    const erros = [];

    if (!dados.nome.trim()) {
      erros.push("O campo Nome é obrigatório.");
    }

    if (!dados.email.trim()) {
      erros.push("O campo Email é obrigatório.");
    } else if (!validarEmail(dados.email)) {
      erros.push("O Email informado não é válido.");
    }

    if (dados.senha) {
      if (dados.senha.length < VALIDACAO.SENHA_MIN_CARACTERES) {
        erros.push(`A Senha deve ter pelo menos ${VALIDACAO.SENHA_MIN_CARACTERES} caracteres.`);
      }

      if (dados.senha !== dados.confirmaSenha) {
        erros.push("A confirmação de senha não confere.");
      }
    }

    return erros;
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem({ texto: "", tipo: "" });

    const erros = validarFormulario();
    
    if (erros.length > 0) {
      setMensagem({
        texto: erros.join("\n"),
        tipo: "erro"
      });
      setCarregando(false);
      return;
    }

    try {
      const resultado = await atualizarPerfil(dados);
      
      if (resultado.sucesso) {
        setMensagem({
          texto: "Perfil atualizado com sucesso!",
          tipo: "sucesso"
        });
        
        setDados(prev => ({
          ...prev,
          senha: "",
          confirmaSenha: ""
        }));
      } else {
        setMensagem({
          texto: resultado.mensagem || "Ocorreu um erro ao atualizar o perfil.",
          tipo: "erro"
        });
      }
    } catch (error) {
      setMensagem({
        texto: "Erro interno do servidor. Tente novamente.",
        tipo: "erro"
      });
    } finally {
      setCarregando(false);
    }
  };

  const atualizarPerfil = async (dadosAtualizacao) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sucesso = Math.random() > 0.1;
        
        if (sucesso) {
          resolve({
            sucesso: true,
            mensagem: "Perfil atualizado com sucesso!"
          });
        } else {
          resolve({
            sucesso: false,
            mensagem: "Este email já está cadastrado por outro usuário."
          });
        }
      }, 1500);
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
    maxWidth: "480px",
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
        {/* Cabeçalho do conteúdo */}
        <div style={estilos.cabecalho}>
          <h1 style={estilos.titulo}>Editar Perfil</h1>
          <p style={estilos.subtitulo}>Atualize suas informações pessoais</p>
        </div>

        {/* Mensagem de feedback */}
        {mensagem.texto && (
          <div style={{
            ...estilos.mensagem,
            ...(mensagem.tipo === "sucesso" ? estilos.mensagemSucesso : estilos.mensagemErro)
          }}>
            {mensagem.texto.split('\n').map((linha, index) => (
              <div key={index}>{linha}</div>
            ))}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={estilos.formulario}>
          <div style={estilos.grupoInput}>
            <label htmlFor="nome" style={estilos.label}>
              Nome *
            </label>
            <input
              type="text"
              id="nome"
              value={dados.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              style={estilos.input}
              required
              disabled={carregando}
            />
          </div>

          <div style={estilos.grupoInput}>
            <label htmlFor="email" style={estilos.label}>
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={dados.email}
              onChange={(e) => handleChange("email", e.target.value)}
              style={estilos.input}
              required
              disabled={carregando}
            />
          </div>

          <div style={estilos.grupoInput}>
            <label htmlFor="senha" style={estilos.label}>
              Nova Senha
            </label>
            <input
              type="password"
              id="senha"
              value={dados.senha}
              onChange={(e) => handleChange("senha", e.target.value)}
              style={estilos.input}
              placeholder="Deixe em branco para não alterar"
              disabled={carregando}
            />
          </div>

          <div style={estilos.grupoInput}>
            <label htmlFor="confirmaSenha" style={estilos.label}>
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              id="confirmaSenha"
              value={dados.confirmaSenha}
              onChange={(e) => handleChange("confirmaSenha", e.target.value)}
              style={estilos.input}
              placeholder="Confirme a nova senha"
              disabled={carregando}
            />
          </div>

          <button
            type="submit"
            style={{
              ...estilos.botaoPrimario,
              ...(carregando && estilos.botaoDesabilitado)
            }}
            disabled={carregando}
          >
            {carregando ? (
              <div style={estilos.loaderContainer}>
                <div style={estilos.loaderPequeno}></div>
                Processando...
              </div>
            ) : (
              "Atualizar Perfil"
            )}
          </button>
        </form>

        {/* Links de navegação */}
        <div style={estilos.linksContainer}>
          <a href="/" style={estilos.linkVoltar}>
            ← Voltar para a Página Principal
          </a>
          <a 
            href="/excluir-perfil" 
            style={estilos.linkExcluir}
          >
            Excluir Minha Conta
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
    marginBottom: "24px",
    fontSize: "0.9rem",
    lineHeight: "1.4"
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
  formulario: {
    marginBottom: "24px"
  },
  grupoInput: {
    marginBottom: "20px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#374151",
    fontSize: "0.9rem"
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "1rem",
    boxSizing: "border-box",
    transition: "all 0.2s ease",
    backgroundColor: "white"
  },
  botaoPrimario: {
    width: "100%",
    padding: "14px 20px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "8px"
  },
  botaoDesabilitado: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed"
  },
  loaderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  loaderPequeno: {
    width: "16px",
    height: "16px",
    border: "2px solid transparent",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  linksContainer: {
    textAlign: "center",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "24px"
  },
  linkVoltar: {
    color: "#2563eb",
    textDecoration: "none",
    fontSize: "0.9rem",
    display: "block",
    marginBottom: "12px",
    transition: "color 0.2s ease",
    fontWeight: "500"
  },
  linkExcluir: {
    color: "#dc2626",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "600",
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