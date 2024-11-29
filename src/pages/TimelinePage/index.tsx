import React, { useEffect, useRef, useState, useCallback } from 'react';
import { DataSet, TimelineTimeAxisScaleType, Timeline as VisTimeline } from 'vis-timeline/standalone';


import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import Progress from '@components/common/Progress';

import { IoIosAdd, IoIosClose } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";

import type { Epic, Item, Issue, EpicDetailProps, IssueDetailProps, IssueStatus } from './type';
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

  const users = ["User1", "User2", "User3", "User4"];

  useEffect(() => {
    if (timelineRef.current) {
      // 데이터셋 초기화
      const items = new DataSet<Item>([]);
      const groups = new DataSet<{ id: number; content: string }>();

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

        movable: false,
        editable: true,
        margin: { item: 10 },
        orientation: 'top',

   //     zoomMin : 1000 * 60 * 60 * 24 * 4 ,  //최소 줌 1개월
   //     zoomMax : 1000 * 60 * 60 * 24 * 365 * 4, //최대 줌 4년
        timeAxis: {
          scale: 'month' as TimelineTimeAxisScaleType,  // 초기 단위를 월로 설정
          step: 1,         // 1개월 단위
        },

      };
      //타임라인 생성
      const createtimeline = new VisTimeline(timelineRef.current, items, groups, options);
      setTimeline(createtimeline);

      createtimeline.setWindow(minDate, maxDate, {animation: false});

    // 에픽마다 그룹 추가
      epics.forEach((epic, epicIndex) => {
        // 그룹 생성 (에픽 제목이 왼쪽에 표시됨)
        groups.add({ id: epicIndex, content: epic.title });

        const epicstart = new Date();
        const epicend = new Date();
        
        items.add({
          id: `${epicIndex}`,
          content: epic.title,
          start: epicstart,
          end: epicend,
          group: epicIndex, 
          assign: '',
        });

        const issuestart = new Date();
        const issuesend = new Date();

        epic.issues.forEach((issue, issueIndex) => {
          items.add({
            id: `${epicIndex}-${issueIndex}`, // 고유한 아이디
            content: issue.title,
            start: issuestart,
            end: issuesend,
            group: epicIndex,
            assign: issue.assign || '',
          });
        });

        const dependency = epic.issues
  .map((issue, issueIndex) => {
    // issue.dependencies가 undefined일 경우 빈 배열로 초기화
    const dependencies = issue.dependencies || [];
    return dependencies.map((depId) => {
      return [issueIndex, depId]; // 의존도 관계 (이슈 인덱스 기준)
    });
  })
  .flat(); // 이중 배열을 평탄화

if (dependency.length > 0) {
  drawDependencies(dependency, createtimeline);
}
  
        
      });
      

      return () => createtimeline.destroy();
    }
  }, [epics]);

  const getItemPos = (item: any) => {
    if (!item) {
      // item이 undefined인 경우 기본값을 반환하거나 처리할 로직 추가
      console.warn('Item is undefined');
      return {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        mid_x: 0,
        mid_y: 0,
        width: 0,
        height: 0,
      };
    }

    const left_x = item.left;
     const top_y = item.parent ? (item.parent.top + item.parent.height - item.top - item.height) : 0;
    return {
      left: left_x,
      top: top_y,
      right: left_x + item.width,
      bottom: top_y + item.height,
      mid_x: left_x + item.width / 2,
      mid_y: top_y + item.height / 2,
      width: item.width,
      height: item.height,
    };
  };
  
  const drawArrows = useCallback(
    (i: number, j: number, timeline: any, dependencyPath: any[]) => {
      let item_i = getItemPos(timeline.itemSet.items[i]);
      let item_j = getItemPos(timeline.itemSet.items[j]);
      if (item_j.mid_x < item_i.mid_x) [item_i, item_j] = [item_j, item_i]; // 왼쪽에서 오른쪽으로 화살표 그리기
  
      const curveLen = item_i.height * 2; // 곡선의 길이
      item_j.left -= 10; // 화살표의 여백 공간
  
      // 의존성 화살표 경로 업데이트
      const path = dependencyPath[j];
      if (path && path.setAttribute) {
        path.setAttribute(
          'd',
          `M ${item_i.right} ${item_i.mid_y} C ${item_i.right + curveLen} ${item_i.mid_y} ${item_j.left - curveLen} ${item_j.mid_y} ${item_j.left} ${item_j.mid_y}`
        );
      }
    },
    [getItemPos] // getItemPos 함수에 의존
  );
  
  
  const drawDependencies = useCallback(
    (dependency: number[][], timeline: any) => {
      const dependencyPath: any[] = [];
      dependency.forEach((dep) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M 0 0');
        path.setAttribute('stroke', '#F00');
        path.setAttribute('stroke-width', '3');
        path.setAttribute('fill', 'none');
        path.setAttribute('marker-end', 'url(#arrowhead0)');
        dependencyPath.push(path);
        timeline.dom.center.appendChild(path);
      });
  
      dependency.forEach((dep, index) => {
        drawArrows(dep[0], dep[1], timeline, dependencyPath[index]);
      });
    },
    [drawArrows] // drawDependencies는 drawArrows에 의존하므로 포함
  );
  
  
  


  const [isEpicModalOpen, setIsEpicModalOpen] = useState(false);
  const toggleEpicModal = () => {
    setIsEpicModalOpen(!isEpicModalOpen);
  };

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const toggleIssueModal = () => {
    setIsIssueModalOpen(!isIssueModalOpen);
  };

  // 에픽 추가
  const addEpic = () => {
    if (newEpic) {
      setEpics([...epics, { title: newEpic, progress:0, issues:[]}]);
      setNewEpic('');
      toggleEpicModal();
    }
  };

  // 하위 이슈 추가
  const addIssue = (epicIndex: number, dependentIssues: number[]=[]) => {
    if (newIssue) {
      const updatedEpics = [...epics];
      const newIssueTitle : Issue = { 
        title: newIssue, 
        assign: '', 
        status: 'to do',  
        ...(dependentIssues.length > 0 && { dependencies: dependentIssues }),};
      updatedEpics[epicIndex].issues.push(newIssueTitle);
      setEpics(updatedEpics);
      setNewIssue('');
      toggleIssueModal();
    }
  }


  // 에픽 상세보기 이벤트
  const showDetailEpic = (epic: Epic) => {
    setSelectedEpic(epic);
  }

  // 이슈 상세보기 이벤트
  const showDetailIssue = (issue: Issue, epicTitle:string) => {
      setSelectedIssue({...issue, epicTitle});
  }

  const IssueDetail = ({issue, onClose}: IssueDetailProps) =>{
    const [editTitle, setEditTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(issue.title);

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
               <div style={{fontSize: '15px', padding:'5px', marginTop:'2px'}}>{issue.assign=== '000' ? issue.assign: '000'}</div>
              </div>
            </div>
      </IssueDetailContainer>
    )
  }

  const EpicDetail = ({epic, onClose}: EpicDetailProps) => {
    const [editTitle, setEditTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(epic.title);
    const [selectedDependency] = useState<{ [issueId: string]:number}>({});

    const handleEdit = () => {
      setEditTitle(true);
    };

    const handleSave = () => {
      const updatedEpics = epics.map((e) =>
        e === epic ? { ...e, title: editedTitle} : e );
        setEpics(updatedEpics);
        epic.title = editedTitle;
        setEditTitle(false);
    };

    const handleDependency = (issueId: string, dependentIssueTitle: string) => {
      
      // 에픽 찾기
      const targetEpic = epics.find(epic => 
        epic.issues.some(issue => `${epic.title}-${issue.title}` === issueId)
      );
    
      if (!targetEpic) return;
    
      // 원본 이슈 찾기
      const originalIssue = targetEpic.issues.find(
        issue => `${targetEpic.title}-${issue.title}` === issueId
      );
    
      // 의존 대상 이슈 찾기
      const dependentIssue = targetEpic.issues.find(
        issue => issue.title === dependentIssueTitle
      );
    
      if (!originalIssue || !dependentIssue) return;
    
      // 의존성 추가
      if (!originalIssue.dependencies) {
        originalIssue.dependencies = [];
      }
      
      // 중복 방지
      if (!originalIssue.dependencies.includes(targetEpic.issues.indexOf(dependentIssue))) {
        originalIssue.dependencies.push(
          targetEpic.issues.indexOf(dependentIssue)
        );
      }
    
        // 상태 업데이트
      const updatedEpics = epics.map(epic => ({
        ...epic,
        issues: epic.issues.map(issue => ({
          ...issue,
          dependencies: issue.dependencies ? [...issue.dependencies] : []
        }))
      }));
      setEpics(updatedEpics);
    
      // 타임라인 의존성 다시 그리기
      if (timeline) {
        const dependency = targetEpic.issues
          .map((issue, issueIndex) => {
            const deps = issue.dependencies || [];
            return deps.map(depId => [issueIndex, depId]);
          })
          .flat();
    
        if (dependency.length > 0) {
          drawDependencies(dependency, timeline);
        }
      }
    };

    const totalIssues = epic.issues.length;
    const completedIssues = epic.issues.filter(issues => issues.status==='done').length;

    return (
      <EpicDetailContainer>
        <IoIosClose className="close" onClick={onClose} />
        <div className="sprint-title">Sprint1</div> {/* 스프린트 제목을 받아와야함 */}
        <div className="epic-title2">
          {editTitle ? (
            <EditingContainer>
              <div
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={(e) => setEditedTitle(e.currentTarget.textContent || "")}
                ref={(el) => el && el.focus()}
              >
                {epic.title}
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
            {editedTitle || epic.title}
            <IoPencil className='edit-title' onClick={handleEdit} />
          </>
        )}
      </div>
          <div style={{ margin: '0 10px', padding: '8px' }}>
          <Progress total={totalIssues} completed={completedIssues} height='20px' borderRadius='10px' />
        </div>
          <div className='epic-title2' style={{fontSize: '15px', fontWeight: 'normal'}}>하위 이슈</div>
          <div className='issueContainer'>
            <div>
                {epic.issues.map((issue, index) => (
                  <div className='issueList' key={index} >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={()=> showDetailIssue(issue, epic.title)}>{issue.title}</div>
              {/* 의존도 설정은 어떤 형식으로 해야할지 */}
               
              <SelectWrapper>
                <SelectStatus
                  value={selectedDependency[`${epic.title}-${issue.title}`] || ''}  // 의존성 값을 표시
                  onChange={(e) => handleDependency(`${epic.title}-${issue.title}`, e.target.value)}  // 의존성 선택 시 처리
                >
                  <option value="">의존도 설정</option>
                  {epic.issues
                    .filter((otherIssue) => otherIssue.title !== issue.title)  // 자기 자신은 제외
                    .map((otherIssue, idx) => (
                      <option key={idx} value={otherIssue.title}>
                        {otherIssue.title}
                      </option>
                    ))}
                </SelectStatus>
              </SelectWrapper>
              
                    <div className={`issueStatus ${issue.status.replace(' ', '-').toLowerCase()}`}>
                      {issue.status === 'to do' ? 'To do' : issue.status}</div>
             
            </div>
          ))}
        </div>

            <div className='issueAdd'>
              <IoIosAdd className='add' onClick={toggleIssueModal} />
              <div style={{fontSize: '15px', marginTop:'2px'}}>이슈 만들기</div>
            </div>
          </div>

      </EpicDetailContainer>
    );
  }

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
 const [status, setStatus] = useState('to do');
 const handleChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
  setStatus(e.target.value as IssueStatus);
}

  
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
          {epics.map((epic, index) => {
            const totalIssues = epic.issues.length;
            const completedIssues = epic.issues.filter(issue => issue.status==='done').length;

            return (
              <div key={index} className='epic-item' onClick={() => showDetailEpic(epic)}>
                <div className='epic-header'>
                  <div className='epic-title1'>{epic.title}</div>
                  <IoIosAdd className='add' onClick={toggleIssueModal} />
                </div>
                {/* 진척도 표시 */}
                <Progress total={totalIssues} completed={completedIssues} />
              </div>
            );
          })}
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
          <EpicDetail epic={selectedEpic} onClose={() => setSelectedEpic(null)} onAddIssue={addIssue} />
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

