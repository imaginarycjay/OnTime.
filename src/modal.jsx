import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Modal({ grabData, openModal, initialValue = "", isEditing = false }) {
  const [inputValue, setInputValue] = useState(initialValue);

  // Update input value when initialValue changes
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    grabData({ result: inputValue, isEditing });
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
