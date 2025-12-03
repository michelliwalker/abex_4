import { useState } from "react";

// Constantes para melhor organização
const CONFIG = {
  CHANCE_SUCESSO: 0.9, // 90% de chance de sucesso
  TEMPO_PROCESSAMENTO: 2000
};

const ETAPAS = {
  CHECKOUT: "checkout",
  PAGAMENTO: "pagamento",
  PROCESSANDO: "processando",
  RESULTADO: "resultado"
};

const METODOS_PAGAMENTO = {
  CARTAO: "cartao",
  PIX: "pix",
  BOLETO: "boleto"
};

const METODOS_CONFIG = {
  [METODOS_PAGAMENTO.CARTAO]: { icone: "💳", label: "Cartão de Crédito" },
  [METODOS_PAGAMENTO.PIX]: { icone: "⚡", label: "PIX" },
  [METODOS_PAGAMENTO.BOLETO]: { icone: "🧾", label: "Boleto Bancário" }
};

// Mock de produtos
const PRODUTOS = [
  { id: 1, nome: "Ingresso VIP", preco: 120 },
  { id: 2, nome: "Camiseta do Evento", preco: 80 },
];

export default function Checkout() {
  const [etapa, setEtapa] = useState(ETAPAS.CHECKOUT);
  const [pagamento, setPagamento] = useState(null);
  const [status, setStatus] = useState(null);

  const total = PRODUTOS.reduce((acc, produto) => acc + produto.preco, 0);

  // Simula o processamento da compra
  const processarPagamento = async (metodo) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sucesso = Math.random() < CONFIG.CHANCE_SUCESSO;
        
        if (sucesso) {
          const mensagens = {
            [METODOS_PAGAMENTO.PIX]: "Pagamento via PIX gerado! Escaneie o QR Code.",
            [METODOS_PAGAMENTO.BOLETO]: "Boleto gerado com sucesso.",
            [METODOS_PAGAMENTO.CARTAO]: "Pagamento aprovado!"
          };
          
          resolve({
            ok: true,
            metodo,
            mensagem: mensagens[metodo]
          });
        } else {
          resolve({
            ok: false,
            metodo,
            mensagem: "Falha ao processar pagamento. Tente novamente."
          });
        }
      }, CONFIG.TEMPO_PROCESSAMENTO);
    });
  };

  const handlePagamento = async (metodo) => {
    setPagamento(metodo);
    setEtapa(ETAPAS.PROCESSANDO);
    const resultado = await processarPagamento(metodo);
    setStatus(resultado);
    setEtapa(ETAPAS.RESULTADO);
  };

  const reiniciarCompra = () => {
    setEtapa(ETAPAS.CHECKOUT);
    setPagamento(null);
    setStatus(null);
  };

  return (
    <div style={estilos.pagina}>
      <div style={estilos.container}>
        {/* Header com indicador de progresso */}
        <Header etapa={etapa} />
        
        {/* Conteúdo principal baseado na etapa atual */}
        <div style={estilos.conteudo}>
          {etapa === ETAPAS.CHECKOUT && (
            <TelaCheckout 
              produtos={PRODUTOS}
              total={total}
              onContinuar={() => setEtapa(ETAPAS.PAGAMENTO)}
            />
          )}
          
          {etapa === ETAPAS.PAGAMENTO && (
            <TelaPagamento 
              onSelecionarPagamento={handlePagamento}
              onVoltar={() => setEtapa(ETAPAS.CHECKOUT)}
            />
          )}
          
          {etapa === ETAPAS.PROCESSANDO && (
            <TelaProcessando metodo={pagamento} />
          )}
          
          {etapa === ETAPAS.RESULTADO && (
            <TelaResultado 
              status={status}
              onReiniciar={reiniciarCompra}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Componente do Header com indicador de progresso
function Header({ etapa }) {
  const etapas = [
    { id: ETAPAS.CHECKOUT, label: "Carrinho" },
    { id: ETAPAS.PAGAMENTO, label: "Pagamento" },
    { id: ETAPAS.RESULTADO, label: "Confirmação" }
  ];

  const etapaAtualIndex = etapas.findIndex(e => e.id === etapa);

  return (
    <div style={estilos.header}>
      <h1 style={estilos.tituloPrincipal}>Finalizar Compra</h1>
      
      <div style={estilos.progressoContainer}>
        {etapas.map((etapaItem, index) => (
          <div key={etapaItem.id} style={estilos.etapaItem}>
            <div 
              style={{
                ...estilos.etapaCirculo,
                backgroundColor: index <= etapaAtualIndex ? "#2563eb" : "#d1d5db",
                color: index <= etapaAtualIndex ? "white" : "#6b7280"
              }}
            >
              {index + 1}
            </div>
            <span style={estilos.etapaLabel}>{etapaItem.label}</span>
            {index < etapas.length - 1 && (
              <div 
                style={{
                  ...estilos.etapaLinha,
                  backgroundColor: index < etapaAtualIndex ? "#2563eb" : "#d1d5db"
                }} 
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente da tela de checkout
function TelaCheckout({ produtos, total, onContinuar }) {
  return (
    <div style={estilos.card}>
      <h2 style={estilos.titulo}>Resumo do Pedido</h2>
      
      <div style={estilos.listaProdutos}>
        {produtos.map((produto) => (
          <div key={produto.id} style={estilos.produto}>
            <div>
              <div style={estilos.produtoNome}>{produto.nome}</div>
            </div>
            <div style={estilos.produtoPreco}>R$ {produto.preco.toFixed(2)}</div>
          </div>
        ))}
      </div>
      
      <div style={estilos.totalContainer}>
        <div style={estilos.totalLinha}>
          <span>Subtotal:</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
        <div style={estilos.totalLinha}>
          <span>Taxas:</span>
          <span>R$ 0,00</span>
        </div>
        <div style={estilos.totalPrincipal}>
          <strong>Total:</strong>
          <strong>R$ {total.toFixed(2)}</strong>
        </div>
      </div>
      
      <button style={estilos.botaoPrimario} onClick={onContinuar}>
        Continuar para Pagamento
      </button>
    </div>
  );
}

// Componente da tela de pagamento
function TelaPagamento({ onSelecionarPagamento, onVoltar }) {
  return (
    <div style={estilos.card}>
      <h2 style={estilos.titulo}>Método de Pagamento</h2>
      <p style={estilos.subtitulo}>Selecione como deseja pagar</p>
      
      <div style={estilos.opcoesPagamento}>
        {Object.entries(METODOS_CONFIG).map(([metodo, config]) => (
          <button
            key={metodo}
            style={estilos.botaoOpcao}
            onClick={() => onSelecionarPagamento(metodo)}
          >
            <span style={estilos.icone}>{config.icone}</span>
            <span>{config.label}</span>
          </button>
        ))}
      </div>
      
      <button style={estilos.botaoVoltar} onClick={onVoltar}>
        ← Voltar
      </button>
    </div>
  );
}

// Componente da tela de processamento
function TelaProcessando({ metodo }) {
  return (
    <div style={estilos.card}>
      <h2 style={estilos.titulo}>Processando Pagamento</h2>
      <div style={estilos.loader}></div>
      <p style={estilos.textoProcessando}>
        Processando {METODOS_CONFIG[metodo]?.label.toLowerCase()}...
      </p>
      <p style={estilos.textoAguarde}>Aguarde alguns segundos</p>
    </div>
  );
}

// Componente da tela de resultado
function TelaResultado({ status, onReiniciar }) {
  return (
    <div style={estilos.card}>
      <div style={estilos.resultadoIcone}>
        {status.ok ? "✅" : "❌"}
      </div>
      
      <h2 style={estilos.titulo}>
        {status.ok ? "Compra Concluída!" : "Falha no Pagamento"}
      </h2>
      
      <p style={estilos.mensagemResultado}>{status.mensagem}</p>

      {status.ok && status.metodo === METODOS_PAGAMENTO.PIX && (
        <div style={estilos.pixContainer}>
          <p style={estilos.pixTexto}>QR Code do PIX:</p>
          <div style={estilos.qrCode}>
            <div style={estilos.qrPlaceholder}>[QR Code Simulado]</div>
            <p style={estilos.pixInstrucoes}>
              Escaneie este código com seu app bancário
            </p>
          </div>
        </div>
      )}

      <button
        style={status.ok ? estilos.botaoPrimario : estilos.botaoErro}
        onClick={onReiniciar}
      >
        {status.ok ? "Fazer Nova Compra" : "Tentar Novamente"}
      </button>
    </div>
  );
}

// Estilos
const estilos = {
  pagina: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "20px"
  },
  container: {
    width: "100%",
    maxWidth: "480px"
  },
  header: {
    textAlign: "center",
    marginBottom: "32px"
  },
  tituloPrincipal: {
    color: "white",
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "32px",
    textShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  progressoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px"
  },
  etapaItem: {
    display: "flex",
    alignItems: "center",
    flex: 1
  },
  etapaCirculo: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s ease"
  },
  etapaLabel: {
    color: "white",
    fontSize: "12px",
    marginTop: "8px",
    fontWeight: "500"
  },
  etapaLinha: {
    flex: 1,
    height: "2px",
    margin: "0 8px",
    transition: "all 0.3s ease"
  },
  conteudo: {
    width: "100%"
  },
  card: {
    background: "white",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
    textAlign: "center"
  },
  titulo: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "8px"
  },
  subtitulo: {
    color: "#6b7280",
    marginBottom: "24px"
  },
  listaProdutos: {
    marginBottom: "24px"
  },
  produto: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #f3f4f6"
  },
  produtoNome: {
    fontWeight: "500",
    color: "#374151"
  },
  produtoPreco: {
    fontWeight: "600",
    color: "#059669"
  },
  totalContainer: {
    borderTop: "2px solid #e5e7eb",
    paddingTop: "16px",
    marginBottom: "24px"
  },
  totalLinha: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    color: "#6b7280"
  },
  totalPrincipal: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#1f2937",
    paddingTop: "8px",
    borderTop: "1px solid #e5e7eb"
  },
  opcoesPagamento: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px"
  },
  botaoOpcao: {
    background: "#f8fafc",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    padding: "16px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "all 0.2s ease"
  },
  icone: {
    fontSize: "1.2rem"
  },
  botaoPrimario: {
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "16px 24px",
    cursor: "pointer",
    width: "100%",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "all 0.2s ease"
  },
  botaoVoltar: {
    background: "transparent",
    color: "#6b7280",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "12px 20px",
    cursor: "pointer",
    width: "100%",
    fontSize: "0.9rem",
    marginTop: "12px"
  },
  botaoErro: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "16px 24px",
    cursor: "pointer",
    width: "100%",
    fontSize: "1rem",
    fontWeight: "600"
  },
  loader: {
    width: "60px",
    height: "60px",
    border: "4px solid #f3f4f6",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    margin: "24px auto",
    animation: "spin 1s linear infinite"
  },
  textoProcessando: {
    fontSize: "1.1rem",
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: "8px"
  },
  textoAguarde: {
    color: "#6b7280"
  },
  resultadoIcone: {
    fontSize: "4rem",
    marginBottom: "16px"
  },
  mensagemResultado: {
    fontSize: "1.1rem",
    color: "#374151",
    marginBottom: "24px",
    lineHeight: "1.5"
  },
  pixContainer: {
    background: "#f0f9ff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #bae6fd",
    margin: "24px 0"
  },
  pixTexto: {
    fontWeight: "600",
    color: "#0369a1",
    marginBottom: "12px"
  },
  qrCode: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb"
  },
  qrPlaceholder: {
    background: "#f3f4f6",
    padding: "40px 20px",
    borderRadius: "4px",
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: "12px"
  },
  pixInstrucoes: {
    fontSize: "0.9rem",
    color: "#6b7280",
    margin: "0"
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