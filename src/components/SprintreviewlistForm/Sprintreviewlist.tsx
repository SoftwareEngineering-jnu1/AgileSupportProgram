import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Sprintreviewlist.module.css';

const Sprintreviewlist: React.FC = () => {
  const [isModalOpen, setIsModalOpen]= useState(false);

  const handleOpenModal = (event: React.FormEvent) => {
    event?.preventDefault();
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

    return (
      <div className={style.splistcontainer}>
          <span className={style.span}>내 스프린트 리뷰 목록</span>
          <div className={style.rivewdiv} onClick={handleOpenModal}>
            <p className={style.sprintname}>스프린트 이름 1</p>
          </div>
          <div className={style.rivewdiv} onClick={handleOpenModal}>
            <p className={style.sprintname}>스프린트 이름 2</p>
          </div>
          <div className={style.rivewdiv} onClick={handleOpenModal}>
            <p className={style.sprintname}>스프린트 이름 3</p>
          </div>
          <div className={style.rivewdiv} onClick={handleOpenModal}>
            <p className={style.sprintname}>스프린트 이름 4</p>
          </div>

          {isModalOpen && ( 
            <div className={style.modal}>
              <div className={style.modalcontent}>
                <span className="close" onClick={handleCloseModal}>&times;</span>
                <h2>memo</h2>
                <textarea placeholder="Write your memo here..."></textarea>
                <button onClick={handleCloseModal}>Close</button>
              </div> {/* 메모장이 아닌 스프린트 리뷰창이 열리도록 수정 필요 */}
            </div>
          )}
      </div>
      
    );};export default Sprintreviewlist;