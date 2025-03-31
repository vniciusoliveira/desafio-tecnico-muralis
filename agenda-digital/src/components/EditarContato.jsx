import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../axios';
import '../styles/EditarContato.css';

const EditarContato = () => {
    const { clienteId, contatoId } = useParams();
    const navigate = useNavigate();
    const [contato, setContato] = useState({
      tipo: '',
      valor: '',
      observacao: ''
    });
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(true);
  
    useEffect(() => {
      const fetchContato = async () => {
        try {
          const response = await api.get(`/clientes/${clienteId}/contatos/${contatoId}`);
          
          console.log('Dados recebidos:', response.data);
          
          if (!response.data) {
            throw new Error('Contato não encontrado na resposta');
          }
          
          setContato(response.data);
          setErro('');
        } catch (error) {
          console.error('Erro completo:', error);
          console.error('Resposta do erro:', error.response);
          
          let mensagem = 'Erro ao carregar contato';
          if (error.response) {
            if (error.response.status === 404) {
              mensagem = 'Contato não encontrado (404)';
            } else if (error.response.data?.message) {
              mensagem = error.response.data.message;
            }
          }
          
          setErro(mensagem);
        } finally {
          setCarregando(false);
        }
      };
  
      fetchContato();
    }, [clienteId, contatoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContato({ ...contato, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    setSucesso('');

    try {
      await api.put(`/clientes/${clienteId}/contatos/${contatoId}`, contato);
      setSucesso('Contato atualizado com sucesso!');
      // Redireciona para a página de gerenciar contatos do cliente específico
      navigate(`/clientes/${clienteId}/contatos/adicionar`);
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      setErro(error.response?.data?.message || 'Erro ao atualizar contato');
    } finally {
      setCarregando(false);
    }
  };

  const aplicarMascaraTelefone = (valor) => {
    if (contato.tipo === 'Telefone') {
      return valor
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return valor;
  };

  const handleValorChange = (e) => {
    const valorFormatado = aplicarMascaraTelefone(e.target.value);
    setContato({ ...contato, valor: valorFormatado });
  };

  return (
    <div className="editar-contato-container">
      <h2>Editar Contato</h2>
      
      <form onSubmit={handleSubmit} className="editar-contato-form">
        <div className="form-group">
          <label>Tipo de Contato*</label>
          <select
            name="tipo"
            value={contato.tipo}
            onChange={handleChange}
            required
            disabled={carregando}
          >
            <option value="">Selecione o tipo</option>
            <option value="Telefone">Telefone</option>
            <option value="Email">E-mail</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            {contato.tipo === 'Telefone' ? 'Telefone*' : 'E-mail*'}
          </label>
          <input
            type={contato.tipo === 'Email' ? 'email' : 'text'}
            name="valor"
            value={contato.valor}
            onChange={handleValorChange}
            placeholder={
              contato.tipo === 'Telefone' ? '(99) 99999-9999' : 'exemplo@email.com'
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
            value={contato.observacao}
            onChange={handleChange}
            placeholder="Opcional"
            disabled={carregando}
          />
        </div>

        <div className="botoes-acoes">
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => navigate(`/clientes`)}
            disabled={carregando}
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            className="btn-salvar"
            disabled={carregando}
          >
            {carregando ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>

      {erro && <div className="mensagem-erro">{erro}</div>}
      {sucesso && <div className="mensagem-sucesso">{sucesso}</div>}
    </div>
  );
};

export default EditarContato;