import { useEffect } from "react";
import "./App.css";
import { Routes } from "./routes";
import { HEADER_HEIGHT } from "@components/features/Header";
import { GlobalStyle } from "@styles/globalStyle";

function App() {
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--header-height",
      HEADER_HEIGHT
    );
  }, []);
  return (
    <div className="App">
      <GlobalStyle />
      <Routes />
    </div>
  );
}

export default App;
