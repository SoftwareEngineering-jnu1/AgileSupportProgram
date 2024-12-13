import styled from "styled-components";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { RouterPath } from "@routes/path";
import Button from "@components/common/Button";

import { FaUserCircle } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa6";
import { FaArrowCircleRight } from "react-icons/fa";
import { MdOutlineTitle } from "react-icons/md";
import ProjectList from "./ProjectList";
import EmptyProject from "./EmptyProject";
import Modal from "@components/common/Modal";
import { fetchInstance } from "@api/instance";
import Cookies from "js-cookie";

interface ProjectResponse {
  projectId: number;
  totalEpics: number;
  completedEpics: number;
  projectName: string;
  totalMember: number;
}

interface APIResponse {
  status: string;
  data: Record<string, ProjectResponse>;
}

const ProjectListPage = () => {
  const emailId = Cookies.get("emailId")!;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);

  const [projectName, setProjectName] = useState("");
  const [membersEmailId, setMembersEmailId] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState(""); // 이메일 입력 상태

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  const handleAddEmail = () => {
    if (emailInput.trim()) {
      setMembersEmailId((prev) => [...prev, emailInput.trim()]);
      setEmailInput("");
    }
  };

  const toggleModal = () => {
    if (isModalOpen) {
      setProjectName("");
      setMembersEmailId([]);
      setEmailInput("");
    }
    setIsModalOpen(!isModalOpen);
  };

  const fetchProjects = () => {
    const memberId = Cookies.get("memberId");
    fetchInstance
      .get<APIResponse>(`/projects/${memberId}`)
      .then((response) => {
        const projectList: ProjectResponse[] = Object.entries(
          response.data.data
        ).map(([projectName, projectDetails]) => ({
          ...projectDetails,
          projectName,
        }));
        setProjects(projectList); // 프로젝트 리스트 업데이트
        console.log("프로젝트 목록 호출 성공", projectList);
      })
      .catch((error) => {
        console.log("프로젝트 목록 호출 실패", error);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = () => {
    const payload = {
      projectName,
      membersEmailId: [...membersEmailId, emailId],
    };
    fetchInstance
      .post("/project/new", payload)
      .then((response) => {
        console.log("프로젝트 생성 성공:", response.data);
        toggleModal();
        fetchProjects();
      })
      .catch((error) => {
        alert(error.data.data);
        console.error("프로젝트 생성 실패:", error);
      });
  };

  return (
    <Wrapper>
      <TopContainer>
        <Link to={RouterPath.myPage} style={{ color: "#000" }}>
          <FaUserCircle size={40} />
        </Link>
      </TopContainer>
      <MiddleContainer>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "35px", fontWeight: "bold" }}>
            프로젝트 목록
          </span>
          <Button
            padding="3px 10px"
            radius="50px"
            bgColor="#7895B2"
            color="#fff"
            style={{ fontWeight: "bold", height: "40px" }}
            onClick={toggleModal}
          >
            <FaCirclePlus size={30} />
            프로젝트 생성
          </Button>
        </div>
        <Divider />
      </MiddleContainer>
      {projects.length > 0 ? (
        <ProjectList projectList={projects} />
      ) : (
        <EmptyProject />
      )}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={toggleModal}>
          <h2>새 프로젝트를 생성하시겠습니까?</h2>
          <Content>
            <span>프로젝트 이름</span>
            <ProjectTitleWrapper>
              <ProjectTitleIcon />
              <ProjectTitleInput
                placeholder="프로젝트 이름을 입력해주세요"
                value={projectName}
                onChange={handleProjectNameChange}
              />
            </ProjectTitleWrapper>

            <span>팀원 이메일</span>
            <TeamEmailInputWrapper>
              <TeamEmailIcon />
              <TeamEmailInput
                placeholder="팀원의 이메일을 입력해주세요"
                value={emailInput}
                onChange={handleEmailInputChange}
              />
              <TeamEmailSubmit onClick={handleAddEmail} />
            </TeamEmailInputWrapper>
            <EmailList>
              {membersEmailId.map((email) => (
                <StyledLi>{email}</StyledLi>
              ))}
            </EmailList>
          </Content>
          <ButtonBox>
            <Button
              padding="6px 6px"
              bgColor="#7895B2"
              fontSize="16px"
              style={{ fontWeight: "bold" }}
              onClick={handleSubmit}
            >
              생성
            </Button>
          </ButtonBox>
        </Modal>
      )}
    </Wrapper>
  );
};

export default ProjectListPage;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 50px 25px 60px;
`;

const TopContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  margin-bottom: 15px;
`;

const MiddleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #7e7e7e;
  margin: 10px 0 20px;
`;
const Content = styled.form`
  display: flex;
  flex-direction: column;
  text-align: start;
`;

const ProjectTitleWrapper = styled.div`
  position: relative;
  width: 350px;
  margin: 5px 0 10px;
`;

const ProjectTitleIcon = styled(MdOutlineTitle)`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #7e7e7e;
`;

const ProjectTitleInput = styled.input`
  width: 100%;
  padding: 10px 15px 10px 35px;
  border: none;
  border-radius: 5px;
  outline: none;
  font-size: 14px;
  color: #7e7e7e;
`;

const TeamEmailInputWrapper = styled.div`
  position: relative;
  width: 350px;
  margin: 5px 0 10px;
`;

const TeamEmailIcon = styled(FaUserPlus)`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #7e7e7e;
`;
const TeamEmailSubmit = styled(FaArrowCircleRight)`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #7e7e7e;
  cursor: pointer;
`;

const TeamEmailInput = styled.input`
  width: 100%;
  padding: 10px 15px 10px 35px;
  border: none;
  border-radius: 5px 0;
  outline: none;
  font-size: 14px;
  color: #7e7e7e;
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const EmailList = styled.ul`
  padding: 0;
  margin: 0 0 7px;
`;

const StyledLi = styled.li`
  width: fit-content;
  list-style: none;
  border: 1px solid #7e7e7e;
  border-radius: 20px;
  padding: 5px 15px;
  margin-bottom: 3px;
  font-size: 12px;
  background-color: #fff;
  color: #7e7e7e;
`;
