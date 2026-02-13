import { motion } from "framer-motion";

function ConfirmModal({ message, onConfirm, onCancel, confirmLabel = "Proceed", cancelLabel = "Cancel", icon }) {
   const MotionDiv = motion.div;
   return (
      <div className="modal-overlay">
         <MotionDiv
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="confirmation-modal-container"
         >
            <div className="confirmation-modal-content">
               <p className="confirmation-message">
                  {icon && <span className="confirmation-icon">{icon}</span>}
                  {message}
               </p>
               <div className="confirmation-buttons">
                  <button onClick={onCancel} className="confirm-cancel-button">
                     {cancelLabel}
                  </button>
                  <button onClick={onConfirm} className="confirm-proceed-button">
                     {confirmLabel}
                  </button>
               </div>
            </div>
         </MotionDiv>
      </div>
   );
}

export default ConfirmModal;
