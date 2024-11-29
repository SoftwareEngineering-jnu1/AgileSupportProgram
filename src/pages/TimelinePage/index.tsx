import React, { useEffect, useRef, useState } from 'react';
import { DataSet, TimelineTimeAxisScaleType, Timeline as VisTimeline } from 'vis-timeline/standalone';
import Button from '@components/common/Button';
import { IoIosAdd, IoIosClose } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import './Timeline.css';
import type { Epic, Item, Issue, EpicDetailProps, IssueDetailProps } from './type';
import { Modalepic, ModalepicContent, ButtonContainer, ButtonPart, Divider, EpicDetailContainer, IssueDetailContainer, EditingContainer } from './style';

const Timeline = () => {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [newEpic, setNewEpic] = useState('');
  const [newIssue, setNewIssue] = useState('');
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [timeline, setTimeline] = useState<VisTimeline | null>(null);
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  
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

        const epicstart = new Date(2024,11,5);
        const epicend = new Date(2024,11,30);
        
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
        
      });

      return () => createtimeline.destroy();
    }
  }, [epics]);

  // 에픽 추가
  const addEpic = () => {
    if (newEpic) {
      setEpics([...epics, { title: newEpic, progress:0, issues:[]}]);
      setNewEpic('');
      setEpicModal(false);
    }
  };

  // 에픽 상세보기 이벤트
  const showDetailEpic = (epic: Epic) => {
    setSelectedEpic(epic);
  }

  // 이슈 상세보기 이벤트
  const showDetailIssue = (issue: Issue) => {
      setSelectedIssue(issue);
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
          <div className="issue-title">
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

      </IssueDetailContainer>
    )
  }

  const EpicDetail = ({epic, onClose}: EpicDetailProps) => {
    const [editTitle, setEditTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(epic.title);

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

    return (
      <EpicDetailContainer>
        <IoIosClose className="close" onClick={onClose} />
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

          <div className='progress-bar' style={{ margin: '0 20px', padding: '8px', borderRadius: '10px'  }}>
            <div className='progress' style={{ width: `${epic.progress}%` }}></div>
          </div>
        
          <div className='epic-title2' style={{fontSize: '15px', fontWeight: 'normal'}}>하위 이슈</div>
          <div className='issueContainer'>
            <div>
                {epic.issues.map((issue, index) => (
                  <div className='issueList' key={index} onClick={()=> showDetailIssue(issue)}>{issue.title}</div>
                ))}
              </div>

            <div className='issueAdd'>
              <IoIosAdd className='add'/>
              <div style={{fontSize: '15px', marginTop:'2px'}}>이슈 만들기</div>
            </div>
          </div>

      </EpicDetailContainer>
    );
  }

  // 하위 이슈 추가
  const addIssue = (epicIndex: number) => {
    if (newIssue) {
      const updatedEpics = [...epics];
      const newIssueTitle : Issue = { title: newIssue, assign: ''};
      updatedEpics[epicIndex].issues.push(newIssueTitle);
      setEpics(updatedEpics);
      setNewIssue('');
    }
  }
  
  // 모달 생성
  const [epicModal, setEpicModal] = useState(false);
  const epicModalRef = useRef<HTMLDivElement | null>(null);

  // 하위 이슈 추가 버튼 클릭 시 하위 이슈 추가 모달 표시
  const addIssueModal = (epicIndex: number) => {
    setSelectedEpic(epics[epicIndex]); // 클릭한 에픽을 선택
    setEpicModal(true); // 모달 표시
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
              {/*에픽 제목, 진척도 사이드바에 추가*/}
              {epics.map((epic, index) => (
                <div key={index} className='epic-item' onClick={() => showDetailEpic(epic)}>
                  <div className='epic-header'>
                    <div className='epic-title1'>{epic.title}</div>
                    <IoIosAdd className='add' onClick={()=> addIssueModal(index)}/>
                  </div>
                  <div className='progress-bar'>
                    <div className='progress' style={{ width: `${epic.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className='sideButton'>
              <Button
                bgColor="#000"
                padding="10px 30px"
                radius="20px"
                color="#fff"
                fontSize="15px"
                style={{ position:'relative', fontWeight:'bold', marginTop: 'auto', }}
                onClick ={() => setEpicModal(true)}
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

        {/*모달*/}
        {epicModal && (
          <Modalepic onClick={() => setEpicModal(false)}>
            <ModalepicContent ref={epicModalRef} onClick={e => e.stopPropagation()}>
              <div className="epicModalposition">
                <p style={{fontWeight:'bold', alignItems:'flex-start'}}>에픽만들기</p>
                <p>할 일</p>
                <input
                  value={newEpic}
                  onChange={(e) => setNewEpic(e.target.value)}
                  placeholder="무엇을 완료해야 하나요?"
                />
                <br/>
                <Button
                  bgColor="#AEBDCA"
                  padding="20"
                  fontSize="15px"
                  onClick={addEpic} // 에픽 추가
                >만들기</Button>
              </div>
              
            </ModalepicContent>
          </Modalepic>
        )}

        {epicModal && selectedEpic && (
          <Modalepic onClick={() => setEpicModal(false)}>
            <ModalepicContent ref={epicModalRef} onClick={e => e.stopPropagation()}>
              <div className="epicModalposition">
                <p style={{ fontWeight: 'bold' }}>하위 이슈 추가</p>
                <input
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  placeholder="이슈를 입력하세요"
                />
                <br />
                <Button
                  bgColor="#AEBDCA"
                  padding="20"
                  fontSize="15px"
                  onClick={() => addIssue(epics.indexOf(selectedEpic!))}
                >추가</Button>
              </div>
            </ModalepicContent>
          </Modalepic>
        )}

    </div>
  );
};

export default Timeline;