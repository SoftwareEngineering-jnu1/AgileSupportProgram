import React, { useState } from 'react';
import ProfileForm from '../../components/ProfileInputForm/ProfileForm';
import Projectlist from '../../components/ProjectlistForm/Projectlist';
import style from './MyPage.module.css';

const MyPage: React.FC = () => {
  return (
    
    <div> 
    <div className={style.profilediv}><ProfileForm/></div> 
    <div className={style.projectdiv}><Projectlist/></div>
    </div>
    
  );};export default MyPage;