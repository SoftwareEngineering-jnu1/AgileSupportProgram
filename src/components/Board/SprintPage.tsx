import React from "react";
import styled from "styled-components";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import IssueItem from "./IssueItem";

import { HiPencilSquare } from "react-icons/hi2";
import { MdDirectionsRun } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { GrPowerCycle } from "react-icons/gr";

import AddIssue from "./AddIssue";
import { boardData } from "./data";

type Issue = {
  issueId: number;
  issuetitle: string;
  mainMemberNameAndcolor: Record<string, string>;
  progressStatus: string;
};

type GroupedIssues = {
  [key: string]: Issue[];
};

const SprintPage = () => {
  const { sprintName, sprintEndData, kanbanboardIssueDTO } = boardData;
  const cleanedIssues = kanbanboardIssueDTO.map((issue) => ({
    ...issue,
    mainMemberNameAndcolor: Object.fromEntries(
      Object.entries(issue.mainMemberNameAndcolor).map(([key, value]) => [
        key,
        value || "#000000",
      ]) // undefined 대신 기본 색상 설정
    ),
  }));

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
  };

  const handleDragEnd = ({ active, over }: any) => {
    setDraggedItem(null); // 드래그 종료 시 초기화
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
    <Container>
      <Top>
        <Title>{sprintName}</Title>
        <Date>~ {sprintEndData}</Date>
      </Top>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <BoardContents>
          {["To Do", "In Progress", "Done", "Hold"].map((status) => (
            <Droppable status={status} key={status}>
              {(isOver) => (
                <>
                  <Header>
                    <Status status={status}>
                      {status === "To Do" && <HiPencilSquare />}
                      {status === "In Progress" && <MdDirectionsRun />}
                      {status === "Done" && <FaCheckCircle />}
                      {status === "Hold" && <GrPowerCycle />}
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
                            title={issue.issuetitle}
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
  );
};

export default SprintPage;

// Draggable 컴포넌트
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

// Droppable 컴포넌트
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
        return "#F8F8F8"; // 연한 회색
      case "In Progress":
        return "#EBF7FC"; // 연한 파란색
      case "Done":
        return "#EDF9E8"; // 연한 초록색
      case "Hold":
        return "#EFE8F9"; // 연한 보라색
      default:
        return "#f8f8f8"; // 기본값
    }
  };

  const style = {
    padding: "16px",
    borderRadius: "8px",
    backgroundColor: getBackgroundColor(status),
    minHeight: "100px",
    transition: "background-color 0.2s ease", // 배경색 변경 애니메이션
  };

  return (
    <StatusContainer ref={setNodeRef} style={style}>
      {children(isOver)} {/* isOver를 children 함수에 전달 */}
    </StatusContainer>
  );
};

// 스타일 정의
const Container = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #eee;
  border-radius: 20px;
  margin-bottom: 20px;
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
