import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Projectlist.module.css';

const Projectlist: React.FC = () => {
  const navigate = useNavigate();



  return (
    <div>
        <span>내 프로젝트 목록</span>
        <p className={style.projectLink} onClick={() => navigate('/project')}>모두보기</p>
    </div>
    
  );};export default Projectlist;