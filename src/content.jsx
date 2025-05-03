import { useState } from "react";
import { motion } from "framer-motion";
import TaskManager from "./tasks.jsx";
import Modal from "./modal.jsx";

function MainContent() {
  const [state, setState] = useState("25:00");
  const [activeBtn, setActiveBtn] = useState("pomodoro");
  const [focusType, setFocusType] = useState("Time to Focus!");
  const [modalOpen, setModalOpen] = useState(false);
  const [list, setList] = useState([]);

  //function if the pomo, break, longbreak is clicked.
  const handleClick = (type, time, focus, bg, bg2) => {
    setState(time);
    setActiveBtn(type);
    setFocusType(focus);
    document.documentElement.style.setProperty("--primary-bg-color", bg);
    document.documentElement.style.setProperty("--secondary-bg-color", bg2);
  };


  // function for close open modall aksjdsjd
  function toggleModal() {
    setModalOpen((prev) => !prev);
  }

  // get form data from modal
  function getDataModal(e) {
    const data = e.get("result");
    setList((prev) => [...prev, data]);
  }

  //animation when add task is clicked (try lang)
  const animateTest = {
    entrance: {
      enterLeft: { opacity: 0, x: -500 },
      animateLeft: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    },
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0 },
    transition: { duration: 0.2 },
  };

  return (
    <main className="root-parent">
      <motion.div
        initial={animateTest.entrance.enterLeft}
        animate={animateTest.entrance.animateLeft}
        className="main-pomodoro"
      >
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
