import styled from "styled-components";
import { useState } from "react";

import { FaRegStar, FaStar } from "react-icons/fa";

const ProjectItem = () => {
  const [isFavorited, setIsFavorited] = useState(false);

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
