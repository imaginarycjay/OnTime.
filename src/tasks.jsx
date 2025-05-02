export default function Task({taskList, taskData, ...animate}) {
  return (
    <div {...animate} className="task-parent-parent">
      <div className="task-parent">
        <p>Task List:</p>
        <div className="task-card">
          {taskList === 0 && (
            <h2 className="no-task-msg">Add task to see the list...</h2>
          )}
          <ul>{taskData}</ul>
        </div>
      </div>
    </div>
  );
}

{
  /* <motion.div
  initial={animateTest.entrance.enterUp}
  animate={animateTest.entrance.animateUp}
  className="task-parent-parent"
>
  <div className="task-parent">
    <p>Task List:</p>
    <div className="task-card">
      {list.length === 0 && (
        <h2 className="no-task-msg">Add task to see the list...</h2>
      )}
      <ul>{fetchedData}</ul>
    </div>
  </div>
</motion.div>; */
}
