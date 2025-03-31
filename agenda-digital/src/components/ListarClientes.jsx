import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../axios';
import '../styles/ListarClientes.css';

const ListarClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    buscarClientes();
  }, []);

  const buscarClientes = (busca = '') => {
    setCarregando(true);
    setErro(null);
    
    const endpoint = busca ? `/clientes/busca?q=${busca}` : '/clientes';
    
    api.get(endpoint)
      .then(response => {
        setClientes(response.data);
        setCarregando(false);
      })
      .catch(error => {
        console.error("Erro ao buscar clientes:", error);
        setErro("Erro ao carregar clientes. Tente novamente.");
        setCarregando(false);
      });
  };

  const handleEdit = (id) => {
    navigate(`/editar/${id}`);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Você tem certeza que deseja excluir este cliente?');
    if (confirmDelete) {
      api.delete(`/clientes/${id}`)
        .then(() => {
          setClientes(clientes.filter(cliente => cliente.id !== id));
        })
        .catch(error => {
          console.error('Erro ao excluir cliente:', error);
          alert('Erro ao excluir cliente');
        });
    }
  };

  const handleAddClient = () => {
    navigate('/adicionar');
  };

  const handleAddContact = (clienteId) => {
    navigate(`/clientes/${clienteId}/contatos/adicionar`);
  };

  const formatarData = (data) => {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Clientes</h2>
        <div className="acoes">
          <button className="btn-adicionar" onClick={handleAddClient}>
            + Adicionar Cliente
          </button>
        </div>
      </div>

      <div className="busca-container">
        <input
          type="text"
          placeholder="Buscar por nome ou CPF..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && buscarClientes(termoBusca)}
        />
        <button 
          className="btn-buscar"
          onClick={() => buscarClientes(termoBusca)}
          disabled={carregando}
        >
          {carregando ? 'Buscando...' : 'Buscar'}
        </button>
        {termoBusca && (
          <button 
            className="btn-limpar"
            onClick={() => {
              setTermoBusca('');
              buscarClientes();
            }}
          >
            Limpar
          </button>
        )}
      </div>

      {erro && <div className="mensagem-erro">{erro}</div>}

      {carregando && !erro ? (
        <div className="carregando">Carregando clientes...</div>
      ) : clientes.length === 0 ? (
        <div className="sem-resultados">
          {termoBusca ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
        </div>
      ) : (
        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Nascimento</th>
                <th>Endereço</th>
                <th>Contatos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nome}</td>
                  <td>{cliente.cpf}</td>
                  <td>{formatarData(cliente.dataNascimento)}</td>
                  <td>{cliente.endereco}</td>
                  <td>
                    {cliente.contatos?.length > 0 ? (
                      <ul className="lista-contatos">
                        {cliente.contatos.map((contato, index) => (
                          <li key={index}>
                            <strong>{contato.tipo}:</strong> {contato.valor}
                            {contato.observacao && ` (${contato.observacao})`}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="sem-contato">Nenhum contato</span>
                    )}
                  </td>
                  <td className="acoes-celula">
                    <div className="botoes-acao">
                      <button 
                        className="btn-editar"
                        onClick={() => handleEdit(cliente.id)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-deletar"
                        onClick={() => handleDelete(cliente.id)}
                      >
                        Deletar
                      </button>
                      <button 
                        className="btn-contato"
                        onClick={() => handleAddContact(cliente.id)}
                      >
                        + Contato
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListarClientes;