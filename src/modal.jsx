import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Modal({ grabData, openModal, initialValue = "", isEditing = false }) {
  const MotionDiv = motion.div;
  const [inputValue, setInputValue] = useState(initialValue.name || initialValue || "");
  const [pomoTotal, setPomoTotal] = useState(initialValue.pomoTotal || 1);
  const [subject, setSubject] = useState(initialValue.subject || "");
  const [specificTopic, setSpecificTopic] = useState(initialValue.specificTopic || "");
  const [subtopics, setSubtopics] = useState(initialValue.subtopics || []);
  const [studyNotes, setStudyNotes] = useState(initialValue.studyNotes || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setInputValue(initialValue.name || initialValue || "");
    setPomoTotal(initialValue.pomoTotal || 1);
    setSubject(initialValue.subject || "");
    setSpecificTopic(initialValue.specificTopic || "");
    setSubtopics(initialValue.subtopics || []);
    setStudyNotes(initialValue.studyNotes || []);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      grabData({ result: { ...initialValue, name: inputValue, pomoTotal, subject, specificTopic, subtopics, studyNotes }, isEditing });
    } else {
      grabData({ result: { name: inputValue, pomoTotal, pomoDone: 0, subject, specificTopic, subtopics, studyNotes }, isEditing });
    }
    openModal();
  };

  const handleGenerate = async () => {
    if (!specificTopic.trim()) {
      setError("Specific topic is required for study content");
      return;
    }
    setError("");
    setIsGenerating(true);
    try {
      const response = await window.studyApi.generateStudyPack({ subject, specificTopic });
      setSubtopics(response.subtopics || []);
      setStudyNotes(response.studyNotes || []);
    } catch (err) {
      setError(err.message || "Failed to generate study pack");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="modal-overlay">
      <MotionDiv
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="modal-container"
      >
        <form id="modal-form" onSubmit={handleSubmit}>
          <input
            className="modal-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
            placeholder="Add task here..."
          />
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
          <button type="button" className="modal-add-butt" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Study Pack"}
          </button>
          {error && <p className="modal-error">{error}</p>}
          {!!subtopics.length && (
            <textarea
              className="modal-textarea"
              value={subtopics.join("\n")}
              onChange={(e) => setSubtopics(e.target.value.split("\n"))}
            />
          )}
          {!!studyNotes.length && (
            <textarea
              className="modal-textarea"
              value={studyNotes.join("\n")}
              onChange={(e) => setStudyNotes(e.target.value.split("\n"))}
            />
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
