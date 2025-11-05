import { Routes, Route, Navigate } from "react-router-dom";

import LoginUsuario from "./pages/LoginUsuario.jsx";
import CadastroCliente from "./pages/CadastroCliente.jsx";
import CadastroVendedor from "./pages/CadastroVendedor.jsx";
import VitrinePublica from "./pages/VitrinePublica.jsx";

import "./styles/style.css";

function NotFound() {
    return (
        <div className="container">
            <h1>Página não encontrada</h1>
            <p className="muted">Verifique a URL ou volte para a vitrine.</p>
        </div>
    );
}

export default function App() {
    return (
        <Routes>
            {/* pública */}
            <Route index element={<VitrinePublica />} />

            {/* auth */}
            <Route path="/login" element={<LoginUsuario />} />
            <Route path="/cadastro-cliente" element={<CadastroCliente />} />
            <Route path="/cadastro-vendedor" element={<CadastroVendedor />} />

            {/* utilidades */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
