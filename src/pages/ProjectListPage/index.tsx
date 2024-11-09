import styled from "styled-components";

import { Link } from "react-router-dom";
import { RouterPath } from "@routes/path";
import Button from "@components/common/Button";

import { FaUserCircle } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import ProjectItem from "@components/ProjectList/ProjectItem";

const ProjectListPage = () => {
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
          >
            <FaCirclePlus size={30} />
            프로젝트 생성
          </Button>
        </div>
        <Divider />
      </MiddleContainer>
      <ProjectContainer>
        <ProjectItem />
        <ProjectItem />
        <ProjectItem />
        <ProjectItem />
        <ProjectItem />
        <ProjectItem />
        <ProjectItem />
        <ProjectItem />
        <ProjectItem />
        <ProjectItem />
        <ProjectItem />
      </ProjectContainer>
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

const ProjectContainer = styled.div`
  display: flex;
  gap: 20px;
  // width: 100%;
  flex-wrap: wrap;
  align-items: space-evenly;
  justify-content: flex-start;
`;
