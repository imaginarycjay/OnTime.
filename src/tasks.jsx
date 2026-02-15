import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TimerIcon from "@mui/icons-material/Timer";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QuizIcon from "@mui/icons-material/Quiz";
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
  const [showOptions, setShowOptions] = useState(false);
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);
  const [pendingTask, setPendingTask] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizTask, setQuizTask] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState({});

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
                  const isRunning =
                    selectedTask && selectedTask.name === task.name && timeRunning;

                  return (
                    <MotionLi
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 1, x: 300 }}
                      transition={{ duration: 0.2 }}
                      className="task-items"
                      key={index}
                    >
                      {task.mode === "study" ? (
                        <MenuBookIcon sx={{ fontSize: 16, marginRight: 0.5, verticalAlign: 'text-bottom' }} />
                      ) : (
                        <TimerIcon sx={{ fontSize: 16, marginRight: 0.5, verticalAlign: 'text-bottom' }} />
                      )} {task.name} ({task.pomoDone}/{task.pomoTotal})
                      <div className="task-actions">
                        {task.mode === "study" && task.quizzes && task.quizzes.length > 0 && (
                          <button
                            className="quiz-task-btn"
                            onClick={() => handleQuizClick(task)}
                            title={
                              task.id && quizAttempts[task.id] >= 3
                                ? "No more attempts"
                                : task.id && quizAttempts[task.id] > 0
                                ? `Take Quiz (${3 - quizAttempts[task.id]} attempts left)`
                                : "Take Quiz (3 attempts)"
                            }
                            disabled={task.id && quizAttempts[task.id] >= 3}
                          >
                            <QuizIcon sx={{ fontSize: 18 }} />
                            {task.id && quizAttempts[task.id] > 0 && (
                              <span className="quiz-badge">{quizAttempts[task.id]}/3</span>
                            )}
                          </button>
                        )}
                        <button
                          className="select-task-btn"
                          onClick={() => handleTaskSelect(task)}
                          aria-label={isRunning ? "Selected (running)" : "Select task"}
                          title={isRunning ? "Selected (running)" : "Select task"}
                        >
                          {isRunning ? (
                            <PauseIcon sx={{ fontSize: 20 }} />
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
                    </MotionLi>
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
