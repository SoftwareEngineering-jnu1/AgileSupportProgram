import React, { useEffect, useRef, useState } from 'react';
import { DataSet, Timeline as VisTimeline } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import './Timeline.css';

// 에픽 타입 정의
type Epic = {
  title: string;
  sprints: string[];
};

// 스프린트 타입 정의
type Sprint = {
  title: string;
  epics: string[];
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
  const [sprint, setSprint] = useState<Sprint[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [newEpic, setNewEpic] = useState('');
  const timelineRef = useRef(null);

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
        zoomMin : 1000 * 60 * 60 * 24 * 30,  //최소 줌 1개월
        zoomMax : 1000 * 60 * 60 * 24 * 365 * 4 //최대 줌 4년
      };
      const timeline = new VisTimeline(timelineRef.current, items, groups, options);

      // 에픽마다 그룹 추가
      epics.forEach((epic, epicIndex) => {
        // 그룹 생성 (에픽 제목이 왼쪽에 표시됨)
        groups.add({ id: epicIndex, content: epic.title });

        // 각 스프린트를 그룹에 추가
        epic.sprints.forEach((sprint, sprintIndex) => {
          const startDate = new Date();
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 7 * (sprintIndex + 1));

          items.add({
            id: `${epicIndex}-${sprintIndex}`,
            content: sprint,
            start: startDate,
            end: endDate,
            group: epicIndex, // 에픽의 인덱스에 해당하는 그룹 ID로 지정
          });
        });
      });

      return () => timeline.destroy();
    }
  }, [epics]);

  // 에픽 추가
  const addEpic = () => {
    if (newEpic) {
      setEpics([...epics, { title: newEpic, sprints: ['Sprint 1'] }]);
      setNewEpic('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 에픽 추가 입력란 및 버튼 */}
      <div style={{ padding: '10px', backgroundColor: '#f2f2f2', display: 'flex', alignItems: 'center' }}>
        <input
          value={newEpic}
          onChange={(e) => setNewEpic(e.target.value)}
          placeholder="새 에픽 제목 입력"
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={addEpic} style={{ padding: '5px 10px' }}>에픽 추가</button>
      </div>

      {/* 타임라인 */}
      <div className='timeline-area'>타임라인
        <div id='timeline' className='timeline' ref={timelineRef}/>
      </div>
    </div>
  );
};

export default Timeline;
