import { motion } from "framer-motion";
import Info from "./info.jsx";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import ShowChartIcon from "@mui/icons-material/ShowChart";

import { useState, useEffect } from "react";
function Navigation() {
  const [infoVisibility, setInfoVisibility] = useState(false);
  const [chartVisibility, setChartVisibility] = useState(false);
  const [stats, setStats] = useState({ totalPomo: 0, hours: 0 });

  useEffect(() => {
    // Load stats from localStorage
    const stored = localStorage.getItem("ontime_stats");
    if (stored) {
      setStats(JSON.parse(stored));
    }
  }, [chartVisibility]);

  const openInfo = () => {
    setInfoVisibility((prev) => !prev);
  };

  const openChart = () => {
    setChartVisibility((prev) => !prev);
  };

  return (
    <div className="nav-container">
      <motion.nav
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 1.7 } }}
        className="main-nav"
      >
        <h1>KHNS OnTime</h1>
        <div>
          <button onClick={openChart} className="stat-button">
            <ShowChartIcon sx={{ fontSize: 32, color: "white" }} />
          </button>
          <button onClick={openInfo} className="info-button">
            <InfoOutlineIcon sx={{ fontSize: 32, color: "white" }} />
          </button>
        </div>
      </motion.nav>
      {infoVisibility && <Info openInfo={openInfo} />}
      {chartVisibility && (
        <div className="modal-overlay" style={{zIndex: "30"}}>
          <div className="modal-container">
            <div style={{ padding: 24, textAlign: "center" }}>
              <h2 style={{marginTop: '0'}}>Statistics</h2>
              <p>Total Pomodoro: {stats.totalPomo}</p>
              <p>Hours Focused: {stats.hours.toFixed(2)}</p>
              <button className="modal-add-butt" onClick={openChart}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navigation;
