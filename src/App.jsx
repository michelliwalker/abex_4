// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import LoginUsuario from "./pages/LoginUsuario.jsx";
import CadastroCliente from "./pages/CadastroCliente.jsx";
import CadastroVendedor from "./pages/CadastroVendedor.jsx";

import "./styles/style.css";

function NotFound() {
    return (
        <div className="container">
            <h1>Página não encontrada</h1>
            <p className="muted">Verifique a URL ou volte para o login.</p>
        </div>
    );
}

export default function App() {
    return (
        <Routes>
            {/* raiz → login */}
            <Route index element={<LoginUsuario />} />
            <Route path="/login" element={<LoginUsuario />} />

            {/* cadastros */}
            <Route path="/cadastro-cliente" element={<CadastroCliente />} />
            <Route path="/cadastro-vendedor" element={<CadastroVendedor />} />

            {/* utilidades */}
            <Route path="/home" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
