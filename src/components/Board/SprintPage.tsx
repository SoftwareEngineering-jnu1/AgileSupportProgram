import React, { useState } from "react";
import styled from "styled-components";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import IssueItem from "./IssueItem";

import { HiPencilSquare } from "react-icons/hi2";
import { MdDirectionsRun } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { GrPowerCycle } from "react-icons/gr";

import AddIssue from "./AddIssue";
// import { boardData } from "./data";
import Button from "@components/common/Button";
import Modal from "@components/common/Modal";

// import { MdOutlineTitle } from "react-icons/md";
import ReviewContentBox from "@components/Board/ReviewContentBox";
import InputWithDropdown from "@components/Board/InputWithDropdown";
// import ModalIssueItem from "@components/Board/ModalIssueItem";

type Issue = {
  issueId: number;
  issueTitle: string;
  mainMemberNameAndcolor: Record<string, string>;
  progressStatus: string;
};

interface SprintProps {
  name: string;
  endDate: string;
  data: Issue[];
}

type GroupedIssues = {
  [key: string]: Issue[];
};

const SprintPage = ({ name, endDate, data }: SprintProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  // const { sprintName, sprintEndData, kanbanboardIssueDTO } = data;
  const cleanedIssues = data.map((issue) => ({
    ...issue,
    mainMemberNameAndcolor: Object.fromEntries(
      Object.entries(issue.mainMemberNameAndcolor).map(([key, value]) => [
        key,
        value || "#000000",
      ])
    ),
  }));

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // const handleIssueSelect = (label: string) => {
  //   setSelectedIssue(label === selectedIssue ? null : label); // 동일한 아이템 선택 시 해제
  // };

  const [issues, setIssues] = React.useState<Issue[]>(cleanedIssues);
  const [draggedItem, setDraggedItem] = React.useState<number | null>(null);

  const groupedIssues: GroupedIssues = React.useMemo(() => {
    return issues.reduce((acc: GroupedIssues, issue) => {
      acc[issue.progressStatus] = acc[issue.progressStatus] || [];
      acc[issue.progressStatus].push(issue);
      return acc;
    }, {});
  }, [issues]);

  const handleDragStart = ({ active }: any) => {
    setDraggedItem(active.id);
    console.log(active.id);
    console.log(draggedItem);
  };

  const handleDragEnd = ({ active, over }: any) => {
    setDraggedItem(null);
    if (!over) return;

    const sourceStatus = active.data.current.status;
    const destinationStatus = over.id;

    if (sourceStatus === destinationStatus) return;

    const updatedIssues = issues.map((issue) =>
      issue.issueId === active.id
        ? { ...issue, progressStatus: destinationStatus }
        : issue
    );
    setIssues(updatedIssues);
  };

  return (
    <>
      <Container>
        <Top>
          <Title>{name}</Title>
          <Date>~ {endDate}</Date>
        </Top>
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <BoardContents>
            {["To Do", "In Progress", "Done", "Hold"].map((status) => (
              <Droppable status={status} key={status}>
                {(isOver) => (
                  <>
                    <Header>
                      <Status status={status}>
                        {status === "To Do" && (
                          <HiPencilSquare style={{ marginRight: "5px" }} />
                        )}
                        {status === "In Progress" && (
                          <MdDirectionsRun style={{ marginRight: "5px" }} />
                        )}
                        {status === "Done" && (
                          <FaCheckCircle style={{ marginRight: "5px" }} />
                        )}
                        {status === "Hold" && (
                          <GrPowerCycle style={{ marginRight: "5px" }} />
                        )}
                        <span>{status}</span>
                      </Status>
                      <Count status={status}>
                        {groupedIssues[status]?.length || 0}
                      </Count>
                    </Header>
                    <div>
                      {groupedIssues[status]?.map((issue) => {
                        const [person, color] = Object.entries(
                          issue.mainMemberNameAndcolor
                        )[0];
                        return (
                          <Draggable
                            key={issue.issueId}
                            id={issue.issueId}
                            status={issue.progressStatus}
                          >
                            <IssueItem
                              title={issue.issueTitle}
                              person={person}
                              color={color}
                            />
                          </Draggable>
                        );
                      })}
                      {isOver && (
                        <div style={{ border: "2px solid #ffd700" }}></div>
                      )}
                    </div>
                    <AddIssue />
                  </>
                )}
              </Droppable>
            ))}
          </BoardContents>
        </DndContext>
      </Container>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={toggleModal}>
          <ReviewBox>
            <ReviewContentBox category="Stop" />
            <ReviewContentBox category="Start" />
            <ReviewContentBox category="Continue" />
          </ReviewBox>
          <BottomBox>
            <InputWithDropdown />
            <Button
              padding="3px 30px"
              bgColor="#AEBDCA"
              fontSize="16px"
              style={{ fontWeight: "bold" }}
            >
              스프린트 리뷰
            </Button>
          </BottomBox>
        </Modal>
        // <Modal isOpen={isModalOpen} onClose={toggleModal}>
        //   <h3>새 스프린트를 생성하시겠습니까?</h3>
        //   <Content>
        //     <span>스프린트 이름</span>
        //     <SprintTitleWrapper>
        //       <SprintTitleIcon />
        //       <SprintTitleInput placeholder="프로젝트 이름을 입력해주세요" />
        //     </SprintTitleWrapper>
        //     <span>스프린트에 추가할 에픽 선택</span>
        //     <SelectIssueWrapper>
        //       <ModalIssueItem
        //         label="발표 자료 제작"
        //         isChecked={selectedIssue === "발표 자료 제작"}
        //         onCheck={() => handleIssueSelect("발표 자료 제작")}
        //       />
        //       <ModalIssueItem
        //         label="개발 환경 설정"
        //         isChecked={selectedIssue === "개발 환경 설정"}
        //         onCheck={() => handleIssueSelect("개발 환경 설정")}
        //       />
        //       <ModalIssueItem
        //         label="기능 기획"
        //         isChecked={selectedIssue === "기능 기획"}
        //         onCheck={() => handleIssueSelect("기능 기획")}
        //       />
        //     </SelectIssueWrapper>
        //   </Content>
        //   <ButtonBox>
        //     <Button
        //       padding="6px 6px"
        //       bgColor="#7895B2"
        //       fontSize="16px"
        //       style={{ fontWeight: "bold" }}
        //     >
        //       생성
        //     </Button>
        //   </ButtonBox>
        // </Modal>
      )}
    </>
  );
};

