import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./quiz.css";

export default function Quiz({ task, onClose, onComplete, database }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const MAX_ATTEMPTS = 3;
  const quizzes = task.quizzes || [];
  const currentQuestion = quizzes[currentQuestionIndex];

  useEffect(() => {
    // Check attempts from database
    if (database && task.id) {
      const attemptCount = database.getQuizAttempts(task.id);
      setAttempts(attemptCount);
    }
  }, [database, task.id]);

  const handleOptionSelect = (optionIndex) => {
    if (selectedOption !== null) return; // Already answered this question
    
    const optionLetter = String.fromCharCode(65 + optionIndex); // Convert 0->A, 1->B, etc.
    const isCorrect = optionLetter === currentQuestion.answer;
    
    setSelectedOption(optionIndex);
    
    if (!isCorrect) {
      setShowHint(true);
    }

    const answerData = {
      question: currentQuestion.question,
      selectedOption: optionLetter,
      correctOption: currentQuestion.answer,
      isCorrect
    };

    setUserAnswers([...userAnswers, answerData]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowHint(false);
    } else {
      // Quiz complete
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const finalAnswers = [...userAnswers];
    const correctCount = finalAnswers.filter(a => a.isCorrect).length;
    const totalQuestions = quizzes.length;
    const scorePercentage = (correctCount / totalQuestions) * 100;

    setScore(scorePercentage);
    setShowResults(true);

    // Save to database
    if (database && task.id) {
      database.saveQuizResult({
        taskId: task.id,
        subject: task.subject || 'General',
        topic: task.specific_topic || task.specificTopic || task.name,
        totalQuestions,
        correctAnswers: correctCount,
        score: scorePercentage,
        attemptNumber: attempts + 1,
        answersData: finalAnswers
      });
    }

    // Notify parent component
    if (onComplete) {
      onComplete({
        score: scorePercentage,
        correctCount,
        totalQuestions,
        attempt: attempts + 1
      });
    }
  };

  const canRetake = attempts < MAX_ATTEMPTS;

  const handleRetake = () => {
    if (!canRetake) return;
    
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowHint(false);
    setUserAnswers([]);
    setShowResults(false);
    setScore(0);
    setAttempts(attempts + 1);
  };

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="quiz-overlay" onClick={onClose}>
        <motion.div
          className="quiz-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="quiz-header">
            <h2>No Quiz Available</h2>
            <button className="quiz-close" onClick={onClose}>✕</button>
          </div>
          <div className="quiz-body">
            <p>This task doesn't have any quiz questions.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showResults) {
    const passedQuiz = score >= 70;
    
    return (
      <div className="quiz-overlay" onClick={onClose}>
        <motion.div
          className="quiz-modal quiz-results"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="quiz-header">
            <h2>Quiz Complete!</h2>
            <button className="quiz-close" onClick={onClose}>✕</button>
          </div>
          
          <div className="quiz-body">
            <div className={`score-display ${passedQuiz ? 'passed' : 'failed'}`}>
              <div className="score-circle">
                <span className="score-number">{Math.round(score)}%</span>
              </div>
              <p className="score-message">
                {passedQuiz ? '🎉 Great job!' : '📚 Keep studying!'}
              </p>
            </div>

            <div className="quiz-stats">
              <div className="stat-item">
                <span className="stat-label">Correct Answers</span>
                <span className="stat-value">{userAnswers.filter(a => a.isCorrect).length} / {quizzes.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Attempts Used</span>
                <span className="stat-value">{attempts + 1} / {MAX_ATTEMPTS}</span>
              </div>
            </div>

            <div className="answers-review">
              <h3>Review Your Answers</h3>
              {userAnswers.map((answer, idx) => (
                <div key={idx} className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="answer-question">
                    <span className="answer-number">Q{idx + 1}:</span>
                    <span>{answer.question}</span>
                  </div>
                  <div className="answer-details">
                    <span className="your-answer">Your answer: {answer.selectedOption}</span>
                    {!answer.isCorrect && (
                      <span className="correct-answer">Correct: {answer.correctOption}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="quiz-actions">
              {canRetake && (
                <button className="btn-retake" onClick={handleRetake}>
                  Retake Quiz ({MAX_ATTEMPTS - (attempts + 1)} attempts left)
                </button>
              )}
              {!canRetake && (
                <p className="no-attempts">No more attempts available</p>
              )}
              <button className="btn-close" onClick={onClose}>Close</button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="quiz-overlay" onClick={onClose}>
      <motion.div
        className="quiz-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="quiz-header">
          <div className="quiz-title">
            <h2>{task.name}</h2>
            <p className="quiz-subject">{task.subject || 'General Study'}</p>
          </div>
          <button className="quiz-close" onClick={onClose}>✕</button>
        </div>

        <div className="quiz-progress">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / quizzes.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="progress-text">
            Question {currentQuestionIndex + 1} of {quizzes.length}
          </span>
        </div>

        <div className="quiz-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              className="question-container"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="question-text">{currentQuestion.question}</h3>

              <div className="options-container">
                {currentQuestion.options.map((option, idx) => {
                  const optionLetter = String.fromCharCode(65 + idx);
                  const isSelected = selectedOption === idx;
                  const isCorrect = optionLetter === currentQuestion.answer;
                  const showCorrectness = selectedOption !== null;

                  return (
                    <motion.button
                      key={idx}
                      className={`option-button ${
                        isSelected ? 'selected' : ''
                      } ${
                        showCorrectness && isCorrect ? 'correct' : ''
                      } ${
                        showCorrectness && isSelected && !isCorrect ? 'incorrect' : ''
                      }`}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={selectedOption !== null}
                      whileHover={selectedOption === null ? { scale: 1.02 } : {}}
                      whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                    >
                      <span className="option-letter">{optionLetter}</span>
                      <span className="option-text">{option}</span>
                      {showCorrectness && isCorrect && (
                        <span className="check-mark">✓</span>
                      )}
                      {showCorrectness && isSelected && !isCorrect && (
                        <span className="cross-mark">✗</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {showHint && (
                  <motion.div
                    className="hint-container"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="hint-icon">💡</div>
                    <p className="hint-text">{currentQuestion.hint}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="quiz-footer">
          <button
            className="btn-next"
            onClick={handleNext}
            disabled={selectedOption === null}
          >
            {currentQuestionIndex < quizzes.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
