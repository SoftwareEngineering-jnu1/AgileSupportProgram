import React, { useEffect, useRef, useState } from 'react';
import { DataSet, Timeline as VisTimeline } from 'vis-timeline/standalone';
import Button from '@components/common/Button';
import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";

import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import './Timeline.css';

// 에픽 타입 정의
type Epic = {
  title: string;
  progress:number; //진행률
};

// Item 타입 정의
type Item = {
  id: string;
  content: string;
  start: Date;
  end: Date;
  group: number;
};

const Timeline = () => {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [newEpic, setNewEpic] = useState('');
  const timelineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (timelineRef.current) {
      // 데이터셋 초기화
      const items = new DataSet<Item>([]);
      const groups = new DataSet<{ id: number; content: string }>();

      //날짜 설정
      const today = new Date();
      const startdate = new Date(today.getFullYear()-2, today.getMonth(), today.getDate());
      const enddate = new Date(today.getFullYear()+2, today.getMonth(), today.getDate());
      
      // 타임라인 옵션 설정
      const options = {
        start: startdate,
        end: enddate,
        editable: true,
        margin: { item: 10 },
        orientation: 'top',
        movable : false,
        zoomMin : 1000 * 60 * 60 * 24 * 30,  //최소 줌 1개월
        zoomMax : 1000 * 60 * 60 * 24 * 365 * 4 //최대 줌 4년
      };
      //타임라인 생성
      const timeline = new VisTimeline(timelineRef.current, items, groups, options);

      
      // 에픽마다 그룹 추가
      epics.forEach((epic, epicIndex) => {
        // 그룹 생성 (에픽 제목이 왼쪽에 표시됨)
        groups.add({ id: epicIndex, content: epic.title });

        const epicstart = new Date(2024,11,5);
        const epicend = new Date(2024,11,30);
        /*
        // 각 스프린트를 그룹에 추가
        epic.sprints.forEach((sprint, sprintIndex) => {
          const startDate = new Date();
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 7 * (sprintIndex + 1));
        */
          items.add({
            id: `${epicIndex}`,
            content: epic.title,
            start: epicstart,
            end: epicend,
            group: epicIndex, // 에픽의 인덱스에 해당하는 그룹 ID로 지정
          });
      //  });
      });

      return () => timeline.destroy();
    }
  }, [epics]);

  // 에픽 추가
  const addEpic = () => {
    if (newEpic) {
      setEpics([...epics, { title: newEpic, progress:0}]);
      setNewEpic('');
    }
  };

  const [epicModal, setEpicModal] = useState(false);
  const epicModalRef = useRef<HTMLDivElement | null>(null);


  return (
      <div className="timeline-all">
        {/*사용자 그룹 */}
        <div className="timeline-container">
          {/* 왼쪽 사이드바 */}
          <div className="sidebar">
            <div className='blank'></div>
            
            {/*에픽 제목, 진척도 사이드바에 추가*/}
            {epics.map((epic, index) => (
              <div key={index} className="epic-item">
                <div className="epic-title">{epic.title}</div>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${epic.progress}%` }}></div>
                </div>
              </div>
            ))}

            <Button
              title="에픽 만들기"
              bgColor="#000"
              padding="5px 30px"
              radius="20px"
              color="#fff"
              fontSize="15px"
              style={{ fontWeight: "bold", marginTop: 'auto' }}
              onClick ={() => setEpicModal(true)}
            >
              <IoIosAdd/>
            </Button>
          </div>

          {/* 타임라인 */}
          <div className="timeline-area">
            <div id="timeline" className="timeline" ref={timelineRef} />
          </div>
        </div>

        {/*에픽 생성 모달창*/}
        {epicModal && (
          <Modalepic onClick={() => setEpicModal(false)}>
            <ModalepicContent ref={epicModalRef} onClick={e => e.stopPropagation()}>
              <h3 style={{ fontWeight: "bold", alignSelf: 'flex-start'}}>에픽 만들기</h3>
              <br/>
              <h4>할일</h4>
              <input
                value={newEpic}
                onChange={(e) => setNewEpic(e.target.value)}
                placeholder="무엇을 완료해야 하나요?"
              />
              <br/>
              <Button
                title="만들기"
                bgColor="#AEBDCA"
                padding="20"
                style={{ alignSelf: 'flex-end' }}
                onClick={addEpic} // 에픽 추가
              />
            </ModalepicContent>
          </Modalepic>
        )}
      </div>
  );
};

export default Timeline;

const Modalepic = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  `;

const ModalepicContent = styled.div`
  background: #EEEEEE;
  padding: 20px;
  border-radius: 5px;
  width: 400px; // 원하는 너비로 설정
  max-width: 90%; // 화면이 작을 때의 최대 너비
`;
