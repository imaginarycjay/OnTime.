import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Modal({ grabData, openModal, initialValue = "", isEditing = false, isOnline = true }) {
  const MotionDiv = motion.div;
  const [inputValue, setInputValue] = useState(initialValue.name || initialValue || "");
  const [pomoTotal, setPomoTotal] = useState(initialValue.pomoTotal || 1);
  const [taskMode, setTaskMode] = useState(initialValue.mode || "standard");
  const [subject, setSubject] = useState(initialValue.subject || "");
  const [specificTopic, setSpecificTopic] = useState(initialValue.specificTopic || "");
  const [subtopics, setSubtopics] = useState(initialValue.subtopics || []);
  const [studyNotes, setStudyNotes] = useState(initialValue.studyNotes || []);
  const [quizzes, setQuizzes] = useState(initialValue.quizzes || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const containsBlockedTopic = (text) => {
    const blockedPattern = /(poop|toilet|feces|shit|sex|porn|nude|gambling|drug|drugs|meth|cocaine|weapon|bomb|kill|murder)/i;
    return blockedPattern.test(text);
  };

  const isLikelyAcademic = (subjectText, topicText) => {
    const combined = `${subjectText || ""} ${topicText || ""}`.trim();
    if (!combined) return false;
    if (containsBlockedTopic(combined)) return false;

    const academicPattern = /(math|algebra|geometry|calculus|statistics|physics|chemistry|biology|history|geography|economics|accounting|programming|computer science|literature|grammar|science|research|exam|lesson|theorem|equation|analysis|engineering|medicine|law|psychology|philosophy)/i;

    return academicPattern.test(combined) || (combined.split(/\s+/).length >= 2 && topicText.trim().length >= 4);
  };

  useEffect(() => {
    setInputValue(initialValue.name || initialValue || "");
    setPomoTotal(initialValue.pomoTotal || 1);
    setTaskMode(initialValue.mode || "standard");
    setSubject(initialValue.subject || "");
    setSpecificTopic(initialValue.specificTopic || "");
    setSubtopics(initialValue.subtopics || []);
    setStudyNotes(initialValue.studyNotes || []);
    setQuizzes(initialValue.quizzes || []);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      grabData({ result: { ...initialValue, name: inputValue, pomoTotal, mode: taskMode, subject: taskMode === "study" ? subject : "", specificTopic: taskMode === "study" ? specificTopic : "", subtopics: taskMode === "study" ? subtopics : [], studyNotes: taskMode === "study" ? studyNotes : [], quizzes: taskMode === "study" ? quizzes : [] }, isEditing });
    } else {
      grabData({ result: { name: inputValue, pomoTotal, pomoDone: 0, mode: taskMode, subject: taskMode === "study" ? subject : "", specificTopic: taskMode === "study" ? specificTopic : "", subtopics: taskMode === "study" ? subtopics : [], studyNotes: taskMode === "study" ? studyNotes : [], quizzes: taskMode === "study" ? quizzes : [] }, isEditing });
    }
    openModal();
  };

  const handleGenerate = async () => {
    if (!specificTopic.trim()) {
      setError("Specific topic is required for study content");
      return;
    }

    if (!isLikelyAcademic(subject, specificTopic)) {
      setError("Study pack generation accepts academic topics only. Please enter a school-related topic.");
      return;
    }

    setError("");
    setIsGenerating(true);
    try {
      const response = await window.studyApi.generateStudyPack({ subject, specificTopic });
      setSubtopics(response.subtopics || []);
      setStudyNotes(response.studyNotes || []);
      setQuizzes(response.quizzes || []);
    } catch (err) {
      setError(err.message || "Failed to generate study pack");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setSubtopics([]);
    setStudyNotes([]);
    setQuizzes([]);
    handleGenerate();
  };

  return (
    <section className="modal-overlay">
      <MotionDiv
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="modal-container"
      >
        <form id="modal-form" onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, color: 'white', fontWeight: 500 }}>Task Mode:</label>
            <div style={{ display: 'flex', gap: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', cursor: 'pointer' }}>
                <input
                  type="radio"
                  value="standard"
                  checked={taskMode === "standard"}
                  onChange={(e) => setTaskMode(e.target.value)}
                  style={{ cursor: 'pointer' }}
                />
                Standard Pomodoro
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', cursor: 'pointer' }}>
                <input
                  type="radio"
                  value="study"
                  checked={taskMode === "study"}
                  onChange={(e) => setTaskMode(e.target.value)}
                  style={{ cursor: 'pointer' }}
                />
                Study Mode
              </label>
            </div>
          </div>
          <input
            className="modal-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
            placeholder="Add task here..."
          />
          {taskMode === "study" && (
            <>
              <input
                className="modal-input"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject (e.g. Science)"
              />
              <input
                className="modal-input"
                type="text"
                value={specificTopic}
                onChange={(e) => setSpecificTopic(e.target.value)}
                placeholder="Specific topic (required for study pack)"
                required
              />
              <button 
                type="button" 
                className="modal-add-butt" 
                onClick={handleGenerate} 
                disabled={isGenerating}
                style={{ opacity: isGenerating ? 0.6 : 1 }}
              >
                {isGenerating ? "Generating..." : "Generate Study Pack"}
              </button>
              {error && <p className="modal-error" style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</p>}
              
              {!!quizzes.length && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.75rem', 
                  background: 'rgba(167, 139, 250, 0.15)', 
                  borderRadius: '8px',
                  border: '1px solid rgba(167, 139, 250, 0.3)'
                }}>
                  <span style={{ color: '#a78bfa', fontWeight: 500, fontSize: '0.9rem' }}>
                    ✓ {quizzes.length} Quiz Questions Ready
                  </span>
                </div>
              )}
              
              {(!!subtopics.length || !!studyNotes.length || !!quizzes.length) && (
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  style={{ 
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    opacity: isGenerating ? 0.5 : 1
                  }}
                >
                  🔄 Regenerate Study Pack
                </button>
              )}
            </>
          )}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
            <button className="pomoAdder" type="button" onClick={() => setPomoTotal(Math.max(1, pomoTotal - 1))}>-</button>
            <span style={{ margin: '0 8px' }}>{pomoTotal} Pomodoros</span>
            <button className="pomoAdder" type="button" onClick={() => setPomoTotal(pomoTotal + 1)}>+</button>
          </div>
        </form>
        <div className="modal-buttons-container">
          <div className="modal-buttons">
            <button onClick={openModal} className="modal-cancel-butt">
              Close
            </button>
            <button
              type="submit"
              form="modal-form"
              className="modal-add-butt"
            >
              {isEditing ? "Save" : "Add"}
            </button>
          </div>
        </div>
      </MotionDiv>
    </section>
  );
}
