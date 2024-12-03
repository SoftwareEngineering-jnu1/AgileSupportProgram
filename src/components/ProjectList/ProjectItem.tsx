import { RouterPath } from "@routes/path";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useProject } from "@context/ProjectContext";

interface ProjectResponse {
  projectId: number;
  totalEpics: number;
  completedEpics: number;
  projectName: string;
}

interface ProjectItemProps {
  project: ProjectResponse;
}

const ProjectItem = ({ project }: ProjectItemProps) => {
  const { setProjectId } = useProject();

  const handleClick = () => {
    setProjectId(project.projectId);
  };

  const progress = Math.round(
    (project.completedEpics / project.totalEpics) * 100 || 0
  );

  return (
    <ProjectWrapper to={RouterPath.boardPage} onClick={handleClick}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Title>{project.projectName}</Title>
      </div>
      <ProgressContainer>
        <Label>작업율</Label>
        <ProgressBar>
          <ProgressFill style={{ width: `${progress}%` }} />
        </ProgressBar>
      </ProgressContainer>
    </ProjectWrapper>
  );
};

export default ProjectItem;

const ProjectWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 200px;
  height: 150px;
  background-color: #f5efe6;
  border-radius: 20px;
  padding: 15px;
  color: #000;
  text-decoration: none;
`;

const Title = styled.span`
  font-weight: bold;
  font-size: 24px;
`;

const ProgressContainer = styled.div`
  margin-top: 10px;
  text-align: start;
`;

const Label = styled.span`
  font-size: 10px;
  color: #333;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 15px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #aee192;
  border-radius: 10px;
  transition: width 0.3s ease;
`;
