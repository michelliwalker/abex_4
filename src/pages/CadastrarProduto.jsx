import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import { isLoggedIn } from "../services/auth";

export default function CadastrarProduto() {
    const navigate = useNavigate();

    // trava básica: se não estiver logado, manda pro login
    if (!isLoggedIn()) {
        navigate("/login");
    }

    const [form, setForm] = useState({
        nome: "",
        descricao: "",
        preco: "",
        quantidade: "",
        categoria: "Festival",    // para a badge
        dataEvento: "",           // para “20 de fevereiro de 2026”
        horario: "",              // para “19:30”
        local: "",                // para “São Paulo, SP”
    });

    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [fotoFundo, setFotoFundo] = useState(null);

    const [msg, setMsg] = useState({ tipo: "", texto: "" });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const fd = new FormData();
            fd.append("nome", form.nome);
            fd.append("descricao", form.descricao);
            fd.append("preco", form.preco);
            fd.append("quantidade", form.quantidade);

            // novos campos para ficar igual à tela de detalhes
            fd.append("categoria", form.categoria);
            fd.append("data_evento", form.dataEvento);
            fd.append("horario", form.horario);
            fd.append("local", form.local);

            if (fotoPerfil) fd.append("foto_perfil", fotoPerfil);
            if (fotoFundo) fd.append("foto_fundo", fotoFundo);

            const res = await fetch("/cadastrar_produto.php", {
                method: "POST",
                body: fd
            });

            const texto = await res.text();

            if (res.ok && texto.toLowerCase().includes("cadastrado com sucesso")) {
                setMsg({
                    tipo: "success",
                    texto: "Produto cadastrado com sucesso!"
                });
                setForm({
                    nome: "",
                    descricao: "",
                    preco: "",
                    quantidade: "",
                    categoria: "Festival",
                    dataEvento: "",
                    horario: "",
                    local: "",
                });
                setFotoPerfil(null);
                setFotoFundo(null);
            } else {
                setMsg({
                    tipo: "error",
                    texto: "Ocorreu um erro ao cadastrar. Verifique os campos."
                });
            }
        } catch (err) {
            setMsg({
                tipo: "error",
                texto: "Erro interno ao enviar os dados. Tente novamente."
            });
        }
    }

    return (
        <div className="page-body">
            <div className="container form-card">
                <h1 style={{ marginBottom: 20 }}>Cadastrar Novo Produto</h1>

                {msg.texto && (
                    <div className={`alert ${msg.tipo === "success" ? "success" : "error"}`}>
                        {msg.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid-2">

                    {/* Nome */}
                    <div className="form-group col-span-2">
                        <label>Nome do produto/ingresso*</label>
                        <input
                            type="text"
                            name="nome"
                            required
                            value={form.nome}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Categoria (para a badge “Festival”) */}
                    <div className="form-group">
                        <label>Categoria / Tipo*</label>
                        <select
                            name="categoria"
                            value={form.categoria}
                            onChange={handleChange}
                        >
                            <option value="Festival">Festival</option>
                            <option value="Show">Show</option>
                            <option value="Teatro">Teatro</option>
                            <option value="Evento">Evento</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>

                    {/* Local */}
                    <div className="form-group">
                        <label>Local (cidade, UF)*</label>
                        <input
                            type="text"
                            name="local"
                            placeholder="Ex: São Paulo, SP"
                            required
                            value={form.local}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Data do evento */}
                    <div className="form-group">
                        <label>Data do evento*</label>
                        <input
                            type="date"
                            name="dataEvento"
                            required
                            value={form.dataEvento}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Horário */}
                    <div className="form-group">
                        <label>Horário*</label>
                        <input
                            type="time"
                            name="horario"
                            required
                            value={form.horario}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Preço & Quantidade */}
                    <div className="form-group">
                        <label>Preço*</label>
                        <input
                            type="number"
                            name="preco"
                            required
                            step="0.01"
                            min="0.01"
                            value={form.preco}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Quantidade total (estoque)*</label>
                        <input
                            type="number"
                            name="quantidade"
                            required
                            min="1"
                            step="1"
                            value={form.quantidade}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Descrição */}
                    <div className="form-group col-span-2">
                        <label>Descrição (Sobre o evento)</label>
                        <textarea
                            name="descricao"
                            value={form.descricao}
                            onChange={handleChange}
                            style={{ minHeight: 80 }}
                        />
                    </div>

                    {/* Imagens */}
                    <div className="form-group">
                        <label>Foto de Perfil (JPG/PNG/GIF)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFotoPerfil(e.target.files[0])}
                        />
                    </div>

                    <div className="form-group">
                        <label>Foto de Fundo / Banner (JPG/PNG/GIF)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFotoFundo(e.target.files[0])}
                        />
                    </div>

                    <button type="submit" className="btn btn-brand col-span-2">
                        Cadastrar
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: 20 }}>
                    <a className="btn btn-outline" href="listar_produtos.php">Ver meus produtos</a>
                </div>
            </div>
        </div>
    );
}
