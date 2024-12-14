import React, {useEffect, useState} from 'react';
import { FaUserCircle } from "react-icons/fa";
import ProfileForm from '../../components/ProfileInputForm/ProfileForm';
import Projectlist from '../../components/ProjectlistForm/Projectlist';
import style from './MyPage.module.css';
import LogoutButton from '@components/LogoutButton/LogoutButton';



import { fetchInstance } from "@api/instance"; 
import Cookies from "js-cookie";
import { AxiosError } from 'axios';

interface ProjectResponse {
  projectId: number;
  totalEpics: number;
  projectName: string;
}
interface ReviewData {
  epicId: number;
  Id: number;
  sprintName: string;
  stop: string[];
  start: string[];
  continueAction: string[];
}

interface User {
  username: string;
  email: string;
}

const MyPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [reviewData, setReviewData] = useState< ReviewData[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);

  const openModal = (epicId: number) => {
    const projectReview = reviewData[epicId];
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
      } catch (error) {
        console.error("유저 정보 가져오기 실패", error);
      }
    };
    fetchUserData();
  }, []);

  const fetchProjects = () => {
      const memberId = Cookies.get("memberId");
      fetchInstance
        .get<{status: String; data: Record<string, ProjectResponse> }>(`/projects/${memberId}`)
        .then((response) => {
          console.log("프로젝트 정보 호출 성공", response.data);
          const projectList = Object.entries(response.data.data).map(([projectName, projectDetails]) => ({
            ...projectDetails,
            projectName,
          }));
          setProjects(projectList);
        })
        .catch((error) => {
          console.log("프로젝트 정보 호출 실패", error);
        });
    }
    useEffect(() => {
      fetchProjects();
    }, []);


      
  const fetchReviewData = async (projectId: number) => {
    const epicId = Cookies.get(`project_${projectId}_epicId`);
    try {
      const token = Cookies.get("token");
      const response = await fetchInstance.post(
      `/project/${projectId}/kanbanboard/${epicId}/review`, {}, {
        headers: { Authorization: `Bearer ${token}`}
      }
    ); 
      const review = response.data.data; 
      console.log("리뷰데이터 불러오기 성공", review);

      setReviewData((prevData) => ({ 
        ...prevData,
        [projectId]: review     
      }));
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("리뷰데이터 불러오기 실패:", error);
      console.error("에러 상세:", axiosError.response ? axiosError.response.data : axiosError.message);
    }
  } 
  useEffect(() => {
    const epicIdSet = new Set<number>();

    projects.forEach(project => {
      const epicId = Number(Cookies.get(`project_${project.projectId}_epicId`));
      if (!epicIdSet.has(epicId)) {
        fetchReviewData(project.projectId);
        epicIdSet.add(epicId);
      }
    });
  }, [projects]);
     

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
                Object.entries(reviewData).map(([epicId, review]) => (
                  <div className={style.reviewdiv } 
                       onClick={() => openModal(Number(epicId))} 
                       key={epicId}
                      >
                    <p className={style.sprintname}>{review.sprintName}</p>
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
