import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/style.css";
import { isLoggedIn } from "../services/auth";

export default function EditarProduto() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [carregando, setCarregando] = useState(true);
    const [msg, setMsg] = useState({ tipo: "", texto: "" });

    const [form, setForm] = useState({
        nome: "",
        descricao: "",
        preco: "",
        quantidade: "",
        categoria: "",
        dataEvento: "",
        horario: "",
        local: "",
    });

    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [fotoFundo, setFotoFundo] = useState(null);

    const [fotoPerfilAtual, setFotoPerfilAtual] = useState(null);
    const [fotoFundoAtual, setFotoFundoAtual] = useState(null);

    // só deixa acessar logado
    useEffect(() => {
        if (!isLoggedIn()) navigate("/login");
    }, []);

    // carregar os dados do produto
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/buscar_produto.php?id=${id}`);
                const data = await res.json();

                setForm({
                    nome: data.nome,
                    descricao: data.descricao,
                    preco: data.preco,
                    quantidade: data.quantidade,
                    categoria: data.categoria,
                    dataEvento: data.data_evento,
                    horario: data.horario,
                    local: data.local,
                });

                setFotoPerfilAtual(data.foto_perfil);
                setFotoFundoAtual(data.foto_fundo);

            } catch (err) {
                setMsg({ tipo: "error", texto: "Erro ao carregar produto." });
            } finally {
                setCarregando(false);
            }
        })();
    }, [id]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const fd = new FormData();
            fd.append("id", id);
            fd.append("nome", form.nome);
            fd.append("descricao", form.descricao);
            fd.append("preco", form.preco);
            fd.append("quantidade", form.quantidade);
            fd.append("categoria", form.categoria);
            fd.append("data_evento", form.dataEvento);
            fd.append("horario", form.horario);
            fd.append("local", form.local);

            if (fotoPerfil) fd.append("foto_perfil", fotoPerfil);
            if (fotoFundo) fd.append("foto_fundo", fotoFundo);

            const res = await fetch(`/editar_produto.php?id=${id}`, {
                method: "POST",
                body: fd
            });

            const txt = await res.text();

            if (res.ok && txt.toLowerCase().includes("sucesso")) {
                setMsg({ tipo: "success", texto: "Produto atualizado com sucesso!" });
            } else {
                setMsg({ tipo: "error", texto: "Falha ao atualizar produto." });
            }

        } catch {
            setMsg({ tipo: "error", texto: "Erro interno ao salvar." });
        }
    }

    if (carregando) {
        return <div className="container">Carregando…</div>;
    }

    return (
        <div className="page-body">
            <div className="container form-card">

                <h1 style={{ marginBottom: 20 }}>Editar Produto</h1>

                {msg.texto && (
                    <div className={`alert ${msg.tipo === "success" ? "success" : "error"}`}>
                        {msg.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid-2">

                    <div className="form-group col-span-2">
                        <label>Nome*</label>
                        <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Categoria*</label>
                        <select name="categoria" value={form.categoria} onChange={handleChange} required>
                            <option value="Festival">Festival</option>
                            <option value="Show">Show</option>
                            <option value="Teatro">Teatro</option>
                            <option value="Evento">Evento</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Local*</label>
                        <input type="text" name="local" value={form.local} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Data do evento*</label>
                        <input type="date" name="dataEvento" value={form.dataEvento} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Horário*</label>
                        <input type="time" name="horario" value={form.horario} onChange={handleChange} required />
                    </div>

                    <div className="form-group col-span-2">
                        <label>Descrição</label>
                        <textarea name="descricao" value={form.descricao} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Preço*</label>
                        <input type="number" name="preco" step="0.01" value={form.preco} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Quantidade*</label>
                        <input type="number" name="quantidade" min="1" value={form.quantidade} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Foto de Perfil</label>
                        <input type="file" accept="image/*" onChange={(e) => setFotoPerfil(e.target.files[0])} />
                        {fotoPerfilAtual && <img src={fotoPerfilAtual} alt="Atual" style={{ width: 90, marginTop: 10 }} />}
                    </div>

                    <div className="form-group">
                        <label>Foto de Fundo</label>
                        <input type="file" accept="image/*" onChange={(e) => setFotoFundo(e.target.files[0])} />
                        {fotoFundoAtual && <img src={fotoFundoAtual} alt="Atual" style={{ width: 90, marginTop: 10 }} />}
                    </div>

                    <button type="submit" className="btn btn-brand col-span-2">
                        Atualizar
                    </button>

                </form>

            </div>
        </div>
    );
}