export default SprintPage;

const Draggable = ({ id, children, status }: any) => {
  const { attributes, listeners, setNodeRef, transform, active } = useDraggable(
    {
      id,
      data: { status },
    }
  );

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: active?.id === id ? 1000 : "auto", // 드래그 중인 요소를 최상단으로
    cursor: active?.id === id ? "grabbing" : "grab", // 마우스 커서
    boxShadow: active?.id === id ? "0px 4px 6px rgba(0, 0, 0, 0.2)" : "none", // 이동 중 섀도우 효과
    transition: "transform 0.2s ease", // 부드러운 움직임
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {children}
    </div>
  );
};

const Droppable = ({
  status,
  children,
}: {
  status: string;
  children: (isOver: boolean) => React.ReactNode;
}) => {
  const { setNodeRef, over } = useDroppable({ id: status });

  const isOver = over?.id === status; // 현재 드래그 중인 요소가 이 영역 위에 있는지 확인

  const getBackgroundColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "#F8F8F8";
      case "In Progress":
        return "#EBF7FC";
      case "Done":
        return "#EDF9E8";
      case "Hold":
        return "#EFE8F9";
      default:
        return "#f8f8f8";
    }
  };

  const style = {
    padding: "16px",
    borderRadius: "8px",
    backgroundColor: getBackgroundColor(status),
    minHeight: "100px",
    transition: "background-color 0.2s ease",
  };

  return (
    <StatusContainer ref={setNodeRef} style={style}>
      {children(isOver)}
    </StatusContainer>
  );
};

//모달 스타일
// const Content = styled.form`
//   display: flex;
//   flex-direction: column;
//   text-align: start;
// `;

// const SprintTitleWrapper = styled.div`
//   position: relative;
//   width: 350px;
//   margin: 5px 0 10px;
// `;

// const SprintTitleIcon = styled(MdOutlineTitle)`
//   position: absolute;
//   top: 50%;
//   left: 10px;
//   transform: translateY(-50%);
//   color: #7e7e7e;
// `;

// const SprintTitleInput = styled.input`
//   width: 100%;
//   padding: 10px 15px 10px 35px;
//   border: none;
//   border-radius: 5px;
//   outline: none;
//   font-size: 14px;
//   color: #7e7e7e;
// `;

// const SelectIssueWrapper = styled.div`
//   width: 350px;
//   margin: 5px 0;
//   padding: 0 10px;
//   background-color: #fff;
//   border-radius: 5px;
//   max-height: 150px;
//   overflow-y: auto;

//   &::-webkit-scrollbar {
//     display: none;
//   }
// `;

// const ButtonBox = styled.div`
//   display: flex;
//   justify-content: flex-end;
// `;

const Container = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #eee;
  border-radius: 20px;
  margin: 20px 0;
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

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const Status = styled.div<{ status: string }>`
  padding: 3px 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  font-weight: bold;
  background-color: ${({ status }) =>
    status === "To Do"
      ? "#E8E8E8" // 연한 빨간색
      : status === "In Progress"
      ? "#C8E9FF" // 연한 파란색
      : status === "Done"
      ? "#CAF0B9" // 연한 초록색
      : status === "Hold"
      ? "#DBA4EF" // 연한 보라색
      : "#E8E8E8"}; // 기본값
`;

const Count = styled.span<{ status: string }>`
  font-size: 13px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
  font-weight: bold;
  background-color: ${({ status }) =>
    status === "To Do"
      ? "#E8E8E8" // 연한 빨간색
      : status === "In Progress"
      ? "#C8E9FF" // 연한 파란색
      : status === "Done"
      ? "#CAF0B9" // 연한 초록색
      : status === "Hold"
      ? "#DBA4EF" // 연한 보라색
      : "#E8E8E8"}; // 기본값
`;

const StatusContainer = styled.div`
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  background-color: #f8f8f8;
`;

const ReviewBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const BottomBox = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
`;
