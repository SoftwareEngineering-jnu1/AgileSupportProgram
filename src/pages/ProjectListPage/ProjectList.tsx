import styled from "styled-components";
import ProjectItem from "@components/ProjectList/ProjectItem";

const ProjectList = () => {
  return (
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
  );
};

export default ProjectList;

const ProjectContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: space-evenly;
  justify-content: flex-start;
`;
