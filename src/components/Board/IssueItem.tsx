import styled from "styled-components";

const IssueItem = () => {
  return (
    <Container>
      <div
        style={{ width: "100%", height: "13px", backgroundColor: "#E33333" }}
      />
      <IssueDes>
        <IssueTitle>발표자료 만들기</IssueTitle>
        <IssuePerson>
          <span>호정</span>
        </IssuePerson>
      </IssueDes>
    </Container>
  );
};

export default IssueItem;

const Container = styled.div`
  width: 80%;
  height: 70px;
  background-color: #fff;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
  margin-bottom: 15px;
`;

const IssueDes = styled.div`
  display: flex;
  justify-content: space-between;
  height: 67px;
  padding: 3px 10px;
`;

const IssueTitle = styled.span`
  font-size: 15px;
  font-weight: bold;
`;

const IssuePerson = styled.div`
  border-radius: 20px;
  background-color: #e33333;
  width: 25%;
  height: 30%;
  color: #fff;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
