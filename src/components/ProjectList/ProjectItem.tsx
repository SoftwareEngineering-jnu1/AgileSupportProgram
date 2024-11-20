import styled from "styled-components";
import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

const ProjectItem = () => {
  const [isFavorited, setIsFavorited] = useState(false);
  // const [progress, setProgress] = useState(30); // (0 ~ 100)
  const progress = 30;

  const toggleFavorite = () => {
    setIsFavorited((prev) => !prev);
  };

  return (
    <ProjectWrapper>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Title>프로젝트 이름</Title>
        <div onClick={toggleFavorite} style={{ cursor: "pointer" }}>
          {isFavorited ? (
            <FaStar color="#7895B2" />
          ) : (
            <FaRegStar color="#7895B2" />
          )}
        </div>
      </div>
      <Des>애자일 방법론을 도와주는 도구 생성</Des>
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

const ProjectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 150px;
  background-color: #f5efe6;
  border-radius: 20px;
  padding: 15px;
`;

const Title = styled.span`
  font-weight: bold;
`;

const Des = styled.p`
  color: #333;
  font-size: 12px;
  text-align: start;
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
