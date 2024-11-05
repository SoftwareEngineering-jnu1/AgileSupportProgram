import styled from "styled-components";

import Button from "@components/common/Button";

const BoardPage = () => {
  return (
    <Wrapper>
      <TopCantainer>
        <Button
          title="스프린트 만들기"
          padding="5px 15px"
          style={{ fontWeight: "bold" }}
        />
      </TopCantainer>
      <MiddleCantainer>
        <img src="/images/NonSprint.png" alt="스프린트 없을때 이미지" />
        <DesBig>설정된 스프린트가 없습니다.</DesBig>
        <DesSmall>스프린트를 만들어 프로젝트를 활성화 해주세요.</DesSmall>
      </MiddleCantainer>
    </Wrapper>
  );
};

export default BoardPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
`;

const TopCantainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
`;

const MiddleCantainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 10px;
`;

const DesBig = styled.span`
  font-size: 26px;
  font-weight: bold;
  margin: 10px 0 5px;
  color: #8a8a8a;
`;
const DesSmall = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #8a8a8a;
`;
