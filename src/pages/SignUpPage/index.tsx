import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./SignUp.module.css";

interface SignupProps {
  username: string;
  emailOrphone: string;
  password: string;
  confirmpassword: string;
}

const SignUpPage: React.FC = () => {
  const [form, setFrom] = useState<SignupProps>({
    username: "",
    emailOrphone: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmpassword) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }
    console.log("Form Data:", form);
    navigate("/login");
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <div className={style.logodiv}>
        <img src="/로고.png" alt="logo" className={style.logo} />
        <span className={style.logoText}>로그인</span>
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
          placeholder="이름 또는 아이디"
          required
        />
      </div>
      <div className={style.div}>
        <label className={style.label} htmlFor="emailOrPhone"></label>
        <input
          type="text"
          id="emailOrphone"
          name="emailOrphone"
          value={form.emailOrphone}
          onChange={handleChange}
          className={style.input}
          placeholder="이메일 또는 전화번호"
          required
        />
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
          required
        />
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
          required
        />
      </div>
      <button className={style.button} type="submit">
        회원가입{" "}
      </button>
      <div className={style.gologin}>
        <span className={style.span}>이미 계정이 있으신가요?</span>
        <p className={style.loginLink} onClick={() => navigate("/login")}>
          로그인 하러 가기
        </p>
      </div>
    </form>
  );
};

export default SignUpPage;
