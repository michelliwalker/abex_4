import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/style.css";

export default function CadastroCliente() {
    const nav = useNavigate();
    const [msg, setMsg] = useState({ tipo: "", texto: "" });
    const [form, setForm] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmar: "",
        cpfCnpj: "",
        telefone: "",
        endereco: ""
    });

    const onlyDigits = (v) => v.replace(/\D/g, "");
    const maskCpfCnpj = (v) => {
        const d = onlyDigits(v).slice(0, 14);
        if (d.length <= 11) {
            return d
                .replace(/^(\d{3})(\d)/, "$1.$2")
                .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
                .replace(/\.(\d{3})(\d)/, ".$1-$2");
        }
        return d
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    };
    const maskTel = (v) =>
        onlyDigits(v)
            .slice(0, 11)
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{4})$/, "$1-$2");

    const onChange = (e) => {
        const { name, value } = e.target;
        const v =
            name === "cpfCnpj" ? maskCpfCnpj(value) :
                name === "telefone" ? maskTel(value) : value;
        setForm((f) => ({ ...f, [name]: v }));
    };

    const validar = () => {
        if (!form.nome || !form.email || !form.senha || !form.confirmar)
            return "Preencha os campos obrigatórios.";
        if (form.senha.length < 6) return "A senha deve ter ao menos 6 caracteres.";
        if (form.senha !== form.confirmar) return "As senhas não conferem.";
        return "";
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg({ tipo: "", texto: "" });

        const erro = validar();
        if (erro) return setMsg({ tipo: "error", texto: erro });

        try {
            const data = new FormData();
            data.append("nome", form.nome);
            data.append("email", form.email);
            data.append("senha", form.senha);
            data.append("cpf_cnpj", onlyDigits(form.cpfCnpj));
            data.append("telefone", form.telefone);
            data.append("endereco", form.endereco);

            const r = await fetch("/api/cadastro_cliente.php", {
                method: "POST",
                body: data,
                credentials: "include",
            });

            let json = null; try { json = await r.json(); } catch {}
            if (r.ok) {
                setMsg({ tipo: "success", texto: json?.message || "Cadastro realizado com sucesso!" });
                setTimeout(() => nav("/login"), 1200);
            } else {
                setMsg({ tipo: "error", texto: json?.message || "Não foi possível cadastrar o cliente." });
            }
        } catch {
            setMsg({ tipo: "error", texto: "Falha de comunicação com o servidor." });
        }
    };

    return (
        <div className="centered-content">
            <div className="container form-card">
                <div className="logo-wrap">
                    <img src="/gate-pass-logo.png" alt="GatePass" className="logo-login" />
                </div>

                <h1>Cadastro de Cliente</h1>

                {msg.texto && <div className={`alert ${msg.tipo === "error" ? "error" : "success"}`}>{msg.texto}</div>}

                <form onSubmit={onSubmit} className="grid-2">
                    <div className="form-group col-span-2">
                        <label htmlFor="nome">Nome*</label>
                        <input id="nome" name="nome" value={form.nome} onChange={onChange} required />
                    </div>

                    <div className="form-group col-span-2">
                        <label htmlFor="email">E-mail*</label>
                        <input type="email" id="email" name="email" value={form.email} onChange={onChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="senha">Senha*</label>
                        <input type="password" id="senha" name="senha" value={form.senha} onChange={onChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmar">Confirmar senha*</label>
                        <input type="password" id="confirmar" name="confirmar" value={form.confirmar} onChange={onChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="cpfCnpj">CPF/CNPJ</label>
                        <input id="cpfCnpj" name="cpfCnpj" value={form.cpfCnpj} onChange={onChange} placeholder="000.000.000-00 ou 00.000.000/0000-00" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefone">Telefone</label>
                        <input id="telefone" name="telefone" value={form.telefone} onChange={onChange} placeholder="(00) 00000-0000" />
                    </div>

                    <div className="form-group col-span-2">
                        <label htmlFor="endereco">Endereço</label>
                        <input id="endereco" name="endereco" value={form.endereco} onChange={onChange} />
                    </div>

                    <div className="col-span-2" style={{ display: "flex", gap: 8 }}>
                        <button type="submit" className="btn btn-brand" style={{ flex: 1 }}>Cadastrar</button>
                        <Link to="/login" className="btn btn-outline" style={{ flex: 1 }}>Ir para o Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
