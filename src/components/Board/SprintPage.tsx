import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import IssueItem from "./IssueItem";

import { HiPencilSquare } from "react-icons/hi2";
import { MdDirectionsRun } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { GrPowerCycle } from "react-icons/gr";

import AddIssue from "./AddIssue";
import Button from "@components/common/Button";
import Modal from "@components/common/Modal";

import {
  Content,
  TitleWrapper,
  TitleIcon,
  TitleInput,
  ButtonBox,
  SelectWrapper,
  SelectStatus,
  DateWrapper,
  DateInput,
  AssignIcon,
} from "@pages/TimelinePage/style";
import { fetchInstance } from "@api/instance";
import Cookies from "js-cookie";
import { useProject } from "@context/ProjectContext";

type Issue = {
  issueId: number;
  issueTitle: string;
  mainMemberNameAndColor: Record<string, string>;
  progressStatus: string;
};

interface SprintProps {
  name: string;
  endDate: string;
  data: Issue[];
  reloadData: () => void;
}

type GroupedIssues = {
  [key: string]: Issue[];
};

const SprintPage = ({ name, endDate, data, reloadData }: SprintProps) => {
  const { projectId } = useProject();
  const epicId = Cookies.get(`project_${projectId}_epicId`);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState<boolean>(false);
  const [issues, setIssues] = React.useState<Issue[]>([]);

  const toggleIssueModal = () => {
    if (isIssueModalOpen) {
      setNewIssueTitle("");
      setIssueStartDate("");
      setIssueEndDate("");
      setMainMemberName("");
      setProgressStatus("To Do");
    }
    setIsIssueModalOpen(!isIssueModalOpen);
  };

  useEffect(() => {
    setIssues(data);
  }, [data]);

  const [draggedItem, setDraggedItem] = React.useState<number | null>(null);

  const groupedIssues: GroupedIssues = React.useMemo(() => {
    if (!issues || issues.length === 0) {
      return {
        "To Do": [],
        "In Progress": [],
        Done: [],
        Hold: [],
      };
    }
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

  const handleDragEnd = async ({ active, over }: any) => {
    setDraggedItem(null);

    if (!over) return;

    const sourceStatus = active.data.current.status;
    const destinationStatus = over.id;

    if (sourceStatus === destinationStatus) return;

    // 상태 변경 로직
    const updatedIssues = issues.map((issue) =>
      issue.issueId === active.id
        ? { ...issue, progressStatus: destinationStatus }
        : issue
    );

    setIssues(updatedIssues);

    // 서버에 상태 변경 요청
    try {
      const payload = {
        issueId: active.id,
        progressStatus: destinationStatus,
      };

      await fetchInstance.post(
        `/project/${projectId}/kanbanboard/${epicId}/${active.id}`,
        payload
      );

      console.log("이슈 상태 업데이트 성공:", payload);
    } catch (error) {
      console.error("이슈 상태 업데이트 실패:", error);

      // 실패 시 이전 상태로 롤백
      setIssues(issues);
    }
  };

  //여기부터 이슈 만들기 관련
  type IssueStatus = "To Do" | "In Progress" | "Done" | "Hold";
  const [issueStartDate, setIssueStartDate] = useState("");
  const [issueEndDate, setIssueEndDate] = useState("");
  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [mainMemberName, setMainMemberName] = useState("");
  const [progressStatus, setProgressStatus] = useState("To Do");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProgressStatus(e.target.value as IssueStatus);
  };
  const handleIssueMember = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMainMemberName(e.target.value);
  };

  const addIssue = () => {
    const payload = {
      title: newIssueTitle,
      startDate: issueStartDate,
      endDate: issueEndDate,
      mainMemberName,
      progressStatus,
    };

    fetchInstance
      .post(`/project/${projectId}/${epicId}/addissue`, payload)
      .then(() => {
        console.log("이슈 생성 성공");
        toggleIssueModal();
        reloadData();
      })
      .catch((error) => {
        console.error("이슈 생성 실패:", error);
      });
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
                          issue.mainMemberNameAndColor || { Unknown: "#000000" }
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
                    <AddIssue toggle={toggleIssueModal} />
                  </>
                )}
              </Droppable>
            ))}
          </BoardContents>
        </DndContext>
      </Container>
      {isIssueModalOpen && (
        <Modal isOpen={isIssueModalOpen} onClose={toggleIssueModal}>
          <h2>이슈 만들기</h2>
          <Content>
            <span>할 일</span>
            <TitleWrapper>
              <TitleIcon />
              <TitleInput
                placeholder="무엇을 완료해야 하나요?"
                value={newIssueTitle}
                onChange={(e) => setNewIssueTitle(e.target.value)}
              />
            </TitleWrapper>
            <span>시작일 ~ 종료일</span>
            <DateWrapper>
              <DateInput
                type="date"
                value={issueStartDate}
                onChange={(e) => setIssueStartDate(e.target.value)}
              />
              <span> ~ </span>
              <DateInput
                type="date"
                value={issueEndDate}
                onChange={(e) => setIssueEndDate(e.target.value)}
              />
            </DateWrapper>

            <span>담당자</span>
            <TitleWrapper>
              <AssignIcon />
              <TitleInput
                placeholder="담당자를 입력하세요"
                onChange={handleIssueMember}
              />
            </TitleWrapper>

            <span>진행 상태</span>
            <SelectWrapper>
              <SelectStatus value={progressStatus} onChange={handleChange}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Hold">Hold</option>
              </SelectStatus>
            </SelectWrapper>
          </Content>
          <ButtonBox>
            <Button
              padding="6px 6px"
              bgColor="#7895B2"
              fontSize="16px"
              style={{ fontWeight: "bold" }}
              onClick={addIssue}
            >
              생성
            </Button>
          </ButtonBox>
        </Modal>
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
