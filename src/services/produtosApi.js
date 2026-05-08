// src/services/produtosApi.js
export async function listarProdutosPublico() {
    // 1) tenta bater no PHP (precisa responder JSON)
    try {
        const res = await fetch("/listar_produtos_publico.php", { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();

        // normaliza campos possíveis
        return (Array.isArray(data) ? data : []).map(normalizarProduto);
    } catch {
        // 2) fallback: mock local (para desenvolvimento)
        return MOCK_INGRESSOS.map(normalizarProduto);
    }
}

function normalizarProduto(p) {
    // aceita chaves diferentes e normaliza
    return {
        id: p.id ?? p.ID ?? cryptoRandomId(),
        nome: p.nome ?? p.titulo ?? "Evento sem nome",
        preco: toNumber(p.preco ?? p.price ?? p.valor),
        imagem: p.imagem ?? p.foto ?? p.banner ?? "",
        categoria: p.categoria ?? p.tipo ?? "Outros",
        descricao: p.descricao ?? p.descr ?? "",
        estoque: toNumber(p.estoque ?? p.qtd ?? 100),
        local: p.local ?? p.cidade ?? p.venue ?? "",
        dataEvento: p.dataEvento ?? p.data ?? p.data_evento ?? "",
        urlCompra: p.urlCompra ?? p.link ?? "",
    };
}

function toNumber(v) {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
        // aceita "129,90", "129.90", "R$ 129,90"
        const n = Number(v.replace(/[^\d,.-]/g, "").replace(".", "").replace(",", "."));
        return isNaN(n) ? 0 : n;
    }
    return 0;
}

function cryptoRandomId() {
    // id simples para mock/dev
    return Math.random().toString(36).slice(2);
}

const MOCK_INGRESSOS = [
    {
        id: "a1",
        nome: "Festival Urban Beats",
        preco: 149.9,
        imagem: "https://picsum.photos/seed/urban/600/400",
        categoria: "Festival",
        descricao: "Line-up com artistas nacionais. Área premium e open food opcional.",
        estoque: 50,
        local: "São Paulo, SP",
        dataEvento: "2026-02-21",
        urlCompra: "/login"
    },
    {
        id: "a2",
        nome: "Show Acústico Ana & Leo",
        preco: 89.9,
        imagem: "https://picsum.photos/seed/acoustic/600/400",
        categoria: "Show",
        descricao: "Sessão intimista, lugares limitados, experiência próxima ao palco.",
        estoque: 0,
        local: "Curitiba, PR",
        dataEvento: "2026-03-10",
        urlCompra: "/login"
    },
    {
        id: "a3",
        nome: "Stand-up: Noite do Improviso",
        preco: 59.9,
        imagem: "https://picsum.photos/seed/standup/600/400",
        categoria: "Comedy",
        descricao: "Comediantes convidados. Proibido para menores de 16 anos.",
        estoque: 120,
        local: "Florianópolis, SC",
        dataEvento: "2026-01-18",
        urlCompra: "/login"
    },
    {
        id: "a4",
        nome: "Clássicos do Cinema em Concerto",
        preco: 199.9,
        imagem: "https://picsum.photos/seed/orchestra/600/400",
        categoria: "Concerto",
        descricao: "Orquestra sinfônica ao vivo tocando grandes trilhas sonoras.",
        estoque: 35,
        local: "Porto Alegre, RS",
        dataEvento: "2026-04-05",
        urlCompra: "/login"
    },
    {
        id: "a5",
        nome: "Campeonato de E-sports",
        preco: 79.9,
        imagem: "https://picsum.photos/seed/esports/600/400",
        categoria: "Esporte",
        descricao: "Finais presenciais com meet & greet com pro-players.",
        estoque: 200,
        local: "Joinville, SC",
        dataEvento: "2026-05-01",
        urlCompra: "/login"
    },
    {
        id: "a6",
        nome: "Teatro: O Ensaio",
        preco: 69.9,
        imagem: "https://picsum.photos/seed/theater/600/400",
        categoria: "Teatro",
        descricao: "Peça premiada sobre amizade, culpa e segundas chances.",
        estoque: 80,
        local: "Chapecó, SC",
        dataEvento: "2026-02-02",
        urlCompra: "/login"
    }
];
