import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TaskManager from "./tasks.jsx";
import Modal from "./modal.jsx";
import clockRing from "./assets/alarm.mp3";

function MainContent() {
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [timeRunning, setTimeRunning] = useState(false);
  const [activeBtn, setActiveBtn] = useState("pomodoro");
  const [focusType, setFocusType] = useState("Time to Focus!");
  const [modalOpen, setModalOpen] = useState(false);
  const [list, setList] = useState(() => {
    const stored = localStorage.getItem("myTODOs");
    return stored ? JSON.parse(stored) : [];
  });

  // Create audio element
  const alarmSound = new Audio(clockRing);

  // handle time logic
  useEffect(() => {
    let realTime;

    //time running logic
    if (currentTime && timeRunning > 0) {
      realTime = setInterval(() => {
        setCurrentTime((prev) => prev - 1);
      }, 1000);
    }

    //stops when the time is 0 with extra error handling
    if (currentTime === 0) {
      setTimeRunning(false);

      // Play sound first
      alarmSound.play()
      // Then show alert
      setTimeout(() => {
        alert("Your time is up!");
      }, 2000);
    }

    return () => {
      clearInterval(realTime);
    };
  }, [currentTime, timeRunning]);

  //format time
  function formattedTime(time) {
    const mins = Math.floor(time / 60);
    const sec = time % 60;

    return `${String(mins).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  //function to start time
  function startTime() {
    setTimeRunning((prev) => !prev);
  }

  //function if the pomo, break, longbreak is clicked.
  const handleClick = (type, time, timeRunning, focus, bg, bg2) => {
    setActiveBtn(type);
    setCurrentTime(time);
    setTimeRunning(timeRunning);
    setFocusType(focus);

    //for styles
    document.documentElement.style.setProperty("--primary-bg-color", bg);
    document.documentElement.style.setProperty("--secondary-bg-color", bg2);
  };

  // function for close open modal
  function toggleModal() {
    setModalOpen((prev) => !prev);
  }

  // get form data from modal
  function getDataModal(e) {
    const data = e.get("result");
    setList((prev) => [...prev, data]);
  }

  return (
    <main className="root-parent">
      <motion.div
        initial={{ opacity: 0, x: -500 }}
        animate={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}
        className="main-pomodoro"
      >
        <section className="buttons-section">
          <button
            onClick={() =>
              handleClick(
                "pomodoro",
                25 * 60,
                setTimeRunning(false),
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
                5 * 60,
                setTimeRunning(false),
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
                15 * 60,
                setTimeRunning(false),
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
            <p className="main-time">{formattedTime(currentTime)}</p>
            <div className="button-container">
              <button onClick={startTime} className="start-button">
                {!timeRunning ? "START" : "PAUSE"}
              </button>
              <button onClick={toggleModal} className="add-task-button">
                Add Task +
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* task component */}
      <TaskManager taskList={list.length} list={list} setList={setList} />
      {/* modal component */}
      {modalOpen && <Modal grabData={getDataModal} openModal={toggleModal} />}
    </main>
  );
}

export default MainContent;
