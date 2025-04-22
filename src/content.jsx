import TaskList from './taskList'
import data from './assets/taskData.js'


function MainContent() {
  const fetchedData = data.map((list) => {
    return (
      <TaskList 
      key={list.id}
      {...list}
      />
    )
  })

  return (
    <main className="root-parent">
      <div>
        <section className="buttons-section">
          <button className="pomodoro-button">Pomodoro</button>
          <button className="sbreak-button">Short Break</button>
          <button className="lbreak-button">Long Break</button>
        </section>
        <div>
          <div className="main-card">
            <p className="prompt-title">Time to Focus!</p>
            <p className="main-time">25:00</p>
            <div className="button-container">
              <button className="start-button">START</button>
              <button className="add-task-button">Add Task +</button>
            </div>
          </div>
        </div>
      </div>
      <div className="task-parent-parent">
        <div className="task-parent">
          <p>Task List</p>

          <div className="task-card">
            <ol>
              Task goes here...
              {fetchedData}
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
export default MainContent;
