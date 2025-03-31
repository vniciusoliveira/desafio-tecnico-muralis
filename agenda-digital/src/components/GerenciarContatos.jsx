import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../axios';
import '../styles/GerenciarContatos.css';

const GerenciarContatos = () => {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const [contatos, setContatos] = useState([]);
  const [formData, setFormData] = useState({
    tipo: '',
    valor: '',
    observacao: ''
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Carrega contatos ao montar o componente
  useEffect(() => {
    carregarContatos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteId]);

  const carregarContatos = async () => {
    setCarregando(true);
    setErro('');
    try {
      const response = await api.get(`/clientes/${clienteId}/contatos`);
      setContatos(response.data);
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
      setErro('Erro ao carregar contatos. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleValorChange = (e) => {
    let { value } = e.target;
    
    // Aplica máscara de telefone se for do tipo Telefone
    if (formData.tipo === 'Telefone') {
      value = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    setFormData({ ...formData, valor: value });
  };

  const validarContato = () => {
    if (!formData.tipo) {
      setErro('Selecione o tipo de contato');
      return false;
    }

    if (!formData.valor) {
      setErro('Preencha o valor do contato');
      return false;
    }

    if (formData.tipo === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.valor)) {
      setErro('E-mail inválido');
      return false;
    }

    if (formData.tipo === 'Telefone' && formData.valor.length !== 15) {
      setErro('Telefone incompleto. Formato: (XX) XXXXX-XXXX');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!validarContato()) return;

    setCarregando(true);
    try {
      const response = await api.post(`/clientes/${clienteId}/contatos`, formData);
      setContatos([...contatos, response.data]);
      setFormData({ tipo: '', valor: '', observacao: '' });
      setSucesso('Contato adicionado com sucesso!');
    } catch (error) {
      console.error("Erro ao adicionar contato:", error);
      setErro(error.response?.data?.message || 'Erro ao adicionar contato');
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluirContato = async (id) => {
    const confirmacao = window.confirm('Tem certeza que deseja excluir este contato?');
    if (!confirmacao) return;

    setCarregando(true);
    setErro('');
    try {
      await api.delete(`/clientes/${clienteId}/contatos/${id}`);
      setContatos(contatos.filter(contato => contato.id !== id));
      setSucesso('Contato excluído com sucesso!');
    } catch (error) {
      console.error("Erro ao excluir contato:", error);
      setErro('Erro ao excluir contato');
    } finally {
      setCarregando(false);
    }
  };

  const handleEditarContato = (contatoId) => {
    navigate(`/clientes/${clienteId}/contatos/editar/${contatoId}`);
  };

  return (
    <div className="gerenciar-contatos-container">
      <div className="gerenciar-contatos-header">
        <h2>Gerenciar Contatos</h2>
        <button 
          className="btn-voltar"
          onClick={() => navigate(`/clientes`)}
        >
          Voltar para Clientes
        </button>
      </div>

      {erro && <div className="mensagem-erro">{erro}</div>}
      {sucesso && <div className="mensagem-sucesso">{sucesso}</div>}

      <div className="formulario-contato">
        <h3>Adicionar Novo Contato</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipo de Contato*</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              disabled={carregando}
            >
              <option value="">Selecione...</option>
              <option value="Telefone">Telefone</option>
              <option value="Email">E-mail</option>
            </select>
          </div>

          <div className="form-group">
            <label>{formData.tipo === 'Telefone' ? 'Telefone*' : 'E-mail*'}</label>
            <input
              type={formData.tipo === 'Email' ? 'email' : 'text'}
              name="valor"
              value={formData.valor}
              onChange={handleValorChange}
              placeholder={
                formData.tipo === 'Telefone' ? '(99) 99999-9999' : 'exemplo@email.com'
              }
              required
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label>Observação</label>
            <input
              type="text"
              name="observacao"
              value={formData.observacao}
              onChange={handleChange}
              placeholder="Opcional"
              disabled={carregando}
            />
          </div>

          <button 
            type="submit" 
            className="btn-adicionar"
            disabled={carregando}
          >
            {carregando ? 'Adicionando...' : 'Adicionar Contato'}
          </button>
        </form>
      </div>

      <div className="lista-contatos-section">
        <h3>Contatos Cadastrados</h3>
        
        {carregando && contatos.length === 0 ? (
          <div className="carregando">Carregando contatos...</div>
        ) : contatos.length === 0 ? (
          <div className="sem-contatos">Nenhum contato cadastrado</div>
        ) : (
          <div className="contatos-grid">
            {contatos.map(contato => (
              <div key={contato.id} className="contato-card">
                <div className="contato-info">
                  <span className="contato-tipo">{contato.tipo}</span>
                  <span className="contato-valor">{contato.valor}</span>
                  {contato.observacao && (
                    <span className="contato-observacao">{contato.observacao}</span>
                  )}
                </div>
                <div className="contato-acoes">
                  <button
                    className="btn-editar"
                    onClick={() => handleEditarContato(contato.id)}
                    disabled={carregando}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-excluir"
                    onClick={() => handleExcluirContato(contato.id)}
                    disabled={carregando}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GerenciarContatos;