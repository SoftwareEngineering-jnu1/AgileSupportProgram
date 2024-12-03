import styled from "styled-components";
import ProjectItem from "@components/ProjectList/ProjectItem";

interface ProjectResponse {
  projectiId: number;
  totalEpics: number;
  completedEpics: number;
  projectName: string;
}

interface ProjectListProps {
  projectList: ProjectResponse[];
}

const ProjectList = ({ projectList }: ProjectListProps) => {
  return (
    <ProjectContainer>
      {projectList.map((project) => (
        <ProjectItem key={project.projectiId} project={project} />
      ))}
    </ProjectContainer>
  );
};

export default ProjectList;

const ProjectContainer = styled.div`
  width: 95%;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: flex-start;
`;
