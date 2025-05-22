import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TaskManager from "./tasks.jsx";
import Modal from "./modal.jsx";

function MainContent() {
  // Timer states
  const [currentTime, setCurrentTime] = useState(25 * 60); // 25 minutes in seconds
  const [timeRunning, setTimeRunning] = useState(false); // Controls if timer is running
  const [activeBtn, setActiveBtn] = useState("pomodoro"); // Tracks which timer mode is active
  const [focusType, setFocusType] = useState("Time to Focus!"); // Display text for current mode
  // Modal and task states
  const [modalOpen, setModalOpen] = useState(false); // Controls modal visibility
  const [editingData, setEditingData] = useState(null); // Stores data of task being edited
  const [list, setList] = useState(() => {
    // Initialize tasks from localStorage or empty array if none exist
    const stored = localStorage.getItem("myTODOs");
    return stored ? JSON.parse(stored) : [];
  });

  // Initialize alarm sound
  const alarmSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");

  // Timer effect - handles countdown and completion
  useEffect(() => {
    let realTime; // Stores interval ID

    // Start countdown if timer is running and time remains
    if (currentTime && timeRunning > 0) {
      realTime = setInterval(() => {
        setCurrentTime((prev) => prev - 1);
      }, 1000);
    }

    // Handle timer completion
    if (currentTime === 0) {
      setTimeRunning(false);
      // Play sound first
      alarmSound.play().catch(error => {
        console.log("Error playing sound:", error);
      });
      // Show alert after sound starts
      setTimeout(() => {
        alert("Your time is up!");
      }, 100);
    }

    // Cleanup interval on unmount or when dependencies change
    return () => {
      clearInterval(realTime);
    };
  }, [currentTime, timeRunning]);

  // Format seconds into MM:SS display
  function formattedTime(time) {
    const mins = Math.floor(time / 60);
    const sec = time % 60;
    return `${String(mins).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  // Toggle timer start/pause
  function startTime() {
    setTimeRunning((prev) => !prev);
  }

  // Handle timer mode changes (Pomodoro, Short Break, Long Break)
  const handleClick = (type, time, timeRunning, focus, bg, bg2) => {
    setActiveBtn(type);
    setCurrentTime(time);
    setTimeRunning(timeRunning);
    setFocusType(focus);

    // Update CSS variables for theme colors
    document.documentElement.style.setProperty("--primary-bg-color", bg);
    document.documentElement.style.setProperty("--secondary-bg-color", bg2);
  };

  // Toggle modal visibility and reset editing state
  function toggleModal() {
    setModalOpen((prev) => !prev);
    if (!modalOpen) {
      setEditingData(null); // Reset editing state when opening modal
    }
  }

  // Handle task data from modal (both adding and editing)
  function getDataModal(data) {
    if (data.isEditing && editingData !== null) {
      // Update existing task
      const newList = [...list];
      newList[editingData.index] = data.result;
      setList(newList);
    } else {
      // Add new task
      setList((prev) => [...prev, data.result]);
    }
  }

  return (
    <main className="root-parent">
      {/* Main timer section with animation */}
      <motion.div
        initial={{ opacity: 0, x: -500 }}
        animate={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}
        className="main-pomodoro"
      >
        {/* Timer mode selection buttons */}
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

        {/* Timer display and controls */}
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

      {/* Task list component */}
      <TaskManager 
        taskList={list.length} 
        list={list} 
        setList={setList} 
        setEditingData={(data) => {
          setEditingData(data);
          setModalOpen(true);
        }}
      />

      {/* Modal for adding/editing tasks */}
      {modalOpen && (
        <Modal 
          grabData={getDataModal} 
          openModal={toggleModal}
          initialValue={editingData?.text || ""}
          isEditing={editingData !== null}
        />
      )}
    </main>
  );
}

export default MainContent;
