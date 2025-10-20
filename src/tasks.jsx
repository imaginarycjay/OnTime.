import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmModal from "./confirmModal.jsx";

export default function Task({
  taskList,
  list,
  setList,
  setEditingData,
  selectedTask,
  setSelectedTask,
  timeRunning,
  setTimeRunning,
  resetToPomodoro,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);
  const [pendingTask, setPendingTask] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);

  // func para ma delete task
  function deleteTask(index) {
    const taskToDelete = list[index];
    const isRunningTask =
      selectedTask && selectedTask.name === taskToDelete.name;

    // If deleting the currently running task, reset timer and clear selection
    if (isRunningTask) {
      setTimeRunning(false);
      setSelectedTask(null);
      resetToPomodoro(); // Reset timer to pomodoro state
    }

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

  const handleTaskSelect = (task) => {
    // If clicking on the same task, just pause/unpause
    if (selectedTask && selectedTask.name === task.name) {
      setTimeRunning(!timeRunning);
    } else if (timeRunning && selectedTask) {
      // If timer is running on a different task, show confirmation
      setPendingTask(task);
      setShowSwitchConfirm(true);
    } else {
      // If timer is not running, just switch
      setSelectedTask(task);
      setTimeRunning(true);
    }
  };

  const confirmSwitchTask = () => {
    setShowSwitchConfirm(false);
    setSelectedTask(pendingTask);
    // Reset timer to 25:00 and stop it when switching tasks
    resetToPomodoro();
    setPendingTask(null);
  };

  const cancelSwitchTask = () => {
    setShowSwitchConfirm(false);
    setPendingTask(null);
  };

  const handleDeleteClick = (index) => {
    setPendingDeleteIndex(index);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (pendingDeleteIndex !== null) {
      deleteTask(pendingDeleteIndex);
      setPendingDeleteIndex(null);
    }
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setPendingDeleteIndex(null);
    setShowDeleteConfirm(false);
  };

  const getDeleteMessage = () => {
    if (pendingDeleteIndex === null) return "";

    const taskToDelete = list[pendingDeleteIndex];
    const isRunningTask =
      selectedTask &&
      selectedTask.name === taskToDelete.name &&
      timeRunning;

    if (isRunningTask) {
      return (
        "This task is currently running! Deleting it will reset the timer and you'll need to select another task. Are you sure?"
      );
    }
    return "Are you sure you want to delete this task?";
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
                      - {task.name} ({task.pomoDone}/{task.pomoTotal})
                      <div>
                        <button
                          className="select-task-btn"
                          onClick={() => handleTaskSelect(task)}
                        >
                          {selectedTask &&
                          selectedTask.name === task.name &&
                          timeRunning ? (
                            <PauseIcon
                              sx={{
                                fontSize: 20,
                              }}
                            />
                          ) : (
                            <PlayArrowIcon sx={{ fontSize: 20 }} />
                          )}
                        </button>
                        {showOptions && (
                          <>
                            <button
                              onClick={() => editTask(index)}
                              className="edit-task"
                            >
                              <EditIcon sx={{ fontSize: 18 }} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(index)}
                              className="delete-task"
                            >
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </div>
      {showSwitchConfirm && (
        <ConfirmModal
          message="Switching tasks will lose your current progress. Do you want to continue?"
          onConfirm={confirmSwitchTask}
          onCancel={cancelSwitchTask}
        />
      )}
      {showDeleteConfirm && (
        <ConfirmModal
          message={getDeleteMessage()}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </motion.div>
  );
}
