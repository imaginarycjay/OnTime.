import { motion } from "framer-motion";

function ConfirmModal({ message, onConfirm, onCancel }) {
   return (
      <div className="modal-overlay">
         <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="confirmation-modal-container"
         >
            <div className="confirmation-modal-content">
               <p className="confirmation-message">{message}</p>
               <div className="confirmation-buttons">
                  <button onClick={onCancel} className="confirm-cancel-button">
                     Cancel
                  </button>
                  <button onClick={onConfirm} className="confirm-proceed-button">
                     Proceed
                  </button>
               </div>
            </div>
         </motion.div>
      </div>
   );
}

export default ConfirmModal;
