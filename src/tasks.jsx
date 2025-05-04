import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import deleteSVG from "./assets/delete.svg";

export default function Task({ taskList, list, setList }) {
  // delete function for task
  function deleteTask(index) {
    const returnedTask = list.filter((_, i) => i !== index);
    setList(returnedTask);
  }

  // Save to localStorage when list changes
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
                    <button
                      onClick={() => deleteTask(index)}
                      className="delete-task"
                    >
                      <img className="task-delete-button" src={deleteSVG} />
                    </button>
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
