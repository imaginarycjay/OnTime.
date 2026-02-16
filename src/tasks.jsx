import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TimerIcon from "@mui/icons-material/Timer";
import ConfirmModal from "./confirmModal.jsx";
import Quiz from "./quiz.jsx";

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
  database,
}) {
  const MotionLi = motion.li;
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [activeTaskMenuIndex, setActiveTaskMenuIndex] = useState(null);
  const [showTaskActionModal, setShowTaskActionModal] = useState(false);
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);
  const [pendingTask, setPendingTask] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);
  const [showMarkAllConfirm, setShowMarkAllConfirm] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizTask, setQuizTask] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState({});

  const isSameTask = (taskA, taskB) => {
    if (!taskA || !taskB) return false;
    if (taskA.id && taskB.id) return taskA.id === taskB.id;

    return (
      taskA.name === taskB.name &&
      taskA.pomoTotal === taskB.pomoTotal &&
      taskA.pomoDone === taskB.pomoDone
    );
  };

  const isTaskDone = (task) => task.pomoDone >= task.pomoTotal;

  // func para ma delete task
  function deleteTask(index) {
    const taskToDelete = list[index];
    const isRunningTask = selectedTask && isSameTask(selectedTask, taskToDelete);

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
    setShowHeaderMenu((prev) => !prev);
    setShowTaskActionModal(false);
    setActiveTaskMenuIndex(null);
  };

  const markTaskAsDone = (index) => {
    const taskToMark = list[index];
    if (!taskToMark || isTaskDone(taskToMark)) return;

    const shouldStopRunning = selectedTask && isSameTask(selectedTask, taskToMark) && timeRunning;

    setList((prevList) => {
      const updated = [...prevList];
      updated[index] = {
        ...updated[index],
        pomoDone: updated[index].pomoTotal,
      };

      if (selectedTask && isSameTask(selectedTask, taskToMark)) {
        setSelectedTask(updated[index]);
      }

      return updated;
    });

    if (shouldStopRunning) {
      setTimeRunning(false);
      resetToPomodoro();
    }
  };

  const runMarkAllAsDone = () => {
    if (list.length === 0) return;

    setList((prevList) =>
      prevList.map((task) => ({
        ...task,
        pomoDone: task.pomoTotal,
      })),
    );

    if (selectedTask) {
      setSelectedTask({
        ...selectedTask,
        pomoDone: selectedTask.pomoTotal,
      });
    }

    if (timeRunning) {
      setTimeRunning(false);
      resetToPomodoro();
    }

    setShowHeaderMenu(false);
    setShowTaskActionModal(false);
    setActiveTaskMenuIndex(null);
  };

  const markAllAsDone = () => {
    if (timeRunning && selectedTask) {
      setShowHeaderMenu(false);
      setShowMarkAllConfirm(true);
      return;
    }

    runMarkAllAsDone();
  };

  const clearDoneTasks = () => {
    const hasDoneTask = list.some((task) => isTaskDone(task));
    if (!hasDoneTask) return;

    const shouldClearSelection = selectedTask && isTaskDone(selectedTask);
    setList((prevList) => prevList.filter((task) => !isTaskDone(task)));

    if (shouldClearSelection) {
      setSelectedTask(null);
      if (timeRunning) {
        setTimeRunning(false);
        resetToPomodoro();
      }
    }

    setShowHeaderMenu(false);
    setShowTaskActionModal(false);
    setActiveTaskMenuIndex(null);
  };

  const handleTaskItemClick = (index) => {
    setShowHeaderMenu(false);
    setActiveTaskMenuIndex(index);
    setShowTaskActionModal(true);
  };

  const handleTaskSelect = (task) => {
    // New behavior: clicking a task only selects it and updates the "Focusing" display.
    // It will NOT start or pause the timer. The main START button controls running state.

    // If timer is running and there's an active selected task (different from clicked), ask for confirmation
    if (timeRunning && selectedTask && selectedTask.name !== task.name) {
      setPendingTask(task);
      setShowSwitchConfirm(true);
      return;
    }

    // Otherwise just select the task (no auto-start)
    setSelectedTask(task);
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
    setShowTaskActionModal(false);
    setActiveTaskMenuIndex(null);
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

  const handleQuizClick = (task) => {
    setQuizTask(task);
    setShowQuiz(true);
    setShowTaskActionModal(false);
    setActiveTaskMenuIndex(null);
  };

  const handleQuizClose = () => {
    setShowQuiz(false);
    setQuizTask(null);
    // Refresh quiz attempts
    loadQuizAttempts();
  };

  const handleQuizComplete = (result) => {
    console.log('Quiz completed:', result);
    // Refresh attempts count
    loadQuizAttempts();
  };

  const loadQuizAttempts = () => {
    if (!database) return;
    
    const attempts = {};
    list.forEach(task => {
      if (task.id && task.mode === 'study') {
        attempts[task.id] = database.getQuizAttempts(task.id);
      }
    });
    setQuizAttempts(attempts);
  };

  useEffect(() => {
    loadQuizAttempts();
  }, [database, list]);

  useEffect(() => {
    const handleGlobalClick = (event) => {
      if (
        showHeaderMenu &&
        !event.target.closest(".task-header-menu")
      ) {
        setShowHeaderMenu(false);
      }

      if (
        showTaskActionModal &&
        !event.target.closest(".task-items") &&
        !event.target.closest(".task-action-modal-content")
      ) {
        setShowTaskActionModal(false);
        setActiveTaskMenuIndex(null);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setShowHeaderMenu(false);
        setShowTaskActionModal(false);
        setActiveTaskMenuIndex(null);
      }
    };

    document.addEventListener("click", handleGlobalClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("click", handleGlobalClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showHeaderMenu, showTaskActionModal]);

  const getDeleteMessage = () => {
    if (pendingDeleteIndex === null) return "";

    const taskToDelete = list[pendingDeleteIndex];
    const isRunningTask =
      selectedTask &&
      isSameTask(selectedTask, taskToDelete) &&
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
          <div className="task-header-menu">
            <button
              className="vert-task-icon"
              onClick={handleOptionsClick}
              aria-label="Task list actions"
              aria-expanded={showHeaderMenu}
            >
              <MoreVertIcon sx={{ fontSize: 21, color: "white" }} />
            </button>

            {showHeaderMenu && (
              <div className="task-overflow-menu" role="menu">
                <button
                  className="task-overflow-menu-item"
                  onClick={markAllAsDone}
                  disabled={list.length === 0 || list.every((task) => isTaskDone(task))}
                >
                  Mark all as Done
                </button>
                <button
                  className="task-overflow-menu-item"
                  onClick={clearDoneTasks}
                  disabled={!list.some((task) => isTaskDone(task))}
                >
                  Clear all task
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="task-card">
          <div className="task-card-wrapper">
            {taskList === 0 && (
              <h2 className="no-task-msg">Add task to see the list</h2>
            )}
            <ul className="task-list">
              <AnimatePresence>
                {list.map((task, index) => {
                  const isSelected = selectedTask && isSameTask(selectedTask, task);
                  const done = isTaskDone(task);
                  const canQuiz =
                    task.mode === "study" &&
                    task.quizzes &&
                    task.quizzes.length > 0 &&
                    !(task.id && quizAttempts[task.id] >= 3);

                  return (
                    <MotionLi
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 1, x: 300 }}
                      transition={{ duration: 0.2 }}
                      className={`task-items ${isSelected ? "task-selected" : ""} ${done ? "task-done" : ""}`}
                      key={index}
                      onClick={() => handleTaskItemClick(index)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleTaskItemClick(index);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-expanded={showTaskActionModal && activeTaskMenuIndex === index}
                    >
                      <div className="task-item-main">
                        {task.mode === "study" ? (
                          <MenuBookIcon sx={{ fontSize: 16, marginRight: 0.5, verticalAlign: "text-bottom" }} />
                        ) : (
                          <TimerIcon sx={{ fontSize: 16, marginRight: 0.5, verticalAlign: "text-bottom" }} />
                        )}
                        <span className="task-item-title">{task.name}</span>
                      </div>
                    </MotionLi>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </div>

      {showTaskActionModal && activeTaskMenuIndex !== null && list[activeTaskMenuIndex] && (
        <div className="task-action-modal-overlay" onClick={() => {
          setShowTaskActionModal(false);
          setActiveTaskMenuIndex(null);
        }}>
          <div className="task-action-modal-content" role="menu" onClick={(event) => event.stopPropagation()}>
            <button
              className="task-item-menu-button"
              onClick={() => {
                handleTaskSelect(list[activeTaskMenuIndex]);
                setShowTaskActionModal(false);
                setActiveTaskMenuIndex(null);
              }}
            >
              Focus this task
            </button>
            <button
              className="task-item-menu-button"
              onClick={() => handleQuizClick(list[activeTaskMenuIndex])}
              disabled={
                list[activeTaskMenuIndex].mode !== "study" ||
                !list[activeTaskMenuIndex].quizzes ||
                list[activeTaskMenuIndex].quizzes.length === 0 ||
                (list[activeTaskMenuIndex].id && quizAttempts[list[activeTaskMenuIndex].id] >= 3)
              }
            >
              Quiz now
            </button>
            <button
              className="task-item-menu-button"
              onClick={() => {
                editTask(activeTaskMenuIndex);
                setShowTaskActionModal(false);
                setActiveTaskMenuIndex(null);
              }}
            >
              Edit
            </button>
            <button
              className="task-item-menu-button"
              onClick={() => {
                markTaskAsDone(activeTaskMenuIndex);
                setShowTaskActionModal(false);
                setActiveTaskMenuIndex(null);
              }}
              disabled={isTaskDone(list[activeTaskMenuIndex])}
            >
              Mark as Done
            </button>
            <button
              className="task-item-menu-button task-item-menu-danger"
              onClick={() => handleDeleteClick(activeTaskMenuIndex)}
            >
              Clear
            </button>
          </div>
        </div>
      )}

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
      {showMarkAllConfirm && (
        <ConfirmModal
          message="A task is currently running. Marking all as done will stop the timer and reset Pomodoro. Continue?"
          onConfirm={() => {
            setShowMarkAllConfirm(false);
            runMarkAllAsDone();
          }}
          onCancel={() => setShowMarkAllConfirm(false)}
          confirmLabel="Mark all"
        />
      )}
      {showQuiz && quizTask && (
        <Quiz
          task={quizTask}
          onClose={handleQuizClose}
          onComplete={handleQuizComplete}
          database={database}
        />
      )}
    </motion.div>
  );
}
