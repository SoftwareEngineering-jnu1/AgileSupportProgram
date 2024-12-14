import React, {useEffect, useState} from 'react';
import { FaUserCircle } from "react-icons/fa";
import ProfileForm from '../../components/ProfileInputForm/ProfileForm';
import Projectlist from '../../components/ProjectlistForm/Projectlist';
import style from './MyPage.module.css';
import LogoutButton from '@components/LogoutButton/LogoutButton';



import { fetchInstance } from "@api/instance"; 
import Cookies from "js-cookie";
import { AxiosError } from 'axios';

interface SprintRetrospective {
  number: number;
  value: string | null;
}
interface ReviewData {
  stop: string[];
  start: string[];
  continueAction: string[];
}

interface User {
  username: string;
  email: string;
}

const MyPage: React.FC = () => {
  const [sprintRetrospectives, setSprintRetrospectives] = useState<SprintRetrospective[]>([]);
  const [reviewData, setReviewData] = useState<{ [epicId: number]: ReviewData}>({});
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);

  const openModal = (number: number) => {
    const projectReview = reviewData[number];
    if (projectReview) { 
      setSelectedReview(projectReview); 
      setIsModalOpen(true); 
    } else { 
      console.error("리뷰 데이터가 없음"); 
    } 
  };
  const closeModal = () => { setIsModalOpen(false); setSelectedReview(null); };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        const memberId = Cookies.get("memberId");
        const response = await fetchInstance.get(`/members/${memberId}`, {
          headers: {Authrization: `Bearer ${token}`}
        });
        setUser(response.data.data); 
        console.log("이름 가져오기 성공", response.data)

        const sprintRetrospective = response.data.data.sprintRetrospective;
        const sprintRetrospectiveArray = Object.entries(sprintRetrospective).map(([key, value]) => ({
            number: Number(key),
            value: value as string | null
        }));
        setSprintRetrospectives(sprintRetrospectiveArray);
        console.log("스프린트 회고 가져오기 성공", sprintRetrospectiveArray);
      } catch (error) {
        console.error("유저 정보 가져오기 실패", error);
      }
    };
    fetchUserData();
  }, []);
      
  const fetchReviewData = async (epicId: number) => {
    const memberId = Cookies.get("memberId")
    try {
      const token = Cookies.get("token");
      const response = await fetchInstance.get(
      `/members/${memberId}/${epicId}`, {
        headers: { Authorization: `Bearer ${token}`}
      }
    ); 
      const review = response.data.data; 
      console.log("리뷰데이터 불러오기 성공", review);
      console.log(reviewData);
      console.log(reviewData[2]);
      console.log(reviewData[3]);

      setReviewData((prevData) => ({ 
        ...prevData,
        [epicId]: review     
      }));
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("리뷰데이터 불러오기 실패:", error);
      console.error("에러 상세:", axiosError.response ? axiosError.response.data : axiosError.message);
    }
  } 
  useEffect(() => {
    sprintRetrospectives.forEach(sprint => {
        fetchReviewData(sprint.number);
    });
  }, [sprintRetrospectives]);
     

  return (
    <div className={style.div}>
      <div className={style.containeruser}>
        <div className={style.usercircle}><FaUserCircle size={200}/></div>
        {user ? (
          <span className={style.name}>{user.username}</span>
        ) : (<p>이름</p>)}
        <div className={style.profilediv}><ProfileForm/></div>
        <div className={style.logoutbutton}><LogoutButton/></div>
      </div>
      
      <div className={style.containerlist}>
        <div className={style.projectlistdiv}><Projectlist/></div>

        <div className={style.sprintlistdiv}>
          <div className={style.splistcontainer}>
            <span className={style.title}>내 스프린트 리뷰 목록</span>
              
            <div className={style.sprintrivewlistdiv}>
              {Object.keys(reviewData).length > 0 ? (
                sprintRetrospectives
                .filter(sprint => reviewData[sprint.number])
                .map((sprint) => (
                  <div className={style.reviewdiv } 
                       onClick={() => openModal(sprint.number)} 
                       key={sprint.number}
                      >
                    <p className={style.sprintname}>
                      {sprint.value}</p>
                  </div>
                ))
              ) : (
                <p>제출된 스프린트 리뷰가 존재하지 않습니다.</p>
              )}
              
            </div>        
          </div>
        </div>

        <div className={style.spacer}></div> 
      </div>
        {isModalOpen && selectedReview && (
          <div className={style.modal} >
            <div className={style.modalContent}>
              <span className={style.close} onClick={closeModal}>&times;</span>
              <div className={style.modalBody}>
                <div className={style.modaltitle}>Stop</div>
                <div className={style.modaltitle}>Start</div>
                <div className={style.modaltitle}>Continue</div> 
              </div>
              <div className={style.modalBody}>
              <div className={style.stopDiv}>
                {selectedReview.stop.map((stopItem, index) => ( 
                  stopItem && <div className={style.Div}>{stopItem}</div>
                ))} </div>
                <div className={style.startDiv}>
                {selectedReview.start.map((startItem, index) => ( 
                  startItem && <div key={index} className={style.Div}>{startItem}</div>
                ))} </div>
                <div className={style.continueDiv}>
                {selectedReview.continueAction.map((continueItem, index) => ( 
                  continueItem && <div key={index} className={style.Div}>{continueItem}</div>
                ))} </div>
              </div>

            </div>
          </div>
        )}
    </div>
    
  );};export default MyPage;
