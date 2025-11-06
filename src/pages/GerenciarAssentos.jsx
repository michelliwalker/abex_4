import { useState, useMemo } from "react";

export default function GerenciarAssentos() {
  const [assentos, setAssentos] = useState(() => {
    const linhas = 8;
    const colunas = 10;
    const temp = [];
    for (let l = 1; l <= linhas; l++) {
      for (let c = 1; c <= colunas; c++) {
        const status = Math.random() < 0.1 ? "vendido" : "disponivel"; // simulado
        temp.push({ id: `${l}-${c}`, linha: l, coluna: c, status });
      }
    }
    return temp;
  });

  const alternarAssento = (id) => {
    setAssentos((atual) =>
      atual.map((a) => {
        if (a.id === id) {
          if (a.status === "disponivel") return { ...a, status: "reservado" };
          if (a.status === "reservado") return { ...a, status: "disponivel" };
        }
        return a;
      })
    );
  };

  const legenda = useMemo(
    () => [
      { status: "disponivel", label: "Disponível", cor: "#22c55e" },
      { status: "reservado", label: "Reservado", cor: "#facc15" },
      { status: "vendido", label: "Vendido", cor: "#9ca3af" },
    ],
    []
  );

  return (
    <div className="page-body">
      <div className="container">
        <h1>Gerenciamento de Assentos</h1>

        <p className="muted">Clique em um assento para reservar ou liberar.</p>

        {/* Legenda */}
        <div style={{ display: "flex", gap: 16, margin: "10px 0 20px" }}>
          {legenda.map((item) => (
            <div key={item.status} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  background: item.cor,
                  border: "1px solid #ccc",
                }}
              ></div>
              <span style={{ fontSize: 14 }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Grid de assentos */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 40px)",
            gap: 8,
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          {assentos.map((a) => (
            <button
              key={a.id}
              onClick={() => a.status !== "vendido" && alternarAssento(a.id)}
              className="assento-btn"
              style={{
                background:
                  a.status === "vendido"
                    ? "#9ca3af"
                    : a.status === "reservado"
                    ? "#facc15"
                    : "#22c55e",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 6,
                width: 40,
                height: 40,
                fontSize: 12,
                cursor: a.status === "vendido" ? "not-allowed" : "pointer",
              }}
              title={`Assento ${a.id} - ${a.status}`}
            >
              {a.linha}-{a.coluna}
            </button>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <a href="/" className="btn btn-outline">Voltar</a>
          <button className="btn btn-brand" style={{ marginLeft: 10 }}>Confirmar Seleção</button>
        </div>
      </div>
    </div>
  );
}
