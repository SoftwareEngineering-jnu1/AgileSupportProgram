// 에픽 타입 정의
export type Epic = {
    title: string;
    progress:number; //진행률
    issues: string[];
};
  
  // Item 타입 정의
export type Item = {
    id: string;
    content: string;
    start: Date;
    end: Date;
    group: number;
};
  
export type EpicDetailProps={
    epic: Epic;
    onClose: () => void;
    onAddIssue: (epicIndex: number)=> void;
};