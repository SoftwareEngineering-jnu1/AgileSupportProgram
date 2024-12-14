import React, { useState, useEffect } from 'react';
import style from './ProfileForm.module.css';  // CSS 파일 임포트
import { fetchInstance } from "@api/instance";
import Cookies from "js-cookie";

interface User {
  position: string;
  company: string;
  email: string;
}

const ProfileForm: React.FC = () => {
  const [user, setUser] = useState<User>({ position: '', company: '', email: '' });
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [savedUser, setSavedUser] = useState<User>();
  const memberId = Cookies.get("memberId");

  useEffect(() => {
    if(memberId) {
      const savedUserData = localStorage.getItem(`user_${memberId}`);
      if (savedUserData) {
        const parsedUser = JSON.parse(savedUserData);
        setUser(parsedUser);
        setSavedUser(parsedUser);
        setIsEditing(false);
      }
    }
  }, [memberId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (memberId) {
        const response = await fetchInstance
        .post<User>(`/members/${memberId}/edit`, {
          Position: user.position,
          Company: user.company,
          Email: user.email,
        });
        console.log('유저 정보 저장 성공', response.data);
        console.log({memberId});
        localStorage.setItem(`user_${memberId}`, JSON.stringify(user));
      } else {
        console.error('memberId가 존재하지 않습니다.');
      }
    } catch (error) {
      console.error('저장 실패', error);
    }
    setSavedUser(user);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return ( 
  <div style={{ margin: '20px' }}>  
  {isEditing ? ( 
    <form className={style.form}> 
    <span className={style.information}>정보</span>
      <div className={style.textdiv}> 
      <img src="/images/직책.png" alt="logo" className={style.logo}/>
        <input 
        type="text" 
        name="position" 
        value={user.position} 
        onChange={handleChange} 
        placeholder="내 직책"
        className={style.input} 
        required/> 
       </div> 
      <div className={style.textdiv}>
      <img src="/images/소속.png" alt="logo" className={style.logo}/>
        <input 
          type="text" 
          name="company"
          value={user.company} 
          onChange={handleChange} 
          placeholder="내 직장 또는 학교"
          className={style.input} 
          required></input>
       </div>
      <div className={style.textdiv}> 
      <img src="/images/연락처.png" alt="logo" className={style.logo}/>
        <input 
          type="email" 
          name="email" 
          value={user.email} 
          onChange={handleChange} 
          placeholder="연락처"
          className={style.input} 
          required /> 
        </div> 
      <button className={style.button} onClick={handleSave}>프로필 저장</button> 
    </form> 
         ) : ( <div> 
          {savedUser ? ( 
            <form className={style.form}> 
              <span className={style.information}>정보</span>
            <div className={style.textdiv}>
              <img src="/images/직책.png" alt="logo" className={style.logo}/>
              <span className={style.span}>{savedUser.position}</span>
            </div>
            <div className={style.textdiv}>
              <img src="/images/소속.png" alt="logo" className={style.logo}/>
              <span className={style.span}>{savedUser.company}</span>
            </div>
            <div className={style.textdiv}>
              <img src="/images/연락처.png" alt="logo" className={style.logo}/>
              <span className={style.span}>{savedUser.email}</span>
            </div>
              <button className={style.button} onClick={handleEdit}>프로필 수정</button> </form>
           ) : (
            <p>No user information saved.</p> 
        )} 
     </div> 
    )}
  </div> 
 ); 
};
export default ProfileForm;