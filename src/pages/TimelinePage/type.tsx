
// 에픽 타입 정의
export type Epic = {
    epicTitle: string; // 'epicTitle'을 'title' 대신 사용
    epicStartDate: string; // 'epicStartDate'를 'startDate' 대신 사용
    epicEndDate: string; // 'epicEndDate'를 'endDate' 대신 사용
    epicProgressStatus: { // 진행률 정보를 저장하는 객체
      totalIssues: number;
      completedIssues: number;
    };
    issues: Issue[];
};
  
// 에픽 응답 타입 정의
export interface EpicResponse {
    [projectName: string]: Epic[]; // 프로젝트 이름을 키로 가지며, 값은 에픽 배열
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
    epicIndex: number;
    onAddIssue: (epicIndex: number)=> void;
};

export type IssueStatus = 'to do' | 'in progress' | 'done' | 'hold';

export type Issue = {
//    epicTitle?: string;
    issueTitle: string;
    mainMemberName: string;
    progressStatus: IssueStatus;
//    dependencies?: number[]; 
    issueStartDate: string;
    issueEndDate: string;
} 

export type IssueDetailProps = {
    issue: Issue;
    onClose: () => void;
}