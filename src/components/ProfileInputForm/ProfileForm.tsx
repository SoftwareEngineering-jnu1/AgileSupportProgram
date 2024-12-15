import React, { useState, useEffect } from "react";
import style from "./ProfileForm.module.css"; // CSS 파일 임포트
import { fetchInstance } from "@api/instance";
import Cookies from "js-cookie";

interface User {
  position: string;
  companyOrSchool: string;
  contactInfo: string;
}

const ProfileForm: React.FC = () => {
  const [user, setUser] = useState<User>({
    position: "",
    companyOrSchool: "",
    contactInfo: "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const memberId = Cookies.get("memberId");

  useEffect(() => {
    const fetchUserData = async () => {
      if (memberId) {
        try {
          const token = Cookies.get("token");
          const response = await fetchInstance.get(`/members/${memberId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userData = response.data.data;
          setUser({
            position: userData.position || "",
            companyOrSchool: userData.companyOrSchool || "",
            contactInfo: userData.contactInfo || "",
          });
          setIsEditing(false);
        } catch (error) {
          console.error("사용자 정보 가져오기 실패", error);
        }
      } else {
        console.error("memberId가 존재하지 않습니다.");
      }
    };
    fetchUserData();
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
        const token = Cookies.get("token");
        const response = await fetchInstance.post<User>(
          `/members/${memberId}/edit`,
          {
            position: user.position,
            companyOrSchool: user.companyOrSchool,
            contactInfo: user.contactInfo,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("유저 정보 저장 성공", response.data);
      } else {
        console.error("memberId가 존재하지 않습니다.");
      }
    } catch (error) {
      console.error("저장 실패", error);
    }
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div style={{ margin: "20px" }}>
      {isEditing ? (
        <form className={style.form} onSubmit={handleSave}>
          <span className={style.information}>정보</span>
          <div className={style.textdiv}>
            <img src="/images/직책.png" alt="logo" className={style.logo} />
            <input
              type="text"
              name="position"
              value={user.position}
              onChange={handleChange}
              placeholder="내 직책"
              className={style.input}
              required
            />
          </div>
          <div className={style.textdiv}>
            <img src="/images/소속.png" alt="logo" className={style.logo} />
            <input
              type="text"
              name="companyOrSchool"
              value={user.companyOrSchool}
              onChange={handleChange}
              placeholder="내 직장 또는 학교"
              className={style.input}
              required
            ></input>
          </div>
          <div className={style.textdiv}>
            <img src="/images/연락처.png" alt="logo" className={style.logo} />
            <input
              type="email"
              name="contactInfo"
              value={user.contactInfo}
              onChange={handleChange}
              placeholder="연락처"
              className={style.input}
              required
            />
          </div>
          <button className={style.button} onClick={handleSave}>
            프로필 저장
          </button>
        </form>
      ) : (
        <div>
          <form className={style.form}>
            <span className={style.information}>정보</span>
            <div className={style.textdiv}>
              <img src="/images/직책.png" alt="logo" className={style.logo} />
              <span className={style.span}>{user.position}</span>
            </div>
            <div className={style.textdiv}>
              <img src="/images/소속.png" alt="logo" className={style.logo} />
              <span className={style.span}>{user.companyOrSchool}</span>
            </div>
            <div className={style.textdiv}>
              <img src="/images/연락처.png" alt="logo" className={style.logo} />
              <span className={style.span}>{user.contactInfo}</span>
            </div>
            <button className={style.button} onClick={handleEdit}>
              프로필 수정
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default ProfileForm;
