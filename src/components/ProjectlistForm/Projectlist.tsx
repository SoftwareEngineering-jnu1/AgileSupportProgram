import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Projectlist.module.css';
import { MdDirectionsRun } from "react-icons/md"; /*진행중 아이콘*/
import { FaCheckCircle } from "react-icons/fa"; /*완료 아이콘*/

const Projectlist: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={style.div}>
      <div className={style.textcontainer}>
        <span className={style.title}>내 프로젝트 목록</span>
        <p className={style.projectLink} onClick={() => navigate('/project')}>모두보기</p>
      </div>

      <div className={style.projectlistdiv}>
      <div className={style.projectdiv}> {/*프로젝트 안에 들어갈 목록들 생각*/}
        <span className={style.projectname}>프로젝트 이름 1</span>
        <div className={style.epic}>
          <MdDirectionsRun color="#0099FF" style={{ marginRight: "10px"}}/>
          <span className={style.epicname}>노션 일정정하기</span>
        </div>
        <div className={style.epic}>
          <FaCheckCircle color="#6FC349" style={{ marginRight: "10px"}}/>
          <span className={style.epicname}>노션 일정정하기</span>
        </div>
      </div>

      <div className={style.projectdiv}>
        <span className={style.projectname}>프로젝트 이름 2</span>
        <div className={style.epic}>
          <MdDirectionsRun color="#0099FF" style={{ marginRight: "10px"}}/>
          <span className={style.epicname}>노션 일정정하기</span>
        </div>
        <div className={style.epic}>
          <FaCheckCircle color="#6FC349" style={{ marginRight: "10px"}}/>
          <span className={style.epicname}>노션 일정정하기</span>
        </div>
      </div>

      <div className={style.projectdiv}>
        <span className={style.projectname}>프로젝트 이름 3</span>
        <div className={style.epic}>
          <MdDirectionsRun color="#0099FF" style={{ marginRight: "10px"}}/>
          <span className={style.epicname}>노션 일정정하기</span>
        </div>
        <div className={style.epic}>
          <FaCheckCircle color="#6FC349" style={{ marginRight: "10px"}}/>
          <span className={style.epicname}>노션 일정정하기</span>
        </div>
      </div>

      <div className={style.projectdiv}>
        <span className={style.projectname}>프로젝트 이름 4</span>
        <div className={style.epic}>
          <MdDirectionsRun color="#0099FF" style={{ marginRight: "10px"}}/>
          <span className={style.epicname}>노션 일정정하기</span>
        </div>
        <div className={style.epic}>
          <FaCheckCircle color="#6FC349" style={{ marginRight: "10px"}}/>
          <span className={style.epicname}>노션 일정정하기</span>
        </div>
      </div>
      </div>

    </div>
    
  );};export default Projectlist;