import React, { useState, useEffect } from 'react';
import api from '../../axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/EditarCliente.css';

const EditarCliente = () => {
  const [cliente, setCliente] = useState({ nome: '', email: '', cpf: '', dataNascimento: '', endereco: '', contatos: [] });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await api.get(`/clientes/${id}`);
        setCliente(response.data);
      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
      }
    };
    fetchCliente();
  }, [id]);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/clientes/${id}`, cliente);
      alert('Cliente atualizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
    }
  };

  return (
    <div className="editar-cliente">
      <h1>Editar Cliente</h1>
      <form onSubmit={handleSubmit} className="editar-cliente-form">
        <input type="text" name="nome" placeholder="Nome" value={cliente.nome} onChange={handleChange} />
        <input type="text" name="cpf" placeholder="CPF" value={cliente.cpf} onChange={handleChange} />
        <input type="date" name="dataNascimento" placeholder="Data de Nascimento" value={cliente.dataNascimento} onChange={handleChange} />
        <input type="text" name="endereco" placeholder="Endereço" value={cliente.endereco} onChange={handleChange} />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditarCliente;
