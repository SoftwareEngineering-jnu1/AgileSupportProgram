import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./SignUp.module.css";
import { fetchInstance } from "@api/instance";

interface SignupProps {
  username: string;
  email: string;
  password: string;
  confirmpassword: string;
}

const SignUpPage: React.FC = () => {
  const [form, setFrom] = useState<SignupProps>({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
 

  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrom({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmpassword) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }
    fetchInstance
      .post<SignupProps[]>(`/join`, 
        {username: form.username, emailId: form.email, password: form.password},
      )
      .then((response) => {
        console.log("Form Data:", form);
        console.log("회원가입 성공", response.data)
        alert("회원가입이 완료되었습니다!");
      navigate("/login");
      })
      .catch((error) => {
        console.log("회원가입 실패")
      });
  };

  return (
  <form className={style.form} onSubmit={handleSubmit}>
    <div className={style.logodiv}>
      <img src="/images/로고.png" alt="logo" className={style.logo}/>
      <span className={style.logoText}>회원가입</span>
      </div>
    <div className={style.div}>
      <label className={style.label} htmlFor="username"></label>
      <input
        type="text"
        id="username"
        name="username"
        value={form.username}
        onChange={handleChange}
        className={style.input}
        placeholder="이름"
        required/>
    </div>
    <div className={style.div}>
      <label className={style.label} htmlFor="email"></label>
      <input
        type="text"
        id="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        className={style.input}
        placeholder="이메일 또는 아이디"
        required/>
    </div>
    <div className={style.div}>
      <label className={style.label} htmlFor="password"></label>
      <input
        type="password"
        id="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        className={style.input}
        placeholder="비밀번호"
        required/>
    </div>
    <div className={style.div}>
      <label className={style.label} htmlFor="confirmPassword"></label>
      <input
        type="password"
        id="confirmpassword"
        name="confirmpassword"
        value={form.confirmpassword}
        onChange={handleChange}
        className={style.input}
        placeholder="비밀번호 확인"
        required/>
    </div>
    <button className={style.button} type="submit">회원가입 </button> 
    <div className={style.gologin}>
      <span className={style.span}>이미 계정이 있으신가요?</span>
      <p className={style.loginLink} onClick={() => navigate('/login')}>로그인 하러 가기</p>
    </div>
    </form>
  );
};

export default SignUpPage;
