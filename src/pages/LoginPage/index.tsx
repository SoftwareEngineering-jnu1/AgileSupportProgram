import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { fetchInstance } from "@api/instance";
import Cookies from "js-cookie";

interface LoginProps {
  username: string;
  password: string;
}

interface LoginResponse {
  data: string;
  status: string;
}

const LoginPage: React.FC = () => {
  const [form, setForm] = useState<LoginProps>({ username: "", password: "" });

  const navigate = useNavigate();
  const handleSignUpPage = () => {
    navigate("/signup");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInstance
      .post<LoginResponse>(`/login`, {
        emailId: form.username,
        password: form.password,
      })
      .then((response) => {
        console.log("Form Data:", form);
        console.log("로그인 성공", response.data);
        Cookies.set("memberId", response.data.data);
        navigate("/project");
      })
      .catch((error) => {
        alert("계정이 존재하지 않거나 비밀번호가 일치하지 않습니다.");
        console.log("로그인 실패");
      });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.logodiv}>
        <img src="/images/로고.png" alt="logo" className={styles.logo} />
        <span className={styles.logoText}>로그인</span>
      </div>

      <div className={styles.div}>
        <label className={styles.label} htmlFor="username"></label>
        <input
          type="text"
          id="username"
          name="username"
          value={form.username}
          onChange={handleChange}
          className={styles.input}
          placeholder="이메일 또는 아이디"
        />
      </div>
      <div className={styles.div}>
        <label className={styles.label} htmlFor="password"></label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className={styles.input}
          placeholder="비밀번호"
          required
        />
      </div>
      <button className={styles.loginbutton} type="submit">
        로그인
      </button>
      <button className={styles.signupbutton} onClick={handleSignUpPage}>
        회원가입
      </button>
    </form>
  );
};

export default LoginPage;
