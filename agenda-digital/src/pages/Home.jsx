import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Bem-vindo à Agenda Digital</h1>
      <div className="home-buttons">
        <button onClick={() => navigate('/adicionar')}>Cadastrar Cliente</button>
        <button onClick={() => navigate('/clientes')}>Listar Clientes</button>
      </div>
    </div>
  );
};

export default Home;
