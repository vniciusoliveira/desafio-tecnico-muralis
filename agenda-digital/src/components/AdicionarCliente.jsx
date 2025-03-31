import React, { useState } from 'react';
import api from '../../axios';
import '../styles/AdicionarCliente.css';

const AdicionarCliente = () => {
  const [cliente, setCliente] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    endereco: ''
  });
  const [isDateValid, setIsDateValid] = useState(true);
  const [isCpfValid, setIsCpfValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    return cpf.length === 11;
  };

  const formatDateForBackend = (date) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setCliente({ ...cliente, cpf: value });
    setIsCpfValid(validateCPF(value));
  };

  const handleDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 2 && value.length <= 4) {
      value = value.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    } else if (value.length > 4 && value.length <= 8) {
      value = value.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    }

    setCliente({ ...cliente, dataNascimento: value });

    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
    setIsDateValid(datePattern.test(value) && value.length === 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!cliente.nome || !cliente.cpf || !cliente.dataNascimento || !cliente.endereco) {
      setErrorMessage('Todos os campos obrigatórios devem ser preenchidos!');
      setIsLoading(false);
      return;
    }

    if (!isDateValid || !isCpfValid) {
      setErrorMessage('Por favor, verifique os campos destacados em vermelho.');
      setIsLoading(false);
      return;
    }

    try {
      const clienteToSend = {
        nome: cliente.nome.trim(),
        cpf: cliente.cpf,
        dataNascimento: formatDateForBackend(cliente.dataNascimento),
        endereco: cliente.endereco.trim()
      };

      const response = await api.post('/clientes', clienteToSend);
      
      if (response.status === 201) {
        setSuccessMessage('Cliente cadastrado com sucesso!');
        setCliente({
          nome: '',
          cpf: '',
          dataNascimento: '',
          endereco: ''
        });
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error.response?.data || error.message);
      
      if (error.response) {
        if (error.response.status === 400 && (
          error.response.data.includes("CPF já cadastrado") || 
          error.response.data.includes("CPF já está cadastrado")
        )) {
          setErrorMessage('Este CPF já está cadastrado no sistema!');
        } else {
          setErrorMessage(error.response.data || 'Erro ao cadastrar cliente');
        }
      } else {
        setErrorMessage('Não foi possível conectar ao servidor');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="adicionar-cliente">
      <h1>Adicionar Cliente</h1>
      <form onSubmit={handleSubmit} className="adicionar-cliente-form">
        <div className="form-group">
          <label htmlFor="nome">Nome*</label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Nome completo"
            value={cliente.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cpf">CPF* (apenas números)</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            placeholder="12345678909"
            value={cliente.cpf}
            onChange={handleCpfChange}
            required
            className={`cpf-input ${isCpfValid ? '' : 'invalid'}`}
          />
          {!isCpfValid && <span className="error-text">CPF deve ter 11 números</span>}
        </div>

        <div className="form-group">
          <label htmlFor="dataNascimento">Data de Nascimento*</label>
          <input
            type="text"
            id="dataNascimento"
            name="dataNascimento"
            placeholder="DD/MM/AAAA"
            value={cliente.dataNascimento}
            onChange={handleDateChange}
            className={`date-input ${isDateValid ? '' : 'invalid'}`}
            required
          />
          {!isDateValid && <span className="error-text">Formato inválido (DD/MM/AAAA)</span>}
        </div>

        <div className="form-group">
          <label htmlFor="endereco">Endereço*</label>
          <input
            type="text"
            id="endereco"
            name="endereco"
            placeholder="Endereço completo"
            value={cliente.endereco}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>

      {errorMessage && (
        <div className="message error">
          <span className="icon">⚠️</span> {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="message success">
          <span className="icon">✓</span> {successMessage}
        </div>
      )}
    </div>
  );
};

export default AdicionarCliente;