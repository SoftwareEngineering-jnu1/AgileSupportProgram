import React from 'react';
import { FaUserCircle } from "react-icons/fa";
import ProfileForm from '../../components/ProfileInputForm/ProfileForm';
import Projectlist from '../../components/ProjectlistForm/Projectlist';
import style from './MyPage.module.css';
import Sprintreviewlist from '@components/SprintreviewlistForm/Sprintreviewlist';

const MyPage: React.FC = () => {
  return (
    <div className={style.div}>
      <div className={style.containeruser}>
        <div className={style.usercircle}><FaUserCircle size={200}/></div>
        <span className={style.name}>이름</span> {/*로그인 정보를 바탕으로 이름 정보 가져오기*/}
        <div className={style.profilediv}><ProfileForm/></div>
      </div>
      
      <div className={style.containerlist}>
        <div className={style.projectlistdiv}><Projectlist/></div>
        <div className={style.sprintlistdiv}><Sprintreviewlist/></div>
        <div className={style.spacer}></div>  {/*하단공백*/}
      </div>
    </div>
    
  );};export default MyPage;