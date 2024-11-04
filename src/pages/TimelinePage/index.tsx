import React, { useEffect, useRef, useState } from 'react';
import { DataSet, Timeline as VisTimeline } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

// 에픽 타입 정의
type Epic = {
  title: string;
  sprints: string[];
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
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timelineRef.current) {
      // 데이터셋 초기화
      const items = new DataSet<Item>([]);
      const groups = new DataSet<{ id: number; content: string }>();

      // 타임라인 옵션 설정
      const options = {
        start: new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
        end: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
        editable: true,
        margin: { item: 10 },
        orientation: 'top',
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
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div ref={timelineRef} style={{ height: '100%' }} />
      </div>
    </div>
  );
};

export default Timeline;
