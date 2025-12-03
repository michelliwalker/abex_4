import { useState, useEffect } from "react";

export default function ExcluirPerfil() {
  const [confirmacao, setConfirmacao] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: "",
    email: ""
  });

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  const carregarDadosUsuario = async () => {
    try {
      // Simulação de carregamento dos dados do usuário
      const usuario = await buscarDadosUsuario();
      setDadosUsuario({
        nome: usuario.nome || "",
        email: usuario.email || ""
      });
    } catch (error) {
      setMensagem({
        texto: "Erro ao carregar dados do usuário",
        tipo: "erro"
      });
    }
  };

  const buscarDadosUsuario = async () => {
    // Simulação de chamada API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          nome: "João Silva",
          email: "joao@email.com"
        });
      }, 500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem({ texto: "", tipo: "" });

    if (!confirmacao) {
      setMensagem({
        texto: "Você deve confirmar a exclusão para continuar.",
        tipo: "erro"
      });
      setCarregando(false);
      return;
    }

    try {
      const resultado = await excluirConta();
      
      if (resultado.sucesso) {
        setMensagem({
          texto: "Conta excluída com sucesso! Redirecionando...",
          tipo: "sucesso"
        });
        
        // Simula redirecionamento após exclusão bem-sucedida
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setMensagem({
          texto: resultado.mensagem || "Ocorreu um erro ao excluir sua conta.",
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

  const excluirConta = async () => {
    // Simulação de chamada API para excluir conta
    return new Promise((resolve) => {
      setTimeout(() => {
        const sucesso = Math.random() > 0.1; // 90% chance de sucesso
        
        if (sucesso) {
          resolve({
            sucesso: true,
            mensagem: "Sua conta foi excluída com sucesso."
          });
        } else {
          resolve({
            sucesso: false,
            mensagem: "Ocorreu um erro ao excluir sua conta. Tente novamente."
          });
        }
      }, 2000);
    });
  };

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#fef2f2", // Fundo vermelho claro para alerta
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "system-ui, -apple-system, sans-serif"
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "480px",
    textAlign: "center"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Ícone de alerta */}
        <div style={estilos.iconeAlerta}>
          ⚠️
        </div>

        {/* Cabeçalho */}
        <div style={estilos.cabecalho}>
          <h1 style={estilos.titulo}>Excluir Minha Conta</h1>
          <p style={estilos.subtitulo}>
            Você tem certeza que deseja excluir sua conta, <strong>{dadosUsuario.nome}</strong>?
          </p>
        </div>

        {/* Alertas importantes */}
        <div style={estilos.alertasContainer}>
          <div style={estilos.alertaPrincipal}>
            <strong style={estilos.textoDestaque}>
              Esta ação é irreversível!
            </strong>
          </div>
          <div style={estilos.alertaSecundario}>
            Todos os seus produtos e clientes cadastrados também serão excluídos.
          </div>
        </div>

        {/* Mensagem de feedback */}
        {mensagem.texto && (
          <div style={{
            ...estilos.mensagem,
            ...(mensagem.tipo === "sucesso" ? estilos.mensagemSucesso : estilos.mensagemErro)
          }}>
            {mensagem.texto}
          </div>
        )}

        {/* Formulário de confirmação */}
        <form onSubmit={handleSubmit} style={estilos.formulario}>
          <div style={estilos.grupoConfirmacao}>
            <label style={estilos.labelCheckbox}>
              <input
                type="checkbox"
                checked={confirmacao}
                onChange={(e) => setConfirmacao(e.target.checked)}
                style={estilos.checkbox}
                disabled={carregando}
                required
              />
              <span style={estilos.textoCheckbox}>
                Sim, eu tenho certeza que quero excluir minha conta permanentemente
              </span>
            </label>
          </div>

          <button
            type="submit"
            style={{
              ...estilos.botaoExcluir,
              ...(carregando && estilos.botaoDesabilitado),
              ...(!confirmacao && estilos.botaoDesabilitado)
            }}
            disabled={carregando || !confirmacao}
          >
            {carregando ? (
              <div style={estilos.loaderContainer}>
                <div style={estilos.loaderPequeno}></div>
                Excluindo conta...
              </div>
            ) : (
              "Excluir Minha Conta Permanentemente"
            )}
          </button>
        </form>

        {/* Link para voltar */}
        <div style={estilos.linkContainer}>
          <a href="/editar-perfil" style={estilos.linkVoltar}>
            ← Cancelar e Voltar para Editar Perfil
          </a>
        </div>
      </div>
    </div>
  );
}

// Estilos
const estilos = {
  iconeAlerta: {
    fontSize: "3rem",
    marginBottom: "16px"
  },
  cabecalho: {
    marginBottom: "24px"
  },
  titulo: {
    fontSize: "1.75rem",
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: "12px"
  },
  subtitulo: {
    color: "#374151",
    fontSize: "1rem",
    lineHeight: "1.5"
  },
  alertasContainer: {
    marginBottom: "24px",
    padding: "16px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px"
  },
  alertaPrincipal: {
    marginBottom: "8px"
  },
  textoDestaque: {
    color: "#dc2626",
    fontSize: "1rem"
  },
  alertaSecundario: {
    color: "#7f1d1d",
    fontSize: "0.9rem",
    lineHeight: "1.4"
  },
  mensagem: {
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
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
  grupoConfirmacao: {
    marginBottom: "20px",
    padding: "16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px"
  },
  labelCheckbox: {
    display: "flex",
    alignItems: "flex-start",
    cursor: "pointer",
    fontSize: "0.95rem",
    color: "#374151",
    lineHeight: "1.4"
  },
  checkbox: {
    marginRight: "12px",
    marginTop: "2px",
    width: "18px",
    height: "18px",
    cursor: "pointer"
  },
  textoCheckbox: {
    fontWeight: "500"
  },
  botaoExcluir: {
    width: "100%",
    padding: "14px 20px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease"
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
  linkContainer: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: "20px"
  },
  linkVoltar: {
    color: "#2563eb",
    textDecoration: "none",
    fontSize: "0.9rem",
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