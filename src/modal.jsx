import { motion } from "framer-motion";

export default function Modal({ grabData, openModal, ...others }) {
  return (
    <section {...others} className="modal-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="modal-container"
      >
        <form id="modal-form" action={grabData}>
          <input
            className="modal-input"
            type="text"
            name="result"
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
              onClick={() => grabData}
              form="modal-form"
              className="modal-add-butt"
            >
              Add
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
