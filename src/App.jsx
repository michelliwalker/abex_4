import { Routes, Route, Navigate } from "react-router-dom";

import LoginUsuario from "./pages/LoginUsuario.jsx";
import CadastroCliente from "./pages/CadastroCliente.jsx";
import CadastroVendedor from "./pages/CadastroVendedor.jsx";
import VitrinePublica from "./pages/VitrinePublica.jsx";
import DetalhesProduto from "./pages/DetalhesProduto.jsx"; // <- IMPORTA
import DashboardVendedor from "./pages/DashboardVendedor.jsx";
import CadastrarProduto from "./pages/CadastrarProduto.jsx";
import EditarProduto from "./pages/EditarProduto.jsx";
import ExcluirProduto from "./pages/ExcluirProduto.jsx";
import MeusProdutos from "./pages/MeusProdutos.jsx";


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
            <Route index element={<VitrinePublica />} />
            <Route path="/produto/:id" element={<DetalhesProduto />} />  {/* <- ROTA ATIVA */}

            <Route path="/login" element={<LoginUsuario />} />
            <Route path="/cadastro-cliente" element={<CadastroCliente />} />
            <Route path="/cadastro-vendedor" element={<CadastroVendedor />} />
            <Route path="/dashboard-vendedor" element={<DashboardVendedor />} />
            <Route path="/cadastrar-produto" element={<CadastrarProduto />} />
            <Route path="/editar-produto/:id" element={<EditarProduto />} />
            <Route path="/excluir-produto/:id" element={<ExcluirProduto />} />
            <Route path="/meus-produtos" element={<MeusProdutos />} />


            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
