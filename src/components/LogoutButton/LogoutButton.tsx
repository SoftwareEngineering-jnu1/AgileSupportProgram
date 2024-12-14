import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchInstance } from '@api/instance';
import style from './LogoutButton.module.css';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetchInstance.post('/logout');
      alert('로그아웃 되었습니다.');
      navigate('/login'); // 로그인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 실패', error);
    }
  };

  return (
    <button className={style.logout} onClick={handleLogout}>
      로그아웃
    </button>
  );
};

export default LogoutButton;
