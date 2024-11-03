import React from "react";
import { useNavigate } from 'react-router-dom';


const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginPage = () => {
    navigate('/login');
  };

  return ( <div>
    <h1>Home Page</h1>
    <button onClick={handleLoginPage}>Go to Login</button>
    </div> );
};

export default Home;
