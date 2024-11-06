import { useEffect } from "react";
import "./App.css";
import { Routes } from "./routes";
import { HEADER_HEIGHT } from "@components/features/Header";

function App() {
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--header-height",
      HEADER_HEIGHT
    );
  }, []);
  return (
    <div className="App">
      <Routes />
    </div>
  );
}

export default App;
