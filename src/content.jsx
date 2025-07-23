import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TaskManager from "./tasks.jsx";
import Modal from "./modal.jsx";

function MainContent() {
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [timeRunning, setTimeRunning] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [activeBtn, setActiveBtn] = useState("pomodoro");
  const [focusType, setFocusType] = useState("Time to Focus!");
  const [selectedTask, setSelectedTask] = useState(null);
  const [list, setList] = useState(() => {
    const stored = localStorage.getItem("myTODOs");
    return stored ? JSON.parse(stored) : [];
  });
  const [showSelectTaskModal, setShowSelectTaskModal] = useState(false);
  const [showTaskDoneModal, setShowTaskDoneModal] = useState(false);

  const alarmSound = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
  );

  useEffect(() => {
    alarmSound.load();
  }, []);

  // to do: make a ticking ticking sound per second
  // const tickingSound = new Audio("");

  useEffect(() => {
    let realTime;

    if (currentTime > 0 && timeRunning) {
      realTime = setInterval(() => {
        setCurrentTime((prev) => prev - 1);
      }, 1000);
    }

    if (currentTime === 0 && timeRunning) {
      setTimeRunning(false);
      alarmSound.play().catch((error) => {
        console.log("Error playing sound:", error);
      });

      if (selectedTask && activeBtn === 'pomodoro') {
        setList((prevList) => {
          const idx = prevList.findIndex(
            (t) => t.name === selectedTask.name && t.pomoTotal === selectedTask.pomoTotal
          );
          if (idx === -1) return prevList;
          const updatedTask = { ...prevList[idx], pomoDone: prevList[idx].pomoDone + 1 };
          const newList = [...prevList];
          newList[idx] = updatedTask;
          setSelectedTask(updatedTask);
          // Update stats in localStorage
          const stats = JSON.parse(localStorage.getItem('ontime_stats')) || { totalPomo: 0, hours: 0 };
          stats.totalPomo += 1;
          stats.hours += 25 / 60;
          localStorage.setItem('ontime_stats', JSON.stringify(stats));
          // If task is done, show modal and do not auto-break
          if (updatedTask.pomoDone >= updatedTask.pomoTotal) {
            setShowTaskDoneModal(true);
          } else if (updatedTask.pomoDone % 4 === 0) {
            handleClick('long', 10 * 60, false, 'Time for Long Break', '#d97217', '#e3934d');
          } else {
            handleClick('short', 5 * 60, false, 'Time for Break', '#169c3e', '#4cb16a');
          }
          return newList;
        });
      } else if (activeBtn === 'pomodoro') {
        handleClick('short', 5 * 60, false, 'Time for Break', '#169c3e', '#4cb16a');
      }
    }

    return () => {
      clearInterval(realTime);
    };
  }, [currentTime, timeRunning, selectedTask, activeBtn]);

  function formattedTime(time) {
    const mins = Math.floor(time / 60);
    const sec = time % 60;
    return `${String(mins).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  function startTime() {
    if (activeBtn === 'pomodoro' && !selectedTask) {
      setShowSelectTaskModal(true);
      return;
    }
    if (
      activeBtn === 'pomodoro' &&
      selectedTask &&
      selectedTask.pomoDone >= selectedTask.pomoTotal
    ) {
      setShowTaskDoneModal(true);
      return;
    }
    setTimeRunning((prev) => !prev);
  }

  const handleClick = (type, time, timeRunning, focus, bg, bg2) => {
    setActiveBtn(type);
    setCurrentTime(time);
    setTimeRunning(timeRunning);
    setFocusType(focus);

    document.documentElement.style.setProperty("--primary-bg-color", bg);
    document.documentElement.style.setProperty("--secondary-bg-color", bg2);
  };

  function toggleModal() {
    setModalOpen((prev) => !prev);
    if (!modalOpen) {
      setEditingData(null);
    }
  }

  function getDataModal(data) {
    if (data.isEditing && editingData !== null) {
      const newList = [...list];
      newList[editingData.index] = data.result;
      setList(newList);
    } else {
      setList((prev) => [...prev, data.result]);
    }
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
                "#d57d70",
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
                "#4cb16a",
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
                10 * 60,
                setTimeRunning(false),
                "Time for Long Break",
                "#d97217",
                "#e3934d",
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

            {selectedTask && (
              <div className="selected-task-display">
                <span>Focusing: {selectedTask.name} ({selectedTask.pomoDone}/{selectedTask.pomoTotal})</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <TaskManager
        taskList={list.length}
        list={list}
        setList={setList}
        setEditingData={(data) => {
          setEditingData(data);
          setModalOpen(true);
        }}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        timeRunning={timeRunning}
        setTimeRunning={setTimeRunning}
      />

      {modalOpen && (
        <Modal
          grabData={getDataModal}
          openModal={toggleModal}
          initialValue={editingData?.text || ""}
          isEditing={editingData !== null}
        />
      )}
      {showSelectTaskModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div style={{ padding: 24, textAlign: 'center' }}>
              <p style={{ fontSize: '1.2rem' }}>You must select a task first.</p>
              <button className="modal-add-butt" onClick={() => setShowSelectTaskModal(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
      {showTaskDoneModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div style={{ padding: 24, textAlign: 'center' }}>
              <p style={{ fontSize: '1.2rem' }}>Task is done! Pick a new task.</p>
              <button className="modal-add-butt" onClick={() => setShowTaskDoneModal(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default MainContent;
