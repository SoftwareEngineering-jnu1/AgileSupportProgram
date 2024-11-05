import React from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./Home.module.css";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginPage = () => {
    navigate('/login');
  };
  const handleSignUpPage = () => {
    navigate('/signup');
  };

  return ( 
  <div className={styles.homediv}>
    <img src="/로고.png" alt="logo" className={styles.logo}/>
    <div className={styles.hometext}>
      <div className={styles.lefttext}>팀 프로젝트를<br/>더 효율적으로 관리<br/></div>
      <div className={styles.righttext}>프로젝트를<br/>한눈에 볼 수 있게</div>
    </div>
      <button className={styles.button} onClick={handleLoginPage}>로그인</button>
      <button className={styles.button} onClick={handleSignUpPage}>회원가입</button>
  </div>
    );
};

export default Home;