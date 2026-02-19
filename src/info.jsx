import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function Info({ openInfo }) {
  return (
    <div className="info-overlay">
      <div className="info-container-enhanced">
        <button onClick={openInfo} className="close-info-button">
          <CloseRoundedIcon sx={{ color: "white", fontSize: 35 }} />
        </button>
        
        <div className="info-content-scroll">
          <h1 className="info-main-title">Your Productivity Partner for Focused Work and Learning</h1>
          
          <section className="info-section">
            <h2 className="info-section-title">What is OnTime?</h2>
            <div className="info-divider"></div>
            <p className="info-text">
              OnTime is a productivity application that combines time management with smart task organization. 
              Whether you're working on assignments, coding projects, or studying for exams, this tool helps 
              you maintain focus through structured work intervals. Built on the scientifically-backed Pomodoro 
              Technique, OnTime transforms how you approach both work and study sessions, making productivity 
              sustainable and stress-free.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">Understanding the Pomodoro Technique</h2>
            <div className="info-divider"></div>
            <p className="info-text">
              Developed by Francesco Cirillo in the late 1980s, the Pomodoro Technique breaks work into focused 
              intervals called "pomodoros." Each interval lasts 25 minutes, followed by short rest periods. The 
              method gets its name from the tomato-shaped timer Cirillo used during university. Research shows 
              this approach reduces mental fatigue, improves concentration, and helps your brain retain 
              information more effectively through regular breaks.
            </p>
            <p className="info-text">
              <strong>Why it works:</strong> Our brains can maintain peak focus for limited periods. The 25-minute 
              work intervals align with natural attention spans, while breaks prevent burnout and allow your mind 
              to process information. Studies from cognitive psychology demonstrate that this structured rhythm 
              enhances both productivity and creativity.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">How to Use OnTime</h2>
            <div className="info-divider"></div>
            <ol className="info-list">
              <li className="info-list-item">
                <strong>Create your tasks</strong> — Click "Add Task +" to enter activities you want to accomplish today
              </li>
              <li className="info-list-item">
                <strong>Set your pomodoro count</strong> — Determine how many 25-minute sessions each task needs (1 pomodoro = 25 minutes)
              </li>
              <li className="info-list-item">
                <strong>Pick a task to begin</strong> — Select which task you want to focus on by clicking its play icon
              </li>
              <li className="info-list-item">
                <strong>Start the timer and focus</strong> — Hit START and work without distractions for the full 25 minutes
              </li>
              <li className="info-list-item">
                <strong>Take your break</strong> — When the alarm rings, rest for 5 minutes (or 10 minutes after every 4th pomodoro)
              </li>
              <li className="info-list-item">
                <strong>Repeat the cycle</strong> — Continue working in focused bursts until your task is complete
              </li>
            </ol>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">Introducing Study Mode</h2>
            <div className="info-divider"></div>
            <p className="info-text">
              <strong>Study Mode</strong> is an intelligent learning enhancement designed for students and knowledge 
              workers. Unlike standard pomodoro tasks, Study Mode leverages AI to generate personalized learning 
              materials based on your specific topic.
            </p>
            <p className="info-text">
              <strong>What makes it special:</strong> Research in educational psychology shows that active learning 
              with structured checkpoints improves retention by up to 50% compared to passive reading. Study Mode 
              creates customized subtopics, study notes, and practice questions tailored to your subject matter, 
              transforming generic study time into targeted, effective learning sessions.
            </p>
            
            <h3 className="info-subsection-title">How to Use Study Mode:</h3>
            <ol className="info-list">
              <li className="info-list-item">
                When adding a task, select <strong>"Study Mode"</strong> instead of Standard Pomodoro
              </li>
              <li className="info-list-item">
                Enter your subject (e.g., "Biology", "JavaScript", "World History")
              </li>
              <li className="info-list-item">
                Specify your exact topic (e.g., "Cell Division", "Async/Await", "French Revolution")
              </li>
              <li className="info-list-item">
                Click <strong>"Generate Study Pack"</strong> to create AI-powered learning materials
              </li>
              <li className="info-list-item">
                Review the generated subtopics and study notes, edit if needed
              </li>
              <li className="info-list-item">
                Start your pomodoro and use the materials to guide your focused study session
              </li>
            </ol>
            
            <p className="info-text">
              <strong>The science behind it:</strong> Cognitive load theory suggests that breaking complex topics 
              into smaller chunks (subtopics) and providing targeted hints (study notes) reduces mental overload 
              and accelerates understanding. Study Mode automates this process, giving you a head start on 
              organizing your learning.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">Contributors</h2>
            <div className="info-divider"></div>
            <div className="contributors-list">
              <a href="https://web.facebook.com/mar.yel.563552" target="_blank" className="contributor-link">
                Mariel R. Alagano
              </a>
              <a href="https://web.facebook.com/cmlc.corpuz.75" target="_blank" className="contributor-link">
                Cesar Mark L. Corpuz
              </a>
              <a href="https://web.facebook.com/rie.cahh" target="_blank" className="contributor-link">
                Erica B. Pajete
              </a>
              <a href="https://web.facebook.com/" target="_blank" className="contributor-link">
                Camella B. Medayo
              </a>
            </div>
            <p className="copyright">
              OnTime 2026 &copy; All rights reserved.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
