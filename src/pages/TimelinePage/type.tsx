
// 에픽 타입 정의
export type Epic = {
    epicId: number;
    epicTitle: string; 
    epicStartDate: string; 
    epicEndDate: string; 
    epicProgressStatus: { 
      totalIssues: number;
      completedIssues: number;
    };
    issues: Issue[];
};
  
// 에픽 응답 타입 정의
export interface EpicResponse {
    [projectName: string]: Epic[]; 
  }
  
export type EpicDetailProps={
    epic: Epic;
    onClose: () => void;
    epicId: number;
    onAddIssue: (epicId:number)=> void;
};

export type IssueStatus = 'To Do' | 'In Progress' | 'Done' | 'Hold';

export type TimelineIssue = {
    issueId: number;
    issueTitle: string;
    issueStartDate: string;
    issueEndDate: string;
    hasDependency: boolean;
  };

export type Issue = {
    id: number; // 매핑 후 사용할 필드
    epicId:number;
    title: string;
    mainMemberName: string;
    progressStatus: IssueStatus;
    issueStartDate: string;
    issueEndDate: string;
    hasDependency: boolean;
    timelineX?: number; // 선택적 속성
    timelineY?: number; // 선택적 속성
} 

export type IssueDetailProps = {
    issue: Issue;
    epicId:number;
    id:number;
    onClose: () => void;
}