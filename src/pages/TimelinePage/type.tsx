
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

  // Item 타입 정의
export type Item = {
    id: string;
    content: string;
    start: Date;
    end: Date;
    group: number;
    assign: string;
};
  
export type EpicDetailProps={
    epic: Epic;
    onClose: () => void;
    epicId: number;
    onAddIssue: (epicId:number)=> void;
};

export type IssueStatus = 'to do' | 'in progress' | 'done' | 'hold';

export type Issue = {
    issueId:number;
    epicId:number;
    issueTitle: string;
    mainMemberName: string;
    progressStatus: IssueStatus;
    issueStartDate: string;
    issueEndDate: string;
} 

export type IssueDetailProps = {
    issue: Issue;
    epicId:number;
    issueId:number;
    onClose: () => void;
}