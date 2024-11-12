import styled from "styled-components";

const NonSprintPage = () => {
  return (
    <Wrapper>
      <img src="/images/NonSprint.png" alt="스프린트 없을때 이미지" />
      <DesBig>설정된 스프린트가 없습니다.</DesBig>
      <DesSmall>스프린트를 만들어 프로젝트를 활성화 해주세요.</DesSmall>
    </Wrapper>
  );
};

export default NonSprintPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DesBig = styled.span`
  font-size: 26px;
  font-weight: bold;
  margin: 10px 0 5px;
  color: #8a8a8a;
`;
const DesSmall = styled.span`
  font-size: 14px;
  color: #8a8a8a;
`;
