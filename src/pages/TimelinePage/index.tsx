import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  DataSet,
  DataItem,
  DataGroup,
  TimelineTimeAxisScaleType,
  TimelineOptions,
  Timeline as VisTimeline,
} from "vis-timeline/standalone";

import Button from "@components/common/Button";
import Modal from "@components/common/Modal";
import Progress from "@components/common/Progress";
import { useProject } from "@context/ProjectContext";
import { fetchInstance } from "@api/instance";

import { IoIosAdd, IoIosClose } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";

import type {
  Epic,
  EpicResponse,
  Issue,
  EpicDetailProps,
  IssueDetailProps,
  IssueStatus,
} from "./type";
import {
  Content,
  TitleWrapper,
  TitleIcon,
  TitleInput,
  ButtonBox,
  SelectWrapper,
  SelectStatus,
} from "./style";
import { DateWrapper, DateInput, AssignIcon } from "./style";
import {
  ButtonContainer,
  ButtonPart,
  Divider,
  EpicDetailContainer,
  IssueDetailContainer,
} from "./style";
import Cookies from "js-cookie";

import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import "./Timeline.css";

const Timeline = () => {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [newEpic, setNewEpic] = useState("");
  const [newIssue, setNewIssue] = useState("");
  const [mainMember, setMainMember] = useState("");

  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [timeline, setTimeline] = useState<VisTimeline | null>(null);

  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const [epicStartDate, setEpicStartDate] = useState("");
  const [epicEndDate, setEpicEndDate] = useState("");

  const [issueStartDate, setIssueStartDate] = useState("");
  const [issueEndDate, setIssueEndDate] = useState("");

  const itemsRef = useRef<DataSet<DataItem>>(new DataSet<DataItem>()); // 초기화
  const groupsRef = useRef<DataSet<DataGroup>>(new DataSet<DataGroup>()); // 초기화

  const { projectId } = useProject();

  // 타임라인 생성
  useEffect(() => {
    if (timelineRef.current) {
      const items = new DataSet<DataItem>([]);
      const groups = new DataSet<DataGroup>([]);

      itemsRef.current = items;
      groupsRef.current = groups;

      //날짜 설정
      const today = new Date();
      const startDate = new Date(
        today.getFullYear() - 2,
        today.getMonth(),
        today.getDate()
      );
      const endDate = new Date(
        today.getFullYear() + 2,
        today.getMonth(),
        today.getDate()
      );

      // 초기 표시할 4개월 범위 설정
      const minDate = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate()
      );
      const maxDate = new Date(
        today.getFullYear(),
        today.getMonth() + 6,
        today.getDate()
      );

      const options: TimelineOptions = {
        min: startDate,
        max: endDate,

        moveable: true,

        editable: {
          remove: false,
        },
        margin: { item: 10 },
        orientation: "top",

        timeAxis: {
          scale: "month" as TimelineTimeAxisScaleType,
          step: 1,
        },

        align: "left",
      };
      const createtimeline = new VisTimeline(
        timelineRef.current,
        items,
        groups,
        options
      );
      setTimeline(createtimeline);

      createtimeline.setWindow(minDate, maxDate, { animation: false });

      return () => {
        if (createtimeline) {
          createtimeline.destroy();
        }
      };
    }
  }, [projectId]);

  // 에픽 모달 창
  const [isEpicModalOpen, setIsEpicModalOpen] = useState(false);
  const toggleEpicModal = () => {
    setIsEpicModalOpen(!isEpicModalOpen);
  };

  // 이슈 모달 창
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const toggleIssueModal = () => {
    setIsIssueModalOpen(!isIssueModalOpen);
  };

  // 아이템 추가 함수
  const addTimelineItem = (epic: Epic, index: number) => {
    const startDate = new Date(epic.epicStartDate);
    const endDate = new Date(epic.epicEndDate);

    const newItem = {
      id: epic.epicId,
      content: epic.epicTitle,
      start: startDate,
      end: endDate,
      group: index,
      type: "range",
      style: "background-color: #495C78; border-color: #000000;",
    };

    itemsRef.current.add(newItem);
  };
  const addIssueTimelineItem = (issue: Issue, epicId: number) => {
    const startDate = new Date(issue.issueStartDate);
    const endDate = new Date(issue.issueEndDate);

    const newIssueItem = {
      id: issue.id,
      content: issue.issueTitle,
      start: startDate,
      end: endDate,
      group: epicId,
      type: "range",
      style: "background-color: #AEBDCA; border-color: #000000;",
    };

    itemsRef.current.add(newIssueItem);
  };

  // 에픽 추가
  const addEpic = () => {
    const startDate = new Date(epicStartDate).toISOString();
    const endDate = new Date(epicEndDate).toISOString();

    if (newEpic) {
      const epicData = {
        title: newEpic,
        progress: 0,
        issues: [],
        startDate: startDate,
        endDate: endDate,
      };

      fetchInstance
        .post(`/project/${projectId}/addepic`, epicData)
        .then((response) => {
          const title = response.data.data.title;
          const id = response.data.data.id;

          const newEpicData = {
            epicId: id,
            epicTitle: title,
            epicStartDate: startDate,
            epicEndDate: endDate,
            epicProgressStatus: {
              totalIssues: 0,
              completedIssues: 0,
            },
            issues: [],
          };

          const updatedEpics = [...epics, newEpicData];
          setEpics(updatedEpics);

          if (timeline && itemsRef.current && groupsRef.current) {
            itemsRef.current.clear();
            groupsRef.current.clear();

            updatedEpics.forEach((epic) => {
              groupsRef.current.add({
                id: epic.epicId,
                content: epic.epicTitle,
              });

              addTimelineItem(epic, epic.epicId);
            });

            timeline.setGroups(groupsRef.current);
            timeline.setItems(itemsRef.current);
            timeline.fit();

            setNewEpic("");
            setEpicStartDate("");
            setEpicEndDate("");
          }
        })
        .catch((error) => {
          console.error(
            "에픽 생성 실패",
            error.response?.data || error.message
          );
        });
    } else {
      console.log("비어있는 항목이 있습니다.");
    }
  };

  // 하위 이슈 추가
  const addIssue = (epicId: number) => {
    const startDate = new Date(issueStartDate).toISOString();
    const endDate = new Date(issueEndDate).toISOString();

    if (newIssue && mainMember) {
      const issueData = {
        title: newIssue,
        mainMemberName: mainMember,
        progressStatus: status,
        startDate: startDate,
        endDate: endDate,
      };

      fetchInstance
        .post(`/project/${projectId}/${epicId}/addissue`, issueData)
        .then((response) => {
          const newIssueData = {
            id: response.data.id,
            issueId: response.data.id,
            epicId: epicId,
            issueTitle: response.data.title,
            title: response.data.title,
            mainMemberName: response.data.mainMemberName,
            progressStatus: status,
            issueStartDate: startDate,
            issueEndDate: endDate,
            hasDependency: false,
            iscompleted: response.data.iscompleted,
          };

          setEpics((prevEpics) => {
            return prevEpics.map((currentEpic) => {
              if (currentEpic.epicId === epicId) {
                const updatedIssues = [...currentEpic.issues, newIssueData];
                const totalIssues = updatedIssues.length;
                const completedIssues = updatedIssues.filter(
                  (issue) => issue.iscompleted
                ).length;

                return {
                  ...currentEpic,
                  issues: updatedIssues,
                  totalIssues,
                  completedIssues, // 진행도 업데이트
                };
              }
              return currentEpic;
            });
          });

          // 타임라인에 이슈 추가
          if (timeline && itemsRef.current && groupsRef.current) {
            const epic = epics.find((e) => e.epicId === epicId);
            if (epic) {
              addIssueTimelineItem(newIssueData, epicId);

              timeline.setItems(itemsRef.current);
              timeline.fit();
            }
          }
          setNewIssue("");
          setIssueStartDate("");
          setIssueEndDate("");
          setMainMember("");
        })
        .catch((error) => {
          console.error("이슈 생성 실패:", error);
        });
    } else {
      console.log("비어있는 항목이 있습니다.");
    }
  };

  // 에픽 상세보기 이벤트
  const showDetailEpic = (epic: Epic) => {
    setSelectedEpic(epic);
  };

  // 이슈 상세보기 이벤트
  const showDetailIssue = (issue: Issue, epicId: number) => {
    setSelectedIssue({ ...issue, epicId });
  };

  // 이슈 상세보기 창
  const IssueDetail = ({ issue, onClose, epicId, id }: IssueDetailProps) => {
    useEffect(() => {
      fetchInstance
        .get(`/project/${projectId}/${epicId}/${id}/edit`)
        .then((response) => {
          console.log("이슈 상세보기 성공", response.data);
        })
        .catch((error) => {
          console.log("이슈 상세보기 실패", error);
        });
    }, [epicId, id]);

    return (
      <IssueDetailContainer>
        <IoIosClose className="close" onClick={onClose} />
        <div className="epic-title2">{issue.title}</div>

        <div
          className="epic-title2"
          style={{ fontSize: "15px", fontWeight: "normal" }}
        >
          담당자
        </div>
        <div className="issueContainer">
          <div className="issueAdd">
            <FaUserCircle size={30} />
            <div style={{ fontSize: "15px", padding: "5px", marginTop: "2px" }}>
              {issue.mainMemberName}
            </div>
          </div>
        </div>
      </IssueDetailContainer>
    );
  };

  const EpicDetail = ({ epic, onClose, epicId }: EpicDetailProps) => {
    const [isFetched, setIsFetched] = useState(false);
    const [subIssues, setSubIssues] = useState<Issue[]>([]);
    const [progress, setProgress] = useState({
      totalIssues: 0,
      completedIssues: 0,
    });

    useEffect(() => {
      if (isFetched) return;
      fetchInstance
        .get(`/project/${projectId}/${epicId}/edit`)
        .then((response) => {
          const data = response.data.data;
          const issues = data.subIssues;
          const { totalIssues, completedIssues } = data.epicProgressStatus;

          setProgress({
            totalIssues,
            completedIssues,
          });

          setSubIssues(issues);
          setIsFetched(true);
        })
        .catch((error) => {
          console.log("에픽 상세보기 실패", error);
        });
    }, [isFetched, epicId]);

    const capitalize = (text: string) => {
      if (!text) return "";
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    return (
      <EpicDetailContainer>
        <IoIosClose className="close" onClick={onClose} />
        <div className="sprint-title"></div>
        <div className="epic-title2">{epic.epicTitle}</div>

        <div style={{ margin: "0 10px", padding: "8px" }}>
          <Progress
            total={progress.totalIssues}
            completed={progress.completedIssues}
            height="20px"
            borderRadius="10px"
          />
        </div>
        {/* 하위 이슈 목록 */}
        <div
          className="epic-title2"
          style={{ fontSize: "15px", fontWeight: "normal" }}
        >
          하위 이슈
        </div>
        <div className="issueContainer">
          {subIssues.length > 0 ? (
            subIssues.map((issue, index) => (
              <div key={index} className="issueList">
                <div
                  onClick={() => showDetailIssue(issue, epic.epicId)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{issue.title}</span>
                </div>
                <span
                  className={`issueStatus ${issue.progressStatus
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {capitalize(issue.progressStatus)}
                </span>
              </div>
            ))
          ) : (
            <div style={{ color: "#888", padding: "8px" }}>
              등록된 하위 이슈가 없습니다.
            </div>
          )}

          {/* 이슈 추가 버튼 */}
          <div className="issueAdd">
            <IoIosAdd className="add" onClick={toggleIssueModal} />
            <div style={{ fontSize: "15px", marginTop: "2px" }}>
              이슈 만들기
            </div>
          </div>
        </div>
      </EpicDetailContainer>
    );
  };

  // 타임라인 단위 설정 버튼
  const multiButton = (type: string) => {
    switch (type) {
      case "month":
        setRange("month");
        break;
      case "week":
        setRange("week");
        break;
      case "day":
        setRange("day");
        break;
      default:
        break;
    }
  };

  // 타임라인 단위 설정 함수
  const setRange = (type: string) => {
    if (!timeline) return;

    let scale: TimelineTimeAxisScaleType;
    let step: number;
    let minDate: Date;
    let maxDate: Date;

    const today = new Date();

    switch (type) {
      case "month":
        scale = "month";
        step = 1;
        minDate = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          today.getDate()
        );
        maxDate = new Date(
          today.getFullYear(),
          today.getMonth() + 6,
          today.getDate()
        );
        break;
      case "week":
        scale = "day";
        step = 7;
        minDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        maxDate = new Date(
          today.getFullYear(),
          today.getMonth() + 2,
          today.getDate()
        );
        break;
      case "day":
        scale = "day";
        step = 1;
        minDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 7
        );
        maxDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 14
        );
        break;
      default:
        return;
    }

    timeline.setOptions({
      timeAxis: { scale, step },
    });

    timeline.setWindow(minDate, maxDate);
  };

  // 진행 상태 드롭다운
  const [status, setStatus] = useState<IssueStatus>("To Do");
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as IssueStatus);
  };

  const fetchEpics = useCallback(() => {
    fetchInstance
      .get<EpicResponse>(`/project/${projectId}/timeline`)
      .then((response) => {
        const data = response.data.data;
        const epicsList: Epic[] = Object.values(data).flat();

        setEpics(epicsList);

        if (timeline && itemsRef.current && groupsRef.current) {
          itemsRef.current.clear();

          epicsList.forEach((epic) => {
            groupsRef.current.add({
              id: epic.epicId,
              content: epic.epicTitle,
            });
            addTimelineItem(epic, epic.epicId);

            epic.issues.forEach((issue) => {
              addIssueTimelineItem(issue, epic.epicId);
            });
          });

          timeline.setGroups(groupsRef.current);
          timeline.setItems(itemsRef.current);
          timeline.fit();
        }
      })
      .catch((error) => console.error("에픽 목록 호출 실패:", error));
  }, [projectId, timeline, itemsRef, groupsRef]);

  useEffect(() => {
    if (timeline) {
      fetchEpics();
    }
  }, [timeline, fetchEpics]);

  const totalMember = Cookies.get("totalMember"); // 쿠키에서 가져온 값은 문자열

  // 쿠키 값이 없거나 숫자 형식으로 변환할 수 없을 경우 기본값 0 설정
  const totalMemberCount = totalMember ? parseInt(totalMember, 10) : 0;

  return (
    <div className="timeline-all">
      <div className="topbar">
        {/* 사용자 그룹 */}
        <div className="userGrop">
          {[...Array(Math.min(totalMemberCount, 3))].map((_, index) => (
            <FaUserCircle className="userIcon" key={index} size={35} />
          ))}

          {/* 나머지 인원 표시 */}
          {totalMemberCount > 3 && (
            <div className="userShow">+{totalMemberCount - 3}</div>
          )}
        </div>

        <ButtonContainer>
          <ButtonPart onClick={() => multiButton("month")}>월</ButtonPart>
          <Divider>|</Divider>
          <ButtonPart onClick={() => multiButton("week")}>주</ButtonPart>
          <Divider>|</Divider>
          <ButtonPart onClick={() => multiButton("day")}>일</ButtonPart>
        </ButtonContainer>
      </div>

      <div className="timeline-container">
        {/* 왼쪽 사이드바 */}
        <div className="sidebar">
          <div className="blank"></div>

          <div className="sideEpic">
            {/* 에픽 제목, 진척도 사이드바에 추가 */}
            {epics.length > 0 ? (
              epics.map((epic, index) => {
                const epicTitle = epic.epicTitle;

                const totalIssues = epic.epicProgressStatus.totalIssues;
                const completedIssues = epic.epicProgressStatus.completedIssues;

                return (
                  <div
                    key={index}
                    className="epic-item"
                    onClick={() => showDetailEpic(epic)}
                  >
                    <div className="epic-header">
                      <div className="epic-title">{epicTitle}</div>
                      <IoIosAdd
                        className="add"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleIssueModal();
                        }}
                      />
                    </div>

                    {/* 진행도 표시 */}
                    <div style={{ margin: "10px 0" }}>
                      <Progress
                        total={totalIssues}
                        completed={completedIssues}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p>에픽이 없습니다.</p>
            )}
          </div>
          <div className="sideButton">
            <Button
              bgColor="#000"
              padding="10px 30px"
              radius="20px"
              color="#fff"
              fontSize="15px"
              style={{
                position: "relative",
                fontWeight: "bold",
                marginTop: "auto",
              }}
              onClick={toggleEpicModal}
            >
              <IoIosAdd
                size={20}
                style={{ position: "absolute", left: 0, marginLeft: "12px" }}
              />
              에픽만들기
            </Button>
          </div>
        </div>

        <div className="timeline-area">
          <div id="timeline" className="timeline" ref={timelineRef} />
        </div>

        {selectedEpic && (
          <EpicDetail
            epic={selectedEpic}
            onClose={() => setSelectedEpic(null)}
            onAddIssue={addIssue}
            epicId={selectedEpic.epicId}
          />
        )}

        {selectedIssue && (
          <IssueDetail
            issue={selectedIssue}
            onClose={() => setSelectedIssue(null)}
            epicId={selectedIssue.epicId}
            id={selectedIssue.id}
          />
        )}
      </div>

      {isEpicModalOpen && (
        <Modal isOpen={isEpicModalOpen} onClose={toggleEpicModal}>
          <h2>에픽 만들기</h2>
          <Content>
            <span>할 일</span>
            <TitleWrapper>
              <TitleIcon />
              <TitleInput
                placeholder="무엇을 완료해야 하나요?"
                value={newEpic}
                onChange={(e) => setNewEpic(e.target.value)}
              />
            </TitleWrapper>

            <span>시작일 ~ 종료일</span>
            <DateWrapper>
              <DateInput
                type="date"
                value={epicStartDate}
                onChange={(e) => setEpicStartDate(e.target.value)}
              />
              <span> ~ </span>
              <DateInput
                type="date"
                value={epicEndDate}
                onChange={(e) => setEpicEndDate(e.target.value)}
              />
            </DateWrapper>
          </Content>
          <ButtonBox>
            <Button
              padding="6px 6px"
              bgColor="#7895B2"
              fontSize="16px"
              style={{ fontWeight: "bold" }}
              onClick={() => {
                addEpic(); // addIssue 함수 호출
                toggleEpicModal(); // toggleIssueModal 함수 호출
              }}
            >
              생성
            </Button>
          </ButtonBox>
        </Modal>
      )}

      {isIssueModalOpen && selectedEpic && (
        <Modal isOpen={isIssueModalOpen} onClose={toggleIssueModal}>
          <h2>이슈 만들기</h2>
          <Content>
            <span>할 일</span>
            <TitleWrapper>
              <TitleIcon />
              <TitleInput
                placeholder="무엇을 완료해야 하나요?"
                value={newIssue}
                onChange={(e) => setNewIssue(e.target.value)}
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
                value={mainMember}
                onChange={(e) => setMainMember(e.target.value)}
              />
            </TitleWrapper>

            <span>진행 상태</span>
            <SelectWrapper>
              <SelectStatus value={status} onChange={handleChange}>
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
              onClick={() => {
                addIssue(selectedEpic.epicId); // addIssue 함수 호출
                toggleIssueModal(); // toggleIssueModal 함수 호출
              }}
            >
              생성
            </Button>
          </ButtonBox>
        </Modal>
      )}
    </div>
  );
};

export default Timeline;
