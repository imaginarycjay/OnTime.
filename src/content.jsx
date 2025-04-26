import TaskList from "./taskList";
import data from "./assets/taskData.js";
import { useState } from "react";

function MainContent() {
  const [state, setState] = useState("25:00");
  const [activeBtn, setActiveBtn] = useState("pomodoro");
  const [focusType, setFocusType] = useState("Time to Focus!");

  const handleClick = (type, time, focus, bg, bg2) => {
    setState(time);
    setActiveBtn(type);
    setFocusType(focus);
    document.documentElement.style.setProperty("--primary-bg-color", bg);
    document.documentElement.style.setProperty("--secondary-bg-color", bg2);
  };

  const fetchedData = data.map((list) => {
    return <TaskList key={list.id} {...list} />;
  });

  return (
    <main className="root-parent">
      <div className="main-pomodoro">
        <section className="buttons-section">
          <button
            onClick={() =>
              handleClick(
                "pomodoro",
                "25:00",
                "Time to Focus",
                "#be3d2a",
                "#d57d70"
              )
            }
            style={{
              backgroundColor: activeBtn === "pomodoro" ? "#d57d70" : "",
            }}
            className="pomodoro-button"
          >
            Pomodoro
          </button>

          <button
            onClick={() =>
              handleClick(
                "short",
                "5:00",
                "Time for Break",
                "#169c3e",
                "#4cb16a"
              )
            }
            style={{
              backgroundColor: activeBtn === "short" ? "#4cb16a" : "",
            }}
            className="sbreak-button"
          >
            Short Break
          </button>

          <button
            onClick={() => {
              handleClick(
                "long",
                "15:00",
                "Time for Long Break",
                "#d97217",
                "#e3934d"
              );
            }}
            style={{
              backgroundColor: activeBtn === "long" ? "#e3934d" : "",
            }}
            className="lbreak-button"
          >
            Long Break
          </button>
        </section>

        <div>
          <div className="main-card">
            <p className="prompt-title">{focusType}</p>
            <p className="main-time">{state}</p>
            <div className="button-container">
              <button className="start-button">START</button>
              <button className="add-task-button">Add Task +</button>
            </div>
          </div>
        </div>
      </div>

      <div className="task-parent-parent">
        <div className="task-parent">
          <p>Task List:</p>
          <div className="task-card">
            <ol>{fetchedData}</ol>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MainContent;
