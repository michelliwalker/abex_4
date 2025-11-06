const PHP_LIST_PUBLIC = "/listar_produtos_publico.php";
const PHP_GET_BY_ID = (id) => `/listar_produtos.php?id=${encodeURIComponent(id)}`;

export async function listarProdutosPublico() {
    try {
        const res = await fetch(PHP_LIST_PUBLIC, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        return (Array.isArray(data) ? data : []).map(normalizarProduto);
    } catch {
        return MOCK_INGRESSOS.map(normalizarProduto);
    }
}

export async function obterProdutoPorId(id) {
    if (!id) throw new Error("ID inválido");
    try {
        const res = await fetch(PHP_GET_BY_ID(id), { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        const obj = data?.produto || data; // aceita { produto: {...} } ou o objeto direto
        return normalizarProduto(obj);
    } catch {
        const p = MOCK_INGRESSOS.find(x => String(x.id) === String(id));
        if (p) return normalizarProduto(p);
        throw new Error("Produto não encontrado");
    }
}

function normalizarProduto(p) {
    const imagens = toArray(p.imagens || p.fotos || p.gallery);
    return {
        id: p.id ?? p.ID ?? randomId(),
        nome: p.nome ?? p.titulo ?? "Evento sem nome",
        preco: toNumber(p.preco ?? p.price ?? p.valor),
        precoDe: toNumber(p.precoDe ?? p.de ?? p.oldPrice),
        imagem: p.imagem ?? p.foto ?? p.banner ?? imagens[0] ?? "",
        imagens,
        categoria: p.categoria ?? p.tipo ?? "Outros",
        descricao: p.descricao ?? p.descr ?? "",
        estoque: toNumber(p.estoque ?? p.qtd ?? 100),
        local: p.local ?? p.venue ?? [p.endereco, p.bairro, p.cidade, p.uf].filter(Boolean).join(", "),
        cidade: p.cidade ?? "",
        uf: p.uf ?? "",
        dataEvento: p.dataEvento ?? p.data ?? p.data_evento ?? "",
        horario: p.horario ?? p.hora ?? "",
        setor: p.setor ?? "",
        politicaMeia: p.politicaMeia ?? p.meia ?? "",
        classificacao: p.classificacao ?? p.class ?? "",
        urlCompra: p.urlCompra ?? p.link ?? "",
    };
}

function toArray(v) {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === "string") {
        try {
            const parsed = JSON.parse(v);
            return Array.isArray(parsed) ? parsed : [v];
        } catch { return [v]; }
    }
    return [v];
}

function toNumber(v) {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
        const n = Number(v.replace(/[^\d,.-]/g, "").replace(".", "").replace(",", "."));
        return isNaN(n) ? 0 : n;
    }
    return 0;
}

function randomId() { return Math.random().toString(36).slice(2); }

// ---------- MOCK DEV ----------
const MOCK_INGRESSOS = [
    {
        id: "a1",
        nome: "Festival Urban Beats",
        preco: 149.9,
        precoDe: 199.9,
        imagem: "https://picsum.photos/seed/urban/800/520",
        imagens: [
            "https://picsum.photos/seed/urban/800/520",
            "https://picsum.photos/seed/urban2/800/520",
            "https://picsum.photos/seed/urban3/800/520"
        ],
        categoria: "Festival",
        descricao: "Line-up com artistas nacionais. Área premium e open food opcional.",
        estoque: 50,
        local: "São Paulo, SP",
        dataEvento: "2026-02-21",
        horario: "19:30",
        urlCompra: "/login"
    },
    {
        id: "a2",
        nome: "Show Acústico Ana & Leo",
        preco: 89.9,
        imagem: "https://picsum.photos/seed/acoustic/800/520",
        categoria: "Show",
        descricao: "Sessão intimista, lugares limitados.",
        estoque: 0,
        local: "Curitiba, PR",
        dataEvento: "2026-03-10",
        horario: "21:00",
        urlCompra: "/login"
    }
];
