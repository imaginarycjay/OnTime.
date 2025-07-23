import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import deleteSVG from "./assets/delete.svg";
import editSVG from "./assets/edit-icon.svg";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from '@mui/icons-material/Pause';

export default function Task({
  taskList,
  list,
  setList,
  setEditingData,
  selectedTask,
  setSelectedTask,
  timeRunning,
  setTimeRunning,
}) {
  const [showOptions, setShowOptions] = useState(false);
  // func para ma delete task
  function deleteTask(index) {
    const returnedTask = list.filter((_, i) => i !== index);
    setList(returnedTask);
  }
  // func to edit taksk
  function editTask(index) {
    setEditingData({ index, text: list[index] });
  }
  // set to local storage
  useEffect(() => {
    localStorage.setItem("myTODOs", JSON.stringify(list));
  }, [list]);

  const handleOptionsClick = () => {
    setShowOptions((prev) => !prev);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: -400 },
        show: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 100, damping: 10 },
        },
      }}
      initial="hidden"
      animate="show"
      className="task-parent-parent"
    >
      <div className="task-parent">
        <div className="task-banner-container">
          <p className="tasklist">Task List:</p>
          <button className="vert-task-icon" onClick={handleOptionsClick}>
            <MoreVertIcon sx={{ fontSize: 21, color: "white" }} />
          </button>
        </div>
        <div className="task-card">
          <div className="task-card-wrapper">
            {taskList === 0 && (
              <h2 className="no-task-msg">Add task to see the list</h2>
            )}
            <ul style={{ paddingLeft: "0px" }}>
              {" "}
              <AnimatePresence>
                {list.map((task, index) => {
                  return (
                    <motion.li
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 1, x: 300 }}
                      transition={{ duration: 0.2 }}
                      className="task-items"
                      key={index}
                    >
                      {task.name} ({task.pomoDone}/{task.pomoTotal})
                      {showOptions && (
                        <div>
                          {showOptions && (
                            <button
                              className="select-task-btn"
                              onClick={() => {
                                if (selectedTask && selectedTask.name === task.name && timeRunning) {
                                  setTimeRunning(false);
                                } else {
                                  setSelectedTask(task);
                                  setTimeRunning(true);
                                }
                              }}
                            >
                              {(selectedTask && selectedTask.name === task.name && timeRunning) ? (
                                <PauseIcon sx={{ fontSize: 18 }} />
                              ) : (
                                <PlayArrowIcon sx={{ fontSize: 18 }} />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => editTask(index)}
                            className="edit-task"
                          >
                            <img
                              className="task-edit-button"
                              src={editSVG}
                              alt="edit"
                            />
                          </button>
                          <button
                            onClick={() => deleteTask(index)}
                            className="delete-task"
                          >
                            <img
                              className="task-delete-button"
                              src={deleteSVG}
                              alt="delete"
                            />
                          </button>
                        </div>
                      )}
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
