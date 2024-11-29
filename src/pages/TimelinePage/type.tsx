// 에픽 타입 정의
export type Epic = {
    title: string;
    progress:number; //진행률
    issues: Issue[];
};
  
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
    onAddIssue: (epicIndex: number)=> void;
};

export type IssueStatus = 'to do' | 'in progress' | 'done' | 'hold';

export type Issue = {
    epicTitle?: string;
    title: string;
    assign: string;
    status: IssueStatus;
    dependencies?: number[]; 
} 

export type IssueDetailProps = {
    issue: Issue;
    onClose: () => void;
}