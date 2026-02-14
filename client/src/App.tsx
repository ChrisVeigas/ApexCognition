import React, { useState } from "react";
import "./App.css";
import AgentInterface from "./components/agent-interface";

const App: React.FC = () => {
  const [view, setView] = useState<"landing" | "app">("landing");

  if (view === "landing") {
    return (
      <div className="landing-screen">
        <div className="landing-content">
          <h1 className="hero-title">
            APEX <span className="text-blue-500">COGNITION</span>
          </h1>
          <button className="btn-primary-glow" onClick={() => setView("app")}>
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return <AgentInterface />;
};

export default App;
