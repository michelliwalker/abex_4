import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/style.css";

export default function CadastroVendedor() {
    const nav = useNavigate();
    const [msg, setMsg] = useState({ tipo: "", texto: "" });
    const [form, setForm] = useState({
        razaoSocial: "",
        nomeFantasia: "",
        cnpj: "",
        ie: "",
        telefone: "",
        endereco: "",
        email: "",
        senha: "",
        confirmar: ""
    });

    // helpers de máscara
    const onlyDigits = (v) => v.replace(/\D/g, "");
    const maskCnpj = (v) =>
        onlyDigits(v)
            .slice(0, 14)
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    const maskTel = (v) =>
        onlyDigits(v)
            .slice(0, 11)
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{4})$/, "$1-$2");

    // valida CNPJ (dígitos verificadores)
    function validaCNPJ(cnpj) {
        cnpj = onlyDigits(cnpj);
        if (cnpj.length !== 14) return false;
        if (/^(\d)\1{13}$/.test(cnpj)) return false;
        const calc = (base) => {
            let soma = 0, pos = base.length - 7;
            for (let i = base.length; i >= 1; i--) {
                soma += base[base.length - i] * pos--;
                if (pos < 2) pos = 9;
            }
            const r = soma % 11;
            return r < 2 ? 0 : 11 - r;
        };
        const b12 = cnpj.slice(0, 12).split("").map(Number);
        const d1 = calc(b12);
        const b13 = [...b12, d1];
        const d2 = calc(b13);
        return cnpj.endsWith(`${d1}${d2}`);
    }

    const onChange = (e) => {
        const { name, value } = e.target;
        const v =
            name === "cnpj" ? maskCnpj(value) :
                name === "telefone" ? maskTel(value) : value;
        setForm((f) => ({ ...f, [name]: v }));
    };

    const validar = () => {
        if (!form.razaoSocial || !form.cnpj || !form.email || !form.senha || !form.confirmar)
            return "Preencha os campos obrigatórios.";
        if (!validaCNPJ(form.cnpj)) return "CNPJ inválido.";
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
            data.append("razao_social", form.razaoSocial);
            data.append("nome_fantasia", form.nomeFantasia);
            data.append("cnpj", onlyDigits(form.cnpj));
            data.append("ie", form.ie);
            data.append("telefone", form.telefone);
            data.append("endereco", form.endereco);
            data.append("email", form.email);
            data.append("senha", form.senha);

            const r = await fetch("/api/cadastro_vendedor.php", {
                method: "POST",
                body: data,
                credentials: "include",
            });

            let json = null; try { json = await r.json(); } catch {}
            if (r.ok) {
                setMsg({ tipo: "success", texto: json?.message || "Vendedor cadastrado!" });
                setTimeout(() => nav("/login"), 1200);
            } else {
                setMsg({ tipo: "error", texto: json?.message || "Não foi possível cadastrar o vendedor." });
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

                <h1>Cadastro de Vendedor</h1>

                {msg.texto && <div className={`alert ${msg.tipo === "error" ? "error" : "success"}`}>{msg.texto}</div>}

                <form onSubmit={onSubmit} className="grid-2">
                    <div className="form-group col-span-2">
                        <label htmlFor="razaoSocial">Razão Social*</label>
                        <input id="razaoSocial" name="razaoSocial" value={form.razaoSocial} onChange={onChange} required />
                    </div>

                    <div className="form-group col-span-2">
                        <label htmlFor="nomeFantasia">Nome Fantasia</label>
                        <input id="nomeFantasia" name="nomeFantasia" value={form.nomeFantasia} onChange={onChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="cnpj">CNPJ*</label>
                        <input id="cnpj" name="cnpj" value={form.cnpj} onChange={onChange} placeholder="00.000.000/0000-00" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ie">Inscrição Estadual</label>
                        <input id="ie" name="ie" value={form.ie} onChange={onChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefone">Telefone</label>
                        <input id="telefone" name="telefone" value={form.telefone} onChange={onChange} placeholder="(00) 00000-0000" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="endereco">Endereço</label>
                        <input id="endereco" name="endereco" value={form.endereco} onChange={onChange} />
                    </div>

                    <div className="form-group">
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

                    <div className="col-span-2" style={{ display: "flex", gap: 8 }}>
                        <button type="submit" className="btn btn-brand" style={{ flex: 1 }}>Criar conta</button>
                        <Link to="/login" className="btn btn-outline" style={{ flex: 1 }}>Ir para o Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
