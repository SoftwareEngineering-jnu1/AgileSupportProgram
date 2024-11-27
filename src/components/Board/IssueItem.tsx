import styled from "styled-components";

type IssueItemProps = {
  title: string;
  person: string;
  color: string;
};

const IssueItem = ({ title, person, color }: IssueItemProps) => {
  return (
    <Container>
      <div
        style={{ width: "100%", height: "13px", backgroundColor: `${color}` }}
      />
      <IssueDes>
        <IssueTitle>{title}</IssueTitle>
        <IssuePerson color={color}>
          <span>{person}</span>
        </IssuePerson>
      </IssueDes>
    </Container>
  );
};

export default IssueItem;

const Container = styled.div`
  width: 100%;
  height: 65px;
  background-color: #fff;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
  margin-bottom: 15px;
`;

const IssueDes = styled.div`
  display: flex;
  justify-content: space-between;
  height: 67px;
  padding: 7px 10px;
`;

const IssueTitle = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const IssuePerson = styled.div<{ color: string }>`
  box-sizing: content-box;
  border-radius: 20px;
  background-color: ${(props) => props.color};
  width: 30%;
  height: 30%;
  color: #fff;
  font-size: 13px;
  padding: 1px 5px;
`;
