import React, { useState } from 'react';
import './Timeline.css'; // CSS 파일을 별도로 작성

// 에픽 타입 정의
type Epic = {
  title: string;
  sprints: string[];
};

const Timeline = () => {
  // 에픽 상태와 스프린트 상태의 타입을 명시적으로 지정
  const [epics, setEpics] = useState<Epic[]>([]);
  const [newEpic, setNewEpic] = useState('');
  const [newSprint, setNewSprint] = useState('');
  const [selectedEpicIndex, setSelectedEpicIndex] = useState<number | null>(null);

  const addEpic = () => {
    if (newEpic) {
      setEpics([...epics, { title: newEpic, sprints: [] }]);
      setNewEpic('');
    }
  };

  const addSprint = () => {
    if (newSprint && selectedEpicIndex !== null) {
      const updatedEpics = [...epics];
      updatedEpics[selectedEpicIndex].sprints.push(newSprint);
      setEpics(updatedEpics);
      setNewSprint('');
    }
  };

  const today = new Date();
  const startDate = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()); // 2년 전
  const endDate = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate()); // 2년 후

  // 날짜 생성 함수
  const generateDates = (startDate: Date, endDate: Date) => {
    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate)); // 날짜 추가
      currentDate.setDate(currentDate.getDate() + 1); // 다음 날로 이동
    }

    return dates;
  };

  // 날짜 목록 생성
  const allDates = generateDates(startDate, endDate);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 왼쪽 사이드바 */}
      <div style={{ width: '250px', padding: '20px', backgroundColor: '#f2f2f2', overflowY: 'auto' }}>
        <h4>에픽 목록</h4>

      </div>

      {/* 오른쪽 타임라인 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div className="timeline">
          <div className="timeline-header">
          {allDates.map((date, index) => (
              <div className="timeline-date" key={index}>{date.getDate()}</div>
            ))}
          </div>
          {epics.map((epic, epicIndex) => (
            <div className="timeline-row" key={epicIndex}>
              <div className="timeline-epic">{epic.title}</div>
              {epic.sprints.map((sprint, sprintIndex) => (
                <div className="timeline-sprint" key={sprintIndex}>
                  {sprint}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
