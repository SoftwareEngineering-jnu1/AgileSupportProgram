import React, { createContext, useContext, useState, ReactNode } from "react";

// Context 타입 정의
interface ProjectContextType {
  projectId: number | null;
  projectName: string | null;
  setProjectId: React.Dispatch<React.SetStateAction<number | null>>;
  setProjectName: React.Dispatch<React.SetStateAction<string | null>>;
}

// Context 생성
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider Props 타입 정의
interface ProjectProviderProps {
  children: ReactNode;
}

// Provider 컴포넌트
export const ProjectProvider = ({ children }: ProjectProviderProps) => {
  const [projectId, setProjectId] = useState<number | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);

  return (
    <ProjectContext.Provider
      value={{ projectId, projectName, setProjectId, setProjectName }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

// Hook 함수
export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
