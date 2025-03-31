import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ListarClientes from './components/ListarClientes';
import EditarCliente from './components/EditarCliente';
import GerenciarContatos from './components/GerenciarContatos';
import AdicionarCliente from './components/AdicionarCliente';
import EditarContato from './components/EditarContato';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<ListarClientes />} />
        <Route path="/adicionar" element={<AdicionarCliente />} />
        <Route path="/editar/:id" element={<EditarCliente />} />
        <Route path="/clientes/:clienteId/contatos/adicionar" element={<GerenciarContatos />} />
        <Route path="/clientes/:clienteId/contatos/editar/:contatoId" element={<EditarContato />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
