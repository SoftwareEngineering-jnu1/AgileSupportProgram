import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Projectlist.module.css';
import { MdDirectionsRun } from "react-icons/md"; /*진행중 아이콘*/

import Cookies from "js-cookie";
import { fetchInstance } from '@api/instance';

interface ProjectResponse {
  projectId: number;
  totalEpics: number;
  completedEpics: number;
  projectName: string;
}

type Issue = {
  issueId: number;
  issueTitle: string;
  mainMemberNameAndColor: Record<string, string>;
  progressStatus: string;
}

const Projectlist: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [projectIssues, setProjectIssues] = useState<{ [key: number]: Issue[]}>({});

  const fetchProjects = () => {
    const memberId = Cookies.get("memberId");
    fetchInstance
      .get<{status: String; data: Record<string, ProjectResponse> }>(`/projects/${memberId}`)
      .then((response) => {
        console.log("프로젝트 목록 호출 성공", response.data);
        const projectList = Object.entries(response.data.data).map(([projectName, projectDetails]) => ({
          ...projectDetails,
          projectName,
        }));
        setProjects(projectList);
      })
      .catch((error) => {
        console.log("프로젝트 목록 호출 실패", error);
      });
  }
  useEffect(() => {
    fetchProjects();
  }, []);
  
    const fetchIssues = async (projectId: number) => {
      try {
        const token = Cookies.get("status");
        const epicId = Cookies.get(`project_${projectId}_epicId`);
        const response = await fetchInstance.get(
          `/project/${projectId}/kanbanboard/${epicId}`, {
            headers: { Authorization: `Bearer ${token}`}
          });
        console.log("이슈 불러오기 성공", response.data.data);
        const issues = (response.data.data.kanbanboardIssueDTO || []).filter(
          (issue: Issue) => issue.progressStatus === "In Progress"
        );
        setProjectIssues(prev => ({ ...prev, [projectId]: issues }));
      } catch (error) {
        console.error("이슈 불러오기 실패:", error);
      }
    }
    useEffect(() => {
      projects.forEach(project => fetchIssues(project.projectId));
    }, [projects]);

  return (
    <div className={style.div}>
      <div className={style.textcontainer}>
        <span className={style.title}>내 프로젝트 목록</span>
        <p className={style.projectLink} onClick={() => navigate('/project')}>모두보기</p>
      </div>

        {projects.length > 0 ? (
          <div className={style.projectlistdiv}>
            {projects.map((project)=> (
              <div className={style.projectdiv}>
                <span className={style.projectname} key={project.projectId}>{project.projectName}</span>

                {projectIssues[project.projectId]?.length > 0 ? (
                  <div>
                  {projectIssues[project.projectId].map((issue) => (
                    <div className={style.epic}>
                      <MdDirectionsRun color="#0099FF" style={{ marginRight: "10px"}}/>
                      <span key={issue.issueId} className={style.epicname}>{issue.issueTitle}</span>
                    </div>
                    ))}
                  </div>
                  
                ) : (
                  <p>진행중인 이슈가 없습니다.</p>
                )}

              </div>
            ))}
          </div>
        ): (
          <p>생성한 프로젝트가 존재하지 않습니다.</p>
        )} 
    </div>
    
  );};export default Projectlist;