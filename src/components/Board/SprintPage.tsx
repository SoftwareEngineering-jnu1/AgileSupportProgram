import styled from "styled-components";
import IssueItem from "./IssueItem";

import { HiPencilSquare } from "react-icons/hi2";
import { MdDirectionsRun } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { GrPowerCycle } from "react-icons/gr";

import AddIssue from "./AddIssue";

const SprintPage = () => {
  return (
    <Container>
      <Top>
        <Title>스프린트 이름</Title>
        <Date>~10월 5일</Date>
      </Top>
      <BoardContents>
        <TodoContainer>
          <div
            style={{
              width: "100%",
              display: "flex",
              padding: "0 15px",
              alignItems: "center",
            }}
          >
            <TodoTitle>
              <HiPencilSquare color="#8A8A8A" style={{ marginRight: "8px" }} />
              <span>To do</span>
            </TodoTitle>
            <TodoCount>2</TodoCount>
          </div>
          <IssueItem />
          <IssueItem />
          <AddIssue />
        </TodoContainer>
        <ProgressContainer>
          <div
            style={{
              width: "100%",
              display: "flex",
              padding: "0 15px",
              alignItems: "center",
            }}
          >
            <ProgressTitle>
              <MdDirectionsRun color="#0099FF" style={{ marginRight: "8px" }} />
              <span>In Progress</span>
            </ProgressTitle>
            <ProgressCount>0</ProgressCount>
          </div>
          <AddIssue />
        </ProgressContainer>
        <DoneContainer>
          <div
            style={{
              width: "100%",
              display: "flex",
              padding: "0 15px",
              alignItems: "center",
            }}
          >
            <DoneTitle>
              <FaCheckCircle color="#6FC349" style={{ marginRight: "8px" }} />
              <span>Done</span>
            </DoneTitle>
            <DoneCount>0</DoneCount>
          </div>
          <AddIssue />
        </DoneContainer>
        <HoldContainer>
          <div
            style={{
              width: "100%",
              display: "flex",
              padding: "0 15px",
              alignItems: "center",
            }}
          >
            <HoldTitle>
              <GrPowerCycle color="#6C3091" style={{ marginRight: "8px" }} />
              <span>Hold</span>
            </HoldTitle>
            <HoldCount>0</HoldCount>
          </div>
          <AddIssue />
        </HoldContainer>
      </BoardContents>
    </Container>
  );
};

export default SprintPage;

const Container = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #eee;
  border-radius: 20px;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  align-items: end;
  margin-bottom: 10px;
`;

const Title = styled.span`
  font-size: 24px;
  font-weight: bold;
`;

const Date = styled.span`
  font-size: 15px;
  padding: 0 0 3px 10px;
  color: #666;
`;

const BoardContents = styled.div`
  width: 100%;
  display: flex;
  align-items: start;
  gap: 20px;
`;

const TodoTitle = styled.div`
  display: flex;
  height: 30px;
  align-items: center;
  border-radius: 50px;
  background-color: #e8e8e8;
  padding: 2px 10px;
  margin: 0 5px 5px 0;
  font-weight: bold;
`;

const TodoCount = styled.span`
  font-size: 15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e8e8e8;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px 5px 0;
`;

const TodoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  // height: 300px;
  background-color: #f8f8f8;
  border-radius: 20px;
  padding: 10px 0 15px;
`;

const ProgressTitle = styled.div`
  display: flex;
  align-items: center;
  border-radius: 50px;
  height: 30px;
  background-color: #c8e9ff;
  padding: 2px 10px;
  margin: 0 5px 5px 0;
  font-weight: bold;
`;

const ProgressCount = styled.span`
  font-size: 15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #c8e9ff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px 5px 0;
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  // height: 300px;
  background-color: #ebf7fc;
  border-radius: 20px;
  padding: 10px 0 15px;
`;

const DoneTitle = styled.div`
  display: flex;
  align-items: center;
  border-radius: 50px;
  height: 30px;
  background-color: #caf0b9;
  padding: 2px 10px;
  margin: 0 5px 5px 0;
  font-weight: bold;
`;

const DoneCount = styled.span`
  font-size: 15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #caf0b9;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px 5px 0;
`;

const DoneContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  // height: 300px;
  background-color: #edf9e8;
  border-radius: 20px;
  padding: 10px 0 15px;
`;

const HoldTitle = styled.div`
  display: flex;
  height: 30px;
  align-items: center;
  border-radius: 50px;
  background-color: #dba4ef;
  padding: 2px 10px;
  margin: 0 5px 5px 0;
  font-weight: bold;
`;

const HoldCount = styled.span`
  font-size: 15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #dba4ef;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px 5px 0;
`;

const HoldContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  // height: 300px;
  background-color: #efe8f9;
  border-radius: 20px;
  padding: 10px 0 15px;
`;
