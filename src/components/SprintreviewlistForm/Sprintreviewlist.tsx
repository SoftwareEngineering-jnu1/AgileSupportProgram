import React from 'react';
import style from './Sprintreviewlist.module.css';

const Sprintreviewlist: React.FC = () => {

    return (
      <div className={style.splistcontainer}>
          <span className={style.title}>내 스프린트 리뷰 목록</span>

        <div className={style.sprintrivewlistdiv}>
        <div className={style.rivewdiv}>
            <p className={style.sprintname}>스프린트 이름 1</p>
          </div>
          <div className={style.rivewdiv}>
            <p className={style.sprintname}>스프린트 이름 2</p>
          </div>
          <div className={style.rivewdiv}>
            <p className={style.sprintname}>스프린트 이름 3</p>
          </div>
          <div className={style.rivewdiv}>
            <p className={style.sprintname}>스프린트 이름 4</p>
          </div>
          <div className={style.rivewdiv}>
            <p className={style.sprintname}>스프린트 이름 5</p>
          </div>
        </div>
        
      </div>
      
    );};export default Sprintreviewlist;