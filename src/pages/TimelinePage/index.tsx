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


import type { Epic, EpicResponse, Item, Issue, EpicDetailProps, IssueDetailProps, IssueStatus } from './type';
import { Content, TitleWrapper, TitleIcon, TitleInput, ButtonBox, SelectWrapper, SelectStatus } from './style';
import { DateWrapper, DateInput, AssignIcon } from './style';
import { ButtonContainer, ButtonPart, Divider, EpicDetailContainer, IssueDetailContainer, EditingContainer } from './style';

import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import './Timeline.css';

const Timeline = () => {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [newEpic, setNewEpic] = useState('');
  const [newIssue, setNewIssue] = useState('');

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
    id: `${index}`,
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

  // 에픽 추가
  const addEpic = () => {
    const startDate = new Date(epicStartDate).toISOString(); // ISO 문자열로 변환
    const endDate = new Date(epicEndDate).toISOString(); // ISO 문자열로 변환
  
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
          // API 응답에서 제목을 가져옵니다.
          const title = response.data.title;
  
          // 새로운 에픽 데이터 생성
          const newEpicData = {
            epicTitle: title,
            epicStartDate: startDate,
            epicEndDate: endDate,
            epicProgressStatus: {
              totalIssues: 0,
              completedIssues: 0,
            },
            issues: [],
          };
  
          // 기존 에픽과 새로운 에픽을 합침
          const updatedEpics = [...epics, newEpicData];
          setEpics(updatedEpics); // 상태 업데이트
  
          console.log("에픽 생성 완료", updatedEpics);
  
          // 타임라인 아이템 추가
          if (timeline && itemsRef.current && groupsRef.current) {
            itemsRef.current.clear(); // 기존 아이템 제거
            groupsRef.current.clear(); // 기존 그룹 제거
  
            updatedEpics.forEach((epic, index) => {
              // 그룹 추가
              groupsRef.current.add({
                id: index, // 그룹 ID
                content: epic.epicTitle, // 그룹 제목
              });
  
              addTimelineItem(epic, index); // 아이템 추가 함수 호출
            });
  
            timeline.setGroups(groupsRef.current); // 타임라인 그룹 설정
            timeline.setItems(itemsRef.current); // 타임라인 아이템 설정
            timeline.fit(); // 타임라인을 화면에 맞게 조정
  
            console.log("타임라인 업데이트 완료");
  
            // 입력 필드 초기화
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
  const addIssue = (epicIndex: number) => {
    const startDate = new Date(issueStartDate).toISOString();
    const endDate = new Date(issueEndDate).toISOString();

    if (newIssue) {
      const issueData = {
        title:newIssue,
        mainMemberName: mainMember,
        progressStatus: status,
        startDate:startDate,
        endDate:endDate,
      };

      console.log("전송할 데이터:", issueData);

      fetchInstance
      .post(`/project/${projectId}/${epicIndex + 1}/addissue`, issueData)  // 이슈 데이터 전송
      .then((response) => {
        const title = response.data.title;

        const newIssueData = {
          issueTitle:title,
          mainMemberName: mainMember,
          progressStatus: status,
          issueStartDate:startDate,
          issueEndDate:endDate,
        };
        console.log("이슈 추가", response.data);
    
        // 에픽에 이슈 추가 후 상태 갱신
        setEpics((prevEpics) => {
          return prevEpics.map((epic, index) => {
            if (index === epicIndex) {
               // 새로운 에픽 데이터 생성
       
              return {
                ...epic,
                issues: [...epic.issues, newIssueData], // 새 이슈를 에픽에 추가
              };
            }
            return epic;
          });
        });
                  
          // 입력 필드 초기화
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
  const showDetailIssue = (issue: Issue, epicIndex:number) => {
      setSelectedIssue({...issue});
  }

  // 이슈 상세보기 창
  const IssueDetail = ({issue, onClose}: IssueDetailProps) =>{
    const [editTitle, setEditTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(issue.issueTitle);

    const handleEdit = () => {
      setEditTitle(true);
    };

    const handleSave = () => {
      if (!editedTitle) return;
      issue.issueTitle = editedTitle;
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
              {editedTitle || issue.issueTitle}
              <IoPencil className='edit-title' onClick={handleEdit} />
          </>
        )}
            </div>

            <div className='epic-title2' style={{fontSize: '15px', fontWeight: 'normal'}}>담당자</div>
            <div className='issueContainer'>
              <div className='issueAdd'>
                <FaUserCircle size={30}/>
               <div style={{fontSize: '15px', padding:'5px', marginTop:'2px'}}>{issue.mainMemberName=== '000' ? issue.mainMemberName: '000'}</div>
              </div>
            </div>
      </IssueDetailContainer>
    )
  }

  

  const EpicDetail = ({ epic, onClose, epicIndex }: EpicDetailProps) => {
    const [editTitle, setEditTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(epic.epicTitle);  
    const [isFetched, setIsFetched] = useState(false);
    const [subIssues, setSubIssues] = useState<string[]>([]); // 하위 이슈 목록
    const [progress, setProgress] = useState({ totalIssues: 0, completedIssues: 0 }); // 진행률

    useEffect(() => {
      // 이미 데이터가 로드된 상태인지 체크하여 다시 호출하지 않도록 설정
      if (isFetched) return;
    
      fetchInstance
        .get(`/project/${projectId}/${epicIndex + 1}/edit`)
        .then((response) => {
          console.log("에픽 상세보기 성공", response.data);
    
          const { epicProgressStatus = { totalIssues: 0, completedIssues: 0 }, subIssueTitle = [] } = response.data;
          setProgress({
            totalIssues: epicProgressStatus.totalIssues,
            completedIssues: epicProgressStatus.completedIssues,
          });
          setSubIssues(subIssueTitle);
        })
        .catch((error) => {
          console.log("에픽 상세보기 실패", error);
        });
    }, [projectId, epicIndex]);
    

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
  
    return (
      <EpicDetailContainer>
        <IoIosClose className="close" onClick={onClose} />
        <div className="sprint-title">Sprint1</div>
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
  
        {/* 진행률 표시 */}
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
              <div key={index} style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>
                {issue}
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
 const [status, setStatus] = useState<IssueStatus>('to do');
 const handleChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
  setStatus(e.target.value as IssueStatus);
}
const [mainMember, setMainMember] = useState<string>(''); 
const handleMemberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setMainMember(event.target.value); // 담당자 입력값 업데이트
};

const fetchEpics = () => {
  fetchInstance
    .get<EpicResponse>(`/project/${projectId}/timeline`) 
    .then((response) => {
      console.log("응답 데이터", response.data); 
      const data = response.data.data; 
      const epicsList: Epic[] = Object.values(data).flat() 
      
      setEpics(epicsList); 
      console.log("에픽 목록 호출 성공", epicsList);


      // 타임라인 아이템 설정
      if (timeline && itemsRef.current && groupsRef.current) {
        itemsRef.current.clear(); // 기존 아이템을 제거

        // 그룹을 초기화 또는 추가
        groupsRef.current.clear(); // 기존 그룹을 제거 (필요한 경우)
        epicsList.forEach((epic, index) => {
          // 새로운 그룹 추가
          groupsRef.current.add({
            id: index, // 그룹 ID
            content: `그룹 ${index}`, // 그룹의 콘텐츠 (원하는 대로 설정)
          });

          addTimelineItem(epic, index); // 아이템 추가 함수 호출
        });

        timeline.setGroups(groupsRef.current); // 타임라인에 그룹 설정
        timeline.setItems(itemsRef.current); // 타임라인에 아이템 설정
        timeline.fit(); // 타임라인 조정
      }
    })
    .catch((error) => {
      console.log("에픽 목록 호출 실패", error);
    });
};
 // 컴포넌트가 렌더링된 후 에픽 데이터 불러오기
 useEffect(() => {
  if (timeline) {
    fetchEpics(); // 타임라인이 준비되었으면 에픽 데이터 호출
  }
}, [timeline]); // timeline 상태가 설정되면 실행


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
                  ? epic.issues.filter((issue) => issue.progressStatus === "done").length
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

          {/* 타임라인 */}
          <div className='timeline-area'>
            <div id='timeline' className='timeline' ref={timelineRef} />
          </div>

          {selectedEpic && (
          <EpicDetail epic={selectedEpic} onClose={() => setSelectedEpic(null)} onAddIssue={addIssue}  epicIndex={epics.findIndex((epic) => epic === selectedEpic)} />
        )}

          {selectedIssue && (
          <IssueDetail issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
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
                onChange={handleMemberChange}
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
              onClick={() => addIssue(epics.indexOf(selectedEpic!))}
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

