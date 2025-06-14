import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import deleteSVG from "./assets/delete.svg";
import editSVG from "./assets/edit-icon.svg";

export default function Task({ taskList, list, setList, setEditingData }) {
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
        <p>Task List:</p>
        <div className="task-card">
          {taskList === 0 && (
            <h2 className="no-task-msg">Add task to see the list...</h2>
          )}
          <ul>
            <AnimatePresence>
              {list.map((items, index) => {
                return (
                  <motion.li
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 1, x: 300 }}
                    transition={{ duration: 0.2 }}
                    className="task-items"
                    key={index}
                  >
                    • {items}
                    <div>
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
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
