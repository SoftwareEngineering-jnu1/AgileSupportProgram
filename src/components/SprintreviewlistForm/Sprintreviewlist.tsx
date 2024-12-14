import React, {useState, useEffect} from 'react';
import style from './Sprintreviewlist.module.css';

import { useProject } from "@context/ProjectContext";
import { fetchInstance } from "@api/instance";
import Cookies from "js-cookie";

const Sprintreviewlist: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<string | null>(null);
  const memberId = Cookies.get("memberId");
  const { projectId } = useProject();
  const epicId = Cookies.get(`project_${projectId}_epicId`);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

    return (
      <div className={style.splistcontainer}>
          <span className={style.title}>내 스프린트 리뷰 목록</span>

        <div className={style.sprintrivewlistdiv}>
          <div className={style.rivewdiv} onClick={openModal}>
            <p className={style.sprintname}>스프린트 이름 1</p>
          </div>
        </div>
        
      </div>
      
    );};export default Sprintreviewlist;