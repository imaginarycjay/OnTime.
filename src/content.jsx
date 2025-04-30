import { useState } from "react";

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

  //map through list
  const fetchedData = list.map((items, index) => {
    return (
      <li className="task-items" key={index}>
        {items}
        <button onClick={() => deleteTask(index)} className="delete-task">
          🗑
        </button>
      </li>
    );
  });

  // delete function for task
  function deleteTask(index) {
    const returnedTask = list.filter((_, i) => i !== index);
    setList(returnedTask);
  }

  // function for close open modall aksjdsjd
  function toggleModal() {
    setModalOpen((prev) => !prev);
  }

  // get form data from modal
  function getDataModal(e) {
    const data = e.get("result");
    setList((prev) => [...prev, data]);
  }

  // add item to list when add button in modal is clicked
  function addItem() {}

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
              <button onClick={toggleModal} className="add-task-button">
                Add Task +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="task-parent-parent">
        <div className="task-parent">
          <p>Task List:</p>
          <div className="task-card">
            {list.length === 0 && (
              <h2 className="no-task-msg">Add task to see the list...</h2>
            )}
            <ul>{fetchedData}</ul>
          </div>
        </div>
      </div>

      {modalOpen && (
        <section className="modal-overlay">
          <div className="modal-container">
            <form id="modal-form" action={getDataModal}>
              <input
                className="modal-input"
                type="text"
                name="result"
                required
                placeholder="Add task here..."
              />
            </form>
            <div className="modal-buttons-container">
              <div className="modal-buttons">
                <button onClick={toggleModal} className="modal-cancel-butt">
                  Close
                </button>
                <button onClick={() => getDataModal} form="modal-form" className="modal-add-butt">
                  Add
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default MainContent;
