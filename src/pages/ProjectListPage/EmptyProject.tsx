import React from "react";
import styled from "styled-components";

const EmptyProject = () => {
  return (
    <EmptyContainer>
      <img src="/images/EmptyProject.png" alt="프로젝트 없음" />
      <BigDes>생성된 프로젝트가 없습니다.</BigDes>
      <SmallDes>
        새 프로젝트를 시작하려면 프로젝트 생성 버튼을 눌러서 생성해주세요.
      </SmallDes>
    </EmptyContainer>
  );
};

export default EmptyProject;

const EmptyContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BigDes = styled.span`
  font-size: 24px;
  color: #7e7e7e;
`;

const SmallDes = styled.span`
  font-size: 16px;
  color: #7e7e7e;
`;
