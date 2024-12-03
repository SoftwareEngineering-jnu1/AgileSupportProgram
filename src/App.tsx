import { useEffect } from "react";
import "./App.css";
import { Routes } from "./routes";
import { HEADER_HEIGHT } from "@components/features/Header";
import { ProjectProvider } from "@context/ProjectContext";

function App() {
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--header-height",
      HEADER_HEIGHT
    );
  }, []);

  return (
    <div className="App">
      <ProjectProvider>
        <Routes />
      </ProjectProvider>
    </div>
  );
}

export default App;
