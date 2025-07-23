import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Modal({ grabData, openModal, initialValue = "", isEditing = false }) {
  const [inputValue, setInputValue] = useState(initialValue.name || initialValue || "");
  const [pomoTotal, setPomoTotal] = useState(initialValue.pomoTotal || 1);

  useEffect(() => {
    setInputValue(initialValue.name || initialValue || "");
    setPomoTotal(initialValue.pomoTotal || 1);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      grabData({ result: { ...initialValue, name: inputValue, pomoTotal }, isEditing });
    } else {
      grabData({ result: { name: inputValue, pomoTotal, pomoDone: 0 }, isEditing });
    }
    openModal();
  };

  return (
    <section className="modal-overlay">
      <motion.div
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
      </motion.div>
    </section>
  );
}
