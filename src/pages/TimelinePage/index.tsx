import React, { useEffect, useRef, useState } from 'react';
import { DataSet, DataItem, DataGroup, TimelineTimeAxisScaleType, Timeline as VisTimeline } from 'vis-timeline/standalone';

import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import Progress from '@components/common/Progress';
import { useProject } from "@context/ProjectContext";
import { fetchInstance } from "@api/instance";

import { IoIosAdd, IoIosClose } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";


import type { Epic, EpicResponse, Issue, EpicDetailProps, IssueDetailProps, IssueStatus } from './type';
import { Content, TitleWrapper, TitleIcon, TitleInput, ButtonBox, SelectWrapper, SelectStatus } from './style';
import { DateWrapper, DateInput, AssignIcon } from './style';
import { ButtonContainer, ButtonPart, Divider, EpicDetailContainer, IssueDetailContainer, EditingContainer } from './style';


import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import './Timeline.css';

const Timeline = () => {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [newEpic, setNewEpic] = useState('');
  const [newIssue, setNewIssue] = useState('');
  const [mainMember, setMainMember] = useState('');

  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [timeline, setTimeline] = useState<VisTimeline | null>(null);

  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const [epicStartDate, setEpicStartDate] = useState('');
  const [epicEndDate, setEpicEndDate] = useState('');

  const [issueStartDate, setIssueStartDate] = useState('');
  const [issueEndDate, setIssueEndDate] = useState('');


  const itemsRef = useRef<DataSet<DataItem>>(new DataSet<DataItem>()); // 초기화
  const groupsRef = useRef<DataSet<DataGroup>>(new DataSet<DataGroup>()); // 초기화

  const users = ["User1", "User2", "User3", "User4"];

  const { projectId } = useProject();

  // 타임라인 생성
  useEffect(() => {
       if (timelineRef.current) {
      // 데이터셋 초기화
      const items = new DataSet<DataItem>([]); // DataItem 타입 지정
      const groups = new DataSet<DataGroup>([]); // DataGroup 타입 지정

      itemsRef.current = items;
      groupsRef.current = groups;

      //날짜 설정
      const today = new Date();
      const startDate = new Date(today.getFullYear()-2, today.getMonth(), today.getDate());
      const endDate = new Date(today.getFullYear()+2, today.getMonth(), today.getDate());

      // 초기 표시할 4개월 범위 설정
      const minDate = new Date(today.getFullYear(), today.getMonth() -1, today.getDate());
      const maxDate = new Date(today.getFullYear(), today.getMonth() +6, today.getDate());

      const options = {
        min: startDate,
        max: endDate,

        moveable: true,
        editable: {
          remove: false, // 아이템 삭제 비활성화
        },
        margin: { item: 10 },
        orientation: 'top',

        timeAxis: {
          scale: 'month' as TimelineTimeAxisScaleType,
          step: 1,
        },

      };
      const createtimeline = new VisTimeline(timelineRef.current, items, groups, options);
      setTimeline(createtimeline);

      createtimeline.setWindow(minDate, maxDate, {animation: false});
      
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

  // 아이템 생성
  const newItem = {
    id: epic.epicId,
    content: epic.epicTitle,
    start: startDate,
    end: endDate,
    group: index,
    type: 'range',
    style: 'background-color: #495C78; border-color: #000000;',
  };

  console.log("추가할 아이템", newItem); // 아이템 로그 확인
  itemsRef.current.add(newItem); // 아이템 추가
};

const addIssueTimelineItem = (issue: Issue, epicId: number) => {
  const startDate = new Date(issue.issueStartDate);
  const endDate = new Date(issue.issueEndDate);

  // 타임라인 아이템 생성
  const newIssueItem = {
    id: issue.id, // 타임라인 라이브러리의 고유 ID
    content: `<div id="timeline-item-${issue.id}">${issue.title}</div>`, // DOM 요소에 ID 추가
    start: startDate,
    end: endDate,
    group: epicId,
    type: 'range',
    style: 'background-color: #AEBDCA; border-color: #000000;',
  };

  console.log("타임라인 아이템 추가:", newIssueItem);
  itemsRef.current.add(newIssueItem); // 타임라인에 아이템 추가

   // 렌더링이 완료된 후 DOM 확인
  setTimeout(() => {
    const element = document.getElementById(`timeline-item-${issue.id}`);
    if (element) {
      console.log("타임라인 DOM 요소 생성됨:", element.id);
    } else {
      console.error("타임라인 DOM 요소 생성 실패:", `timeline-item-${issue.id}`);
    }
  }, 100); // 렌더링 완료 대기
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
          console.log("에픽 ID:", id);
  
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
  
          console.log("에픽 생성 완료", updatedEpics);

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
  
            console.log("타임라인 업데이트 완료");
  
            setNewEpic(""); 
            setEpicStartDate(""); 
            setEpicEndDate("");
          }
        })
        .catch((error) => {
          console.error("에픽 생성 실패", error.response?.data || error.message);
        });
    } else {
      console.log("비어있는 항목이 있습니다.");
    }
  };
  
  // 하위 이슈 추가
  const addIssue = (epicId:number) => {
    const startDate = new Date(issueStartDate).toISOString();
    const endDate = new Date(issueEndDate).toISOString();

    if (newIssue && mainMember) {
      const issueData = {
        title:newIssue,
        mainMemberName: mainMember,
        progressStatus: status,
        startDate:startDate,
        endDate:endDate,
      };

      console.log("전송할 데이터:", issueData);

      fetchInstance
      .post(`/project/${projectId}/${epicId}/addissue`, issueData) 
      .then((response) => {
  
        console.log("응답 데이터:", response.data);
        const newIssueData = {
          id: response.data.id,
          epicId: epicId,
          title: response.data.title,
          mainMemberName: response.data.mainMemberName,
          progressStatus: status,
          issueStartDate: startDate,
          issueEndDate: endDate,
          hasDependency: false,
        };
        console.log("이슈 추가", response.data);
    
        setEpics((prevEpics) => {
          return prevEpics.map((currentEpic) => {
            if (currentEpic.epicId === epicId) {
              return {
                ...currentEpic,
                issues: [...currentEpic.issues, newIssueData], 
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
            console.log("타임라인 업데이트 완료");
          }
        }
          setNewIssue("");
          setIssueStartDate("");
          setIssueEndDate("");
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
  }

  // 이슈 상세보기 이벤트
    const showDetailIssue = (issue: Issue, epicId:number) => {
      console.log("Selected Issue:", issue);
      setSelectedIssue({...issue, epicId});
  }
  
  // 이슈 상세보기 창
  const IssueDetail = ({issue, onClose, epicId, id}: IssueDetailProps) =>{
    const [editTitle, setEditTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(issue.title);

    useEffect(() => {
      
      fetchInstance
        .get(`/project/${projectId}/${epicId}/${id}/edit`)
        .then((response) => {
          console.log("이슈 상세보기 성공", response.data);
    
        })
        .catch((error) => {
          console.log("이슈 상세보기 실패", error);
        });
    }, [projectId, epicId, id]);

    const handleEdit = () => {
      setEditTitle(true);
    };

    const handleSave = () => {
      if (!editedTitle) return;
      issue.title = editedTitle;
      setEditTitle(false);
    };

    return (
      <IssueDetailContainer>
        <IoIosClose className="close" onClick={onClose} />
        <div className="sprint-title">{(issue as any).epicTitle}</div>
          <div className="epic-title2">
            {editTitle ? (
              <EditingContainer>
                <div
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onInput={(e) => setEditedTitle(e.currentTarget.textContent || "")}
                  ref={(el) => el && el.focus()}
                >
                  {editedTitle}
                </div>
                <Button
                  bgColor="#000"
                  padding="2px 8px"
                  radius="10px"
                  color="#fff"
                  fontSize="10px"
                  onClick={handleSave}
                >
                  완료
                </Button>
              </EditingContainer>
          ) : (
            <>
              {editedTitle || issue.title}
              <IoPencil className='edit-title' onClick={handleEdit} />
          </>
        )}
            </div>

            <div className='epic-title2' style={{fontSize: '15px', fontWeight: 'normal'}}>담당자</div>
            <div className='issueContainer'>
              <div className='issueAdd'>
                <FaUserCircle size={30}/>
               <div style={{fontSize: '15px', padding:'5px', marginTop:'2px'}}>{issue.mainMemberName}</div>
              </div>
            </div>
      </IssueDetailContainer>
    )
  }
 
  const [dependency, setDependency] = useState<{ [key: number]: string }>(() => {
    const storedDependency = localStorage.getItem("dependency");
    return storedDependency ? JSON.parse(storedDependency) : {};
  });
  const updateDependency = (newDependency: { [key: number]: string }) => {
    setDependency(newDependency);
    localStorage.setItem("dependency", JSON.stringify(newDependency));
  };
  
  const visualizeDependencies = (dependency: { [key: number]: string }) => {
    const svgContainer = document.getElementById("dependency-svg");
    if (!svgContainer) return;
  
    svgContainer.innerHTML = ""; // 기존 선 초기화
  
    const startElement = document.getElementById(`timeline-item-${dependency[0]}`);
    const endElement = document.getElementById(`timeline-item-${dependency[1]}`);
  
    if (!startElement || !endElement) {
      console.error("의존 관계에 필요한 DOM 요소가 없습니다:", dependency);
      return;
    }
  
    const startRect = startElement.getBoundingClientRect();
    const endRect = endElement.getBoundingClientRect();
  
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;
  
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", startX.toString());
    line.setAttribute("y1", startY.toString());
    line.setAttribute("x2", endX.toString());
    line.setAttribute("y2", endY.toString());
    line.setAttribute("stroke", "red");
    line.setAttribute("stroke-width", "2");
  
    svgContainer.appendChild(line);
  };
  


  const EpicDetail = ({ epic, onClose, epicId }: EpicDetailProps) => {
    const [editTitle, setEditTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(epic.epicTitle);  
    const [isFetched, setIsFetched] = useState(false);
    const [subIssues, setSubIssues] = useState<Issue[]>([]); // 하위 이슈 목록
    const [progress, setProgress] = useState({ totalIssues: 0, completedIssues: 0 }); // 진행률
    const [selectedIssueD, setSelectedIssueD] = useState<string[]>([]);
    
 
    const handleSelectIssue = (issue: string) => {
      // 이미 선택된 이슈는 선택하지 않도록 처리 (선택된 이슈를 계속 "선택됨" 상태로 유지)
      if (!selectedIssueD.includes(issue)) {
        setSelectedIssueD((prevSelected) => [...prevSelected, issue]);
      }
    };
  
  // 의존도 설정 함수
  const handleDependency = () => {
    if (selectedIssueD.length === 2) {
      const [firstIssue, secondIssue] = selectedIssueD;
  
      const newDependency = {
        0: firstIssue,
        1: secondIssue,
      };
  
      // 기존 데이터와 새로운 의존 관계를 포함
      const updatedEpicData = {
        id: epic.epicId,
        title: epic.epicTitle,
        startDate: epic.epicStartDate,
        endDate: epic.epicEndDate,
        epicProgressStatus: epic.epicProgressStatus,
        subIssue: [...subIssues], // 기존 하위 이슈 데이터 유지
        dependency: newDependency, // 새로운 의존 관계 추가
      };
  
      updateDependency(newDependency);
      setSelectedIssueD([]); // 선택 초기화
  
      fetchInstance
        .post(`/project/${projectId}/${epicId}/edit`, updatedEpicData)
        .then((response) => {
          console.log("응답 데이터:", response.data);

          // 서버 응답 데이터가 비어있다면 이전 상태 유지
          setSubIssues((prevSubIssues) => {
            const updatedSubIssues = response.data.subIssues?.length
              ? response.data.subIssues
              : prevSubIssues;
            console.log("유지된 subIssues:", updatedSubIssues);
            return updatedSubIssues;
          });
        })
        .catch((error) => {
          console.error("요청 실패:", error);
        });

          }
        };
        
    useEffect(() => {
      if (isFetched) return;
    
      fetchInstance
        .get(`/project/${projectId}/${epicId}/edit`)
        .then((response) => {
          console.log("에픽 상세보기 성공", response.data);

          const issues = response.data.data.subIssues ;  
          console.log("subIssue:", issues);

          const { epicProgressStatus = { totalIssues: 0, completedIssues: 0 } } = response.data;
          setProgress({
            totalIssues: epicProgressStatus.totalIssues,
            completedIssues: epicProgressStatus.completedIssues,
          });
           
          setSubIssues(issues);  
          setIsFetched(true);  
          console.log("Dependency 데이터:", dependency);

        })
        .catch((error) => {
          console.log("에픽 상세보기 실패", error);
        });
    }, [projectId, epicId]);
    

    const handleEdit = () => {
      setEditTitle(true);
    };
  
    const handleSave = () => {
      const updatedEpics = epics.map((e) =>
        e === epic ? { ...e, title: editedTitle } : e
      );
      setEpics(updatedEpics);
      epic.epicTitle = editedTitle;
      setEditTitle(false);
    };
  
    const capitalize = (text: string) => {
      if (!text) return '';
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    return (
      <EpicDetailContainer>
        <IoIosClose className="close" onClick={onClose} />
        <div className="sprint-title"></div>
        <div className="epic-title2">
          {editTitle ? (
            <EditingContainer>
              <div
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={(e) => setEditedTitle(e.currentTarget.textContent || "")}
                ref={(el) => el && el.focus()}
              >
                {epic.epicTitle}
              </div>
              <Button
                bgColor="#000"
                padding="2px 8px"
                radius="10px"
                color="#fff"
                fontSize="10px"
                onClick={handleSave}
              >
                완료
              </Button>
            </EditingContainer>
          ) : (
            <>
              {editedTitle || epic.epicTitle}
              <IoPencil className="edit-title" onClick={handleEdit} />
            </>
          )}
        </div>
  
        <div style={{ margin: "0 10px", padding: "8px" }}>
          <Progress
            total={progress.totalIssues}
            completed={progress.completedIssues}
            height="20px"
            borderRadius="10px"
          />
        </div>
  
        {/* 하위 이슈 목록 */}
        <div className="epic-title2" style={{ fontSize: "15px", fontWeight: "normal" }}>
          하위 이슈
        </div>
        <div className="issueContainer">
         
        {subIssues.length > 0 ? (
          subIssues.map((issue, index) => (
            <div key={index} className="issueList" >
              <div onClick={() => showDetailIssue(issue, epic.epicId)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{issue.title}</span>
                </div>
              <div>
              {Object.keys(dependency).length === 0 && ( // 의존도가 없는 경우에만 버튼 렌더링
                <Button
                  padding="5px 5px"
                  radius="20px"
                  color="#fff"
                  fontSize="10px"
                  onClick={() => handleSelectIssue(issue.title)} // 의존 관계가 없는 이슈만 선택
                  style={{
                    backgroundColor: selectedIssueD.includes(issue.title) ? '#4caf50' : '#f0f0f0', // 선택된 이슈는 초록색 배경
                    color: selectedIssueD.includes(issue.title) ? 'white' : 'black', // 선택된 이슈는 흰색 텍스트
                  }}
                >
                  {selectedIssueD.includes(issue.title) ? '선택됨' : '의존도 설정'}
                </Button>
              )}
              </div>

                <span
                  className={`issueStatus ${issue.progressStatus.toLowerCase().replace(' ', '-')}`} // CSS 클래스 동적 할당
                >
                   {capitalize(issue.progressStatus)} {/* 첫 글자를 대문자로 변환 */}
                </span>
              </div>
          ))
        ) : (
          <div style={{ color: "#888", padding: "8px" }}>등록된 하위 이슈가 없습니다.</div>
          
        )}

          
          {/* 이슈 추가 버튼 */}
          <div className="issueAdd">
            <IoIosAdd className="add" onClick={toggleIssueModal} />
            <div style={{ fontSize: "15px", marginTop: "2px" }}>이슈 만들기</div>
          </div> 
          </div>
        {/* 의존도 설정 버튼 */}
      {selectedIssueD.length === 2 && (
        <div className='issueStatus'>
        <Button padding="5px 5px"
               radius="20px"
                color="#fff"
                fontSize="10px" 
                onClick={handleDependency} 
                style={{ margin:'3px' , fontWeight:'bold'}}>이슈 간 의존 관계 설정</Button>
        </div>
      )}
      </EpicDetailContainer>
    );
  };
  

  // 타임라인 단위 설정 버튼
  const multiButton = (type:string)=>{
    switch (type){
      case 'month' : 
        setRange('month'); break;
      case 'week' : 
        setRange('week'); break;
      case 'day' : 
        setRange('day'); break;
      default : break;
    }
  }

  // 타임라인 단위 설정 함수
  const setRange = (type: string)=>{
    if(!timeline) return;

    let scale: TimelineTimeAxisScaleType;
    let step: number;
    let minDate: Date;
    let maxDate: Date;

    const today = new Date();

    switch(type){
      case 'month':
        scale = 'month'; 
        step = 1;
        minDate = new Date(today.getFullYear(), today.getMonth() -1, today.getDate());
        maxDate = new Date(today.getFullYear(), today.getMonth() +6, today.getDate());        
        break;
      case 'week':
        scale = 'day';
        step = 7;
        minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        maxDate = new Date(today.getFullYear(), today.getMonth()+2, today.getDate());   
        break;
      case 'day':
        scale = 'day';
        step = 1;
        minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
        maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+14);         
        break; 
      default: return;
    }

    timeline.setOptions({
      timeAxis: { scale, step },
      
    });

    timeline.setWindow(minDate, maxDate);
  };

 // 진행 상태 드롭다운
 const [status, setStatus] = useState<IssueStatus>('To Do');
 const handleChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
  setStatus(e.target.value as IssueStatus);
}

const fetchEpics = () => {
  fetchInstance
    .get<EpicResponse>(`/project/${projectId}/timeline`) 
    .then((response) => {
      console.log("응답 데이터", response.data); 
      const data = response.data.data; 
      const epicsList: Epic[] = Object.values(data).flat();

      setEpics(epicsList); 
      console.log("에픽 목록 호출 성공", epicsList);
      epicsList.forEach((epic) => {
        if (dependency) {
          setDependency(dependency); // 의존 관계 상태 설정
        }
      });
  
      
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
    .catch((error) => {
      console.log("에픽 목록 호출 실패", error);
    });
};
useEffect(() => {
  if (timeline && dependency) {
    // 타임라인 렌더링 완료 후 의존 관계 시각화
    const timeoutId = setTimeout(() => {
      console.log("의존 관계 시각화 호출");
      visualizeDependencies(dependency);
    }, 100); // 렌더링 대기 시간 조정

    return () => clearTimeout(timeoutId);
  }
}, [timeline, dependency]);

 useEffect(() => {
  console.log("타임라인 DOM 요소 확인:");
  document.querySelectorAll("[id^='timeline-item-']").forEach((element) => {
    console.log("DOM 요소:", element.id);
  });
  if (timeline) {
    fetchEpics(); // 타임라인이 준비되었으면 에픽 데이터 호출
  }
}, [timeline]);


  // 전체 타임라인 페이지
  return (
      <div className='timeline-all'>
        <div className='topbar'>
          {/*사용자 그룹 */}
          <div className='userGrop'>
            {users.slice(0, 3).map((user, index) => (
            <FaUserCircle
              className='userIcon'
              key={index} 
              size={35} />
            ))}
           {users.length > 3 && <div className='userShow'>+{users.length - 3}</div>}
          </div>

          <ButtonContainer>
            <ButtonPart onClick={()=>multiButton('month')}>월</ButtonPart>
            <Divider>|</Divider>
            <ButtonPart onClick={()=>multiButton('week')}>주</ButtonPart>
            <Divider>|</Divider>
            <ButtonPart onClick={()=>multiButton('day')}>일</ButtonPart>
          </ButtonContainer>
        </div>

        <div className='timeline-container'>
          {/* 왼쪽 사이드바 */}
          <div className='sidebar'>
            <div className='blank'></div>
            
            <div className='sideEpic'>
              {/* 에픽 제목, 진척도 사이드바에 추가 */}
              
              {epics.length > 0 ? (
              epics.map((epic, index) => {
                const epicTitle = epic.epicTitle;

                // 이슈 개수와 완료된 이슈 개수 계산
                const totalIssues = epic.issues ? epic.issues.length : 0;  // 이슈 개수
                const completedIssues = epic.issues
                  ? epic.issues.filter((issue) => issue.progressStatus === "Done").length
                  : 0; // 완료된 이슈 개수

                return (
                  <div key={index} className="epic-item" onClick={() => showDetailEpic(epic)}>
                    <div className="epic-header">
                      <div className="epic-title">{epicTitle}</div>
                      <IoIosAdd className="add" onClick={(e) => { e.stopPropagation(); toggleIssueModal(); }} />
                    </div>
                    
                    {/* 진행도 표시 */}
                    <div style={{ margin: "10px 0" }}>
                      <Progress total={totalIssues} completed={completedIssues} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p>에픽이 없습니다.</p>
            )}

            </div>
            <div className='sideButton'>
              <Button
                bgColor="#000"
                padding="10px 30px"
                radius="20px"
                color="#fff"
                fontSize="15px"
                style={{ position:'relative', fontWeight:'bold', marginTop: 'auto', }}
                onClick ={toggleEpicModal}
            ><IoIosAdd size={20} style={{position:'absolute', left:0, marginLeft:'12px'}}/>에픽만들기</Button>
            </div>
          </div>

          <div className='timeline-area'>
            <div id='timeline' className='timeline' ref={timelineRef} />
            <svg
                id="dependency-svg"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              ></svg>
          </div>

          {selectedEpic && (
          <EpicDetail epic={selectedEpic} onClose={() => setSelectedEpic(null)} onAddIssue={addIssue}  epicId={selectedEpic.epicId} />
        )}

          {selectedIssue && (
          <IssueDetail issue={selectedIssue} onClose={() => setSelectedIssue(null)} epicId={selectedIssue.epicId} id={selectedIssue.id} />
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
                onChange={(e) => setNewEpic(e.target.value)} />
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
              onClick={addEpic}
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
                onChange={(e) => setNewIssue(e.target.value)} />
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
                onChange={(e)=>setMainMember(e.target.value)}
              />
            </TitleWrapper>
            
            <span>진행 상태</span>
            <SelectWrapper>
              <SelectStatus value={status} onChange={handleChange}>
                <option value="to do">To Do</option>
                <option value="in progress">In Progress</option>
                <option value="done">Done</option>
                <option value="hold">Hold</option>
              </SelectStatus>
            </SelectWrapper>
            
  
            </Content>
            <ButtonBox>
            <Button
              padding="6px 6px"
              bgColor="#7895B2"
              fontSize="16px"
              style={{ fontWeight: "bold" }}
              onClick={() => addIssue(selectedEpic.epicId)}
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

