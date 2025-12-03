import { useState, useMemo } from "react";

// Constantes para melhor organização
const CONFIG = {
  LINHAS: 8,
  COLUNAS: 10,
  PROBABILIDADE_VENDIDO: 0.1
};

const STATUS = {
  DISPONIVEL: "disponivel",
  RESERVADO: "reservado",
  VENDIDO: "vendido"
};

const CORES = {
  [STATUS.DISPONIVEL]: { bg: "#22c55e", hover: "#16a34a" },
  [STATUS.RESERVADO]: { bg: "#facc15", hover: "#eab308" },
  [STATUS.VENDIDO]: { bg: "#9ca3af", hover: "#9ca3af" }
};

const LEGENDA = [
  { status: STATUS.DISPONIVEL, label: "Disponível", cor: CORES[STATUS.DISPONIVEL].bg },
  { status: STATUS.RESERVADO, label: "Reservado", cor: CORES[STATUS.RESERVADO].bg },
  { status: STATUS.VENDIDO, label: "Vendido", cor: CORES[STATUS.VENDIDO].bg }
];

export default function GerenciarAssentos() {
  const [assentos, setAssentos] = useState(() => gerarAssentosIniciais());

  const alternarAssento = (id) => {
    setAssentos((atual) =>
      atual.map((assento) =>
        assento.id === id
          ? {
              ...assento,
              status:
                assento.status === STATUS.DISPONIVEL
                  ? STATUS.RESERVADO
                  : assento.status === STATUS.RESERVADO
                  ? STATUS.DISPONIVEL
                  : assento.status,
            }
          : assento
      )
    );
  };

  const assentosReservados = useMemo(
    () => assentos.filter(a => a.status === STATUS.RESERVADO).length,
    [assentos]
  );

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2.5rem 1rem"
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "48rem",
    backgroundColor: "white",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    borderRadius: "1rem",
    padding: "2rem"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Cabeçalho */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ 
            fontSize: "1.875rem", 
            fontWeight: 600, 
            color: "#1f2937",
            marginBottom: "0.5rem"
          }}>
            Gerenciamento de Assentos
          </h1>
          <p style={{ color: "#6b7280", fontSize: "1rem" }}>
            Clique em um assento para reservar ou liberar.
          </p>
        </div>

        {/* Contador de reservas */}
        {assentosReservados > 0 && (
          <div style={{ textAlign: "center", margin: "1rem 0 1.5rem" }}>
            <span style={{
              display: "inline-block",
              padding: "0.5rem 1rem",
              backgroundColor: "#3b82f6",
              color: "white",
              borderRadius: "9999px",
              fontSize: "0.875rem",
              fontWeight: 600
            }}>
              {assentosReservados} assento(s) reservado(s)
            </span>
          </div>
        )}

        {/* Legenda */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "1.5rem", 
          marginBottom: "2rem",
          flexWrap: "wrap"
        }}>
          {LEGENDA.map((item) => (
            <div
              key={item.status}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  backgroundColor: item.cor,
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem"
                }}
              />
              <span style={{ fontSize: "0.875rem", color: "#374151" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Grid de assentos */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${CONFIG.COLUNAS}, 2.5rem)`,
          gap: "0.75rem",
          justifyContent: "center",
          marginBottom: "2rem"
        }}>
          {assentos.map((assento) => (
            <BotaoAssento
              key={assento.id}
              assento={assento}
              onClick={alternarAssento}
            />
          ))}
        </div>

        {/* Ações */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "1rem",
          alignItems: "center"
        }}>
          <a
            href="/"
            style={{
              padding: "0.75rem 1.5rem",
              border: "1px solid #9ca3af",
              color: "#374151",
              borderRadius: "0.5rem",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "all 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            Voltar
          </a>
          <button 
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: assentosReservados > 0 ? "#3b82f6" : "#9ca3af",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: assentosReservados > 0 ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              opacity: assentosReservados > 0 ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (assentosReservados > 0) {
                e.target.style.backgroundColor = "#2563eb";
              }
            }}
            onMouseLeave={(e) => {
              if (assentosReservados > 0) {
                e.target.style.backgroundColor = "#3b82f6";
              }
            }}
            disabled={assentosReservados === 0}
          >
            Confirmar Seleção {assentosReservados > 0 && `(${assentosReservados})`}
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente para o botão do assento
function BotaoAssento({ assento, onClick }) {
  const isClicavel = assento.status !== STATUS.VENDIDO;
  const cor = CORES[assento.status];

  const buttonStyle = {
    width: "2.5rem",
    height: "2.5rem",
    backgroundColor: cor.bg,
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#000",
    cursor: isClicavel ? "pointer" : "not-allowed",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const handleClick = () => {
    if (isClicavel) {
      onClick(assento.id);
    }
  };

  const handleMouseEnter = (e) => {
    if (isClicavel && assento.status !== STATUS.VENDIDO) {
      e.target.style.transform = "scale(1.05)";
      e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
      e.target.style.backgroundColor = cor.hover;
    }
  };

  const handleMouseLeave = (e) => {
    if (isClicavel) {
      e.target.style.transform = "scale(1)";
      e.target.style.boxShadow = "none";
      e.target.style.backgroundColor = cor.bg;
    }
  };

  return (
    <button
      onClick={handleClick}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={`Assento ${assento.id} - ${assento.status}`}
      disabled={!isClicavel}
    >
      {assento.linha}-{assento.coluna}
    </button>
  );
}

// Função auxiliar para gerar assentos iniciais
function gerarAssentosIniciais() {
  return Array.from({ length: CONFIG.LINHAS * CONFIG.COLUNAS }, (_, i) => {
    const linha = Math.floor(i / CONFIG.COLUNAS) + 1;
    const coluna = (i % CONFIG.COLUNAS) + 1;
    const status = Math.random() < CONFIG.PROBABILIDADE_VENDIDO 
      ? STATUS.VENDIDO 
      : STATUS.DISPONIVEL;
    
    return { 
      id: `${linha}-${coluna}`, 
      linha, 
      coluna, 
      status 
    };
  });
}