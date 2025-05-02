export default function Task({taskList, taskData}) {
  return (
    <div className="task-parent-parent">
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