import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TaskManager from "./tasks.jsx";
import Modal from "./modal.jsx";
import ConfirmModal from "./confirmModal.jsx";

function MainContent() {
   const [currentTime, setCurrentTime] = useState(25 * 60);
   const [timeRunning, setTimeRunning] = useState(false);
   const [modalOpen, setModalOpen] = useState(false);
   const [editingData, setEditingData] = useState(null);
   const [activeBtn, setActiveBtn] = useState("pomodoro");
   const [focusType, setFocusType] = useState("Time to Focus!");
   const [selectedTask, setSelectedTask] = useState(null);
   const [list, setList] = useState(() => {
      const stored = localStorage.getItem("myTODOs");
      return stored ? JSON.parse(stored) : [];
   });
   const [showSelectTaskModal, setShowSelectTaskModal] = useState(false);
   const [showTaskDoneModal, setShowTaskDoneModal] = useState(false);
   const [showConfirmModal, setShowConfirmModal] = useState(false);
   const [pendingSwitch, setPendingSwitch] = useState(null);
   const [showRefreshConfirm, setShowRefreshConfirm] = useState(false);
   const [audioContext, setAudioContext] = useState(null);
   const [audioBuffer, setAudioBuffer] = useState(null);
   const [pomodoroCount, setPomodoroCount] = useState(0); // Track completed pomodoros for break cycle
   const [startTimestamp, setStartTimestamp] = useState(null); // Track when timer started
   const [targetEndTime, setTargetEndTime] = useState(null); // Track when timer should end

   // Function to reset timer to initial pomodoro state
   const resetToPomodoro = () => {
      setCurrentTime(25 * 60);
      setTimeRunning(false);
      setActiveBtn("pomodoro");
      setFocusType("Time to Focus!");
      document.documentElement.style.setProperty("--primary-bg-color", "#be3d2a");
      document.documentElement.style.setProperty("--secondary-bg-color", "#d57d70");
   };

   // Initialize Web Audio API and request notification permission
   useEffect(() => {
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
         Notification.requestPermission();
      }

      // Initialize Web Audio API
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      setAudioContext(ctx);

      // Load the alarm sound into audio buffer
      const loadAudioBuffer = async () => {
         try {
            const response = await fetch('https://assets.mixkit.co/active_storage/sfx/1363/1363-preview.mp3');
            const arrayBuffer = await response.arrayBuffer();
            const buffer = await ctx.decodeAudioData(arrayBuffer);
            setAudioBuffer(buffer);
         } catch (error) {
            console.log('Failed to load audio buffer:', error);
         }
      };

      loadAudioBuffer();

      return () => {
         if (ctx.state !== 'closed') {
            ctx.close();
         }
      };
   }, []);

   const alarmSound = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/1363/1363-preview.mp3",
   );

   useEffect(() => {
      alarmSound.load();
   }, []);

   // Prevent accidental page refresh/close when timer is running
   useEffect(() => {
      const handleBeforeUnload = (e) => {
         if (timeRunning) {
            e.preventDefault();
            e.returnValue = ''; // Required for Chrome
            return ''; // Required for some browsers
         }
      };

      const handleKeyDown = (e) => {
         // Check for F5 or Ctrl+R (or Cmd+R on Mac)
         if (timeRunning && (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.metaKey && e.key === 'r'))) {
            e.preventDefault();
            setShowRefreshConfirm(true);
         }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('keydown', handleKeyDown);

      return () => {
         window.removeEventListener('beforeunload', handleBeforeUnload);
         window.removeEventListener('keydown', handleKeyDown);
      };
   }, [timeRunning]);

   // Update browser tab title with time and task name
   useEffect(() => {
      const formattedTimeForTitle = formattedTime(currentTime);

      if (selectedTask) {
         document.title = `${formattedTimeForTitle} - ${selectedTask.name}`;
      } else {
         document.title = `${formattedTimeForTitle} - Pomodoro Timer`;
      }

      // Cleanup: reset title when component unmounts
      return () => {
         document.title = 'Pomodoro Timer';
      };
   }, [currentTime, selectedTask]);

   // to do: make a ticking ticking sound (katamad)
   // const tickingSound = new Audio("");

   // Accurate timer using timestamp-based calculation
   useEffect(() => {
      let intervalId;

      if (timeRunning && currentTime > 0) {
         // Set the target end time when timer starts
         if (!targetEndTime) {
            const now = Date.now();
            setStartTimestamp(now);
            setTargetEndTime(now + (currentTime * 1000));
         }

         // Use a shorter interval for more frequent checks (100ms)
         intervalId = setInterval(() => {
            const now = Date.now();
            const remainingMs = targetEndTime - now;
            const remainingSeconds = Math.ceil(remainingMs / 1000);

            if (remainingSeconds <= 0) {
               // Timer finished
               setCurrentTime(0);
               setTimeRunning(false);
               setTargetEndTime(null);
               setStartTimestamp(null);
            } else if (remainingSeconds !== currentTime) {
               // Update the display
               setCurrentTime(remainingSeconds);
            }
         }, 100); // Check every 100ms for smooth updates
      } else if (!timeRunning) {
         // Reset timestamps when paused
         setTargetEndTime(null);
         setStartTimestamp(null);
      }

      // Handle timer completion
      if (currentTime === 0 && !timeRunning && (startTimestamp !== null || activeBtn)) {
         playAlarm(); // Use the enhanced alarm function

         // Handle the cycle based on current mode
         if (activeBtn === "pomodoro") {
            // Pomodoro just finished - increment count and switch to break
            const newCount = pomodoroCount + 1;
            setPomodoroCount(newCount);

            // Update task stats if there's a selected task
            if (selectedTask) {
               setList((prevList) => {
                  const idx = prevList.findIndex(
                     (t) =>
                        t.name === selectedTask.name &&
                        t.pomoTotal === selectedTask.pomoTotal,
                  );
                  if (idx === -1) return prevList;
                  const updatedTask = {
                     ...prevList[idx],
                     pomoDone: prevList[idx].pomoDone + 1,
                  };
                  const newList = [...prevList];
                  newList[idx] = updatedTask;
                  setSelectedTask(updatedTask);

                  // Update stats in localStorage
                  const stats = JSON.parse(
                     localStorage.getItem("ontime_stats"),
                  ) || {
                     totalPomo: 0,
                     hours: 0,
                  };
                  stats.totalPomo += 1;
                  stats.hours += 25 / 60;
                  localStorage.setItem("ontime_stats", JSON.stringify(stats));

                  // Check if task is completed
                  if (updatedTask.pomoDone >= updatedTask.pomoTotal) {
                     setShowTaskDoneModal(true);
                  }

                  return newList;
               });
            }

            // Decide which break to take based on pomodoro count
            if (newCount % 4 === 0) {
               // Every 4th pomodoro = long break
               handleClick(
                  "long",
                  10 * 60,
                  false,
                  "Time for Long Break",
                  "#d97217",
                  "#e3934d",
               );
            } else {
               // Otherwise = short break
               handleClick(
                  "short",
                  5 * 60,
                  false,
                  "Time for Break",
                  "#169c3e",
                  "#4cb16a",
               );
            }
         } else if (activeBtn === "short" || activeBtn === "long") {
            // Break just finished - switch back to pomodoro (but don't start it)
            handleClick(
               "pomodoro",
               25 * 60,
               false,
               "Time to Focus!",
               "#be3d2a",
               "#d57d70",
            );
         }
      }

      return () => {
         if (intervalId) {
            clearInterval(intervalId);
         }
      };
   }, [timeRunning, currentTime, targetEndTime, selectedTask, activeBtn, pomodoroCount]);

   function formattedTime(time) {
      const mins = Math.floor(time / 60);
      const sec = time % 60;
      return `${String(mins).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
   }

   function startTime() {
      if (activeBtn === "pomodoro" && !selectedTask) {
         setShowSelectTaskModal(true);
         return;
      }
      if (
         activeBtn === "pomodoro" &&
         selectedTask &&
         selectedTask.pomoDone >= selectedTask.pomoTotal
      ) {
         setShowTaskDoneModal(true);
         return;
      }
      setTimeRunning((prev) => !prev);
   }

   const handleClick = (type, time, timeRunning, focus, bg, bg2) => {
      setActiveBtn(type);
      setCurrentTime(time);
      setTimeRunning(timeRunning);
      setFocusType(focus);

      document.documentElement.style.setProperty("--primary-bg-color", bg);
      document.documentElement.style.setProperty("--secondary-bg-color", bg2);
   };

   function handleModeSwitch(type, time, focus, bg, bg2) {
      // Check if we need confirmation
      const needsConfirmation =
         (timeRunning && activeBtn === "pomodoro" && (type === "short" || type === "long")) ||
         (timeRunning && (activeBtn === "short" || activeBtn === "long") && type === "pomodoro");

      if (needsConfirmation) {
         setPendingSwitch({ type, time, focus, bg, bg2 });
         setShowConfirmModal(true);
      } else {
         handleClick(type, time, false, focus, bg, bg2);
      }
   }

   function confirmSwitch() {
      if (pendingSwitch) {
         const { type, time, focus, bg, bg2 } = pendingSwitch;
         handleClick(type, time, false, focus, bg, bg2);
         setPendingSwitch(null);
      }
      setShowConfirmModal(false);
   }

   function cancelSwitch() {
      setPendingSwitch(null);
      setShowConfirmModal(false);
   }

   function getConfirmMessage() {
      if (!pendingSwitch) return "";

      if (activeBtn === "pomodoro" && (pendingSwitch.type === "short" || pendingSwitch.type === "long")) {
         return "Your pomodoro progress will be lost if you switch to a break. Do you want to continue?";
      } else if ((activeBtn === "short" || activeBtn === "long") && pendingSwitch.type === "pomodoro") {
         return "You're still on a break. Do you want to start a pomodoro session now?";
      }
      return "";
   }

   function toggleModal() {
      setModalOpen((prev) => !prev);
      if (!modalOpen) {
         setEditingData(null);
      }
   }

   function getDataModal(data) {
      if (data.isEditing && editingData !== null) {
         const newList = [...list];
         newList[editingData.index] = data.result;
         setList(newList);
      } else {
         setList((prev) => [...prev, data.result]);
      }
   }

   function confirmRefresh() {
      setShowRefreshConfirm(false);
      window.location.reload();
   }

   function cancelRefresh() {
      setShowRefreshConfirm(false);
   }

   // Enhanced alarm function with multiple fallbacks
   const playAlarm = async () => {
      let played = false;

      // Method 1: Try Web Audio API (most reliable for background tabs)
      if (audioContext && audioBuffer) {
         try {
            // Resume audio context if suspended (important for background tabs)
            if (audioContext.state === 'suspended') {
               await audioContext.resume();
            }

            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start(0);
            played = true;
            console.log('Alarm played via Web Audio API');
         } catch (error) {
            console.log('Web Audio API failed:', error);
         }
      }

      // Method 2: Try HTML5 Audio as fallback
      if (!played) {
         try {
            alarmSound.currentTime = 0;
            await alarmSound.play();
            played = true;
            console.log('Alarm played via HTML5 Audio');
         } catch (error) {
            console.log('HTML5 Audio failed:', error);
         }
      }

      // Method 3: Generate a beep sound using Web Audio API (always works offline)
      if (!played && audioContext) {
         try {
            if (audioContext.state === 'suspended') {
               await audioContext.resume();
            }

            // Generate three beeps
            for (let i = 0; i < 3; i++) {
               const oscillator = audioContext.createOscillator();
               const gainNode = audioContext.createGain();

               oscillator.connect(gainNode);
               gainNode.connect(audioContext.destination);

               oscillator.frequency.value = 800; // 800 Hz tone
               gainNode.gain.value = 0.3;

               const startTime = audioContext.currentTime + (i * 0.4);
               oscillator.start(startTime);
               oscillator.stop(startTime + 0.2);
            }
            played = true;
            console.log('Alarm played via synthesized beep');
         } catch (error) {
            console.log('Synthesized beep failed:', error);
         }
      }

      // Method 4: Browser notification (works even when tab is in background)
      if ('Notification' in window && Notification.permission === 'granted') {
         const notificationTitle = activeBtn === 'pomodoro'
            ? '🍅 Pomodoro Complete!'
            : '☕ Break Time Over!';

         const notificationBody = activeBtn === 'pomodoro'
            ? 'Great work! Time for a break.'
            : 'Break is over. Ready to focus?';

         try {
            const notification = new Notification(notificationTitle, {
               body: notificationBody,
               icon: '/pwdTomato-192.png',
               badge: '/pwdTomato-192.png',
               tag: 'pomodoro-timer',
               requireInteraction: true, // Keeps notification visible
               silent: false, // Play notification sound
            });

            // Focus window when notification is clicked
            notification.onclick = () => {
               window.focus();
               notification.close();
            };

            console.log('Notification sent');
         } catch (error) {
            console.log('Notification failed:', error);
         }
      }

      // If all methods failed, log it
      if (!played) {
         console.error('All alarm methods failed');
      }
   };

   return (
      <main className="root-parent">
         <motion.div
            initial={{ opacity: 0, x: -500 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}
            className="main-pomodoro"
         >
            <section className="buttons-section">
               <button
                  onClick={() =>
                     handleModeSwitch(
                        "pomodoro",
                        25 * 60,
                        "Time to Focus",
                        "#be3d2a",
                        "#d57d70",
                     )
                  }
                  style={{
                     backgroundColor: activeBtn === "pomodoro" ? "#d57d70" : "",
                  }}
                  className="pomodoro-button"
               >
                  Pomodoro
               </button>

               <button
                  onClick={() =>
                     handleModeSwitch(
                        "short",
                        5 * 60,
                        "Time for Break",
                        "#169c3e",
                        "#4cb16a",
                     )
                  }
                  style={{
                     backgroundColor: activeBtn === "short" ? "#4cb16a" : "",
                  }}
                  className="sbreak-button"
               >
                  Short Break
               </button>

               <button
                  onClick={() =>
                     handleModeSwitch(
                        "long",
                        10 * 60,
                        "Time for Long Break",
                        "#d97217",
                        "#e3934d",
                     )
                  }
                  style={{
                     backgroundColor: activeBtn === "long" ? "#e3934d" : "",
                  }}
                  className="lbreak-button"
               >
                  Long Break
               </button>
            </section>

            <div>
               <div className="main-card">
                  <p className="prompt-title">{focusType}</p>
                  <p className="main-time">{formattedTime(currentTime)}</p>
                  <div className="button-container">
                     <button onClick={startTime} className="start-button">
                        {!timeRunning ? "START" : "PAUSE"}
                     </button>
                     <button onClick={toggleModal} className="add-task-button">
                        Add Task +
                     </button>
                  </div>

                  {selectedTask && (
                     <div className="selected-task-display">
                        <span>
                           Focusing: {selectedTask.name} (
                           {selectedTask.pomoDone}/{selectedTask.pomoTotal})
                        </span>
                     </div>
                  )}
               </div>
            </div>
         </motion.div>

         <TaskManager
            taskList={list.length}
            list={list}
            setList={setList}
            setEditingData={(data) => {
               setEditingData(data);
               setModalOpen(true);
            }}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            timeRunning={timeRunning}
            setTimeRunning={setTimeRunning}
            resetToPomodoro={resetToPomodoro} // Pass the reset function to TaskManager
         />

         {modalOpen && (
            <Modal
               grabData={getDataModal}
               openModal={toggleModal}
               initialValue={editingData?.text || ""}
               isEditing={editingData !== null}
            />
         )}
         {showSelectTaskModal && (
            <div className="modal-overlay">
               <div className="modal-container">
                  <div style={{ padding: 24, textAlign: "center" }}>
                     <p style={{ fontSize: "1.2rem" }}>
                        You must select a task first.
                     </p>
                     <button
                        className="modal-add-butt"
                        onClick={() => setShowSelectTaskModal(false)}
                     >
                        OK
                     </button>
                  </div>
               </div>
            </div>
         )}
         {showTaskDoneModal && (
            <div className="modal-overlay">
               <div className="modal-container">
                  <div style={{ padding: 24, textAlign: "center" }}>
                     <p style={{ fontSize: "1.2rem" }}>
                        Task is done! Pick a new task.
                     </p>
                     <button
                        className="modal-add-butt"
                        onClick={() => setShowTaskDoneModal(false)}
                     >
                        OK
                     </button>
                  </div>
               </div>
            </div>
         )}
         {showConfirmModal && (
            <ConfirmModal
               message={getConfirmMessage()}
               onConfirm={confirmSwitch}
               onCancel={cancelSwitch}
            />
         )}
         {showRefreshConfirm && (
            <ConfirmModal
               message="Are you sure you want to refresh? You will lose any unsaved progress."
               onConfirm={confirmRefresh}
               onCancel={cancelRefresh}
            />
         )}
      </main>
   );
}

export default MainContent;
