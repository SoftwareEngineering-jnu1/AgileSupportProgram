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
  stop: string;
  start: string;
  continueAction: string;
}

interface User {
  username: string;
  email: string;
}

const MyPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [reviewData, setReviewData] = useState<{ [key: number]: ReviewData[]}>({});
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedSprints, setSubmittedSprints] = useState<string[]>([]);

  const openModal = () => setIsModalOpen(true); 
  const closeModal = () => setIsModalOpen(false);

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
    const memberId = Cookies.get("memberId");
    const epicId = Cookies.get(`project_${projectId}_epicId`);
    try {
      const token = Cookies.get("status");
      const response = await fetchInstance.get(
      `/members/${memberId}/${epicId}`, {
        headers: { Authorization: `Bearer ${token}`}
      }
    ); 
      const review = (response.data.data.reviewDto || []);
      console.log("리뷰데이터 불러오기 성공", response.data.data);
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
    projects.forEach(project => fetchReviewData(project.projectId));
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
              {submittedSprints.length > 0 ? (
                submittedSprints.map((sprintName, index) => (
                  <div className={style.rivewdiv} onClick={openModal}>
                    <p className={style.sprintname}>{sprintName}</p>
                  </div>
                ))
              ) : (
                <p>리뷰가 제출되지 않았음</p>
              )}
              <div className={style.rivewdiv} onClick={openModal}>
                <p className={style.sprintname}>스프린트 이름 1</p>
              </div>
            </div>        
          </div>
        </div>

        <div className={style.spacer}></div> 
      </div>
        {isModalOpen && (
          <div className={style.modal} onClick={closeModal}>
            <div className={style.modalContent}>
              <span className={style.close} onClick={closeModal}>&times;</span>
              <div className={style.modalBody}>
                <div className={style.modaltitle}>Start</div>
                <div className={style.modaltitle}>Start</div>
                <div className={style.modaltitle}>Continue</div>
              </div>
              <div className={style.modalBody}>
                <div className={style.stopDiv}></div>
                <div className={style.startDiv}></div>
                <div className={style.continueDiv}></div>
              </div>
            </div>

          </div>
        )}
    </div>
    
  );};export default MyPage;
