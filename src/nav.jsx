import { motion } from "framer-motion";
import Info from "./info.jsx";
import Analytics from "./analytics.jsx";
import InfoOutlineIcon from "@mui/icons-material/InfoOutlined";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import WifiOffIcon from "@mui/icons-material/WifiOff";

import { useState } from "react";
function Navigation({ isOnline, database }) {
  const MotionNav = motion.nav;
  const [infoVisibility, setInfoVisibility] = useState(false);
  const [analyticsVisibility, setAnalyticsVisibility] = useState(false);

  const openInfo = () => {
    setInfoVisibility((prev) => !prev);
  };

  const openAnalytics = () => {
    setAnalyticsVisibility((prev) => !prev);
  };

  return (
    <div className="nav-container">
      <MotionNav
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 1.7 } }}
        className="main-nav"
      >
        <h1>KHNS OnTime</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {!isOnline && (
            <div className="offline-indicator" title="No internet connection - Study pack generation unavailable">
              <WifiOffIcon sx={{ fontSize: 24, color: '#ef4444' }} />
              <span className="offline-text">Offline</span>
            </div>
          )}
          <button onClick={openAnalytics} className="stat-button">
            <ShowChartIcon sx={{ fontSize: 32, color: "white" }} />
          </button>
          <button onClick={openInfo} className="info-button">
            <InfoOutlineIcon sx={{ fontSize: 32, color: "white" }} />
          </button>
        </div>
      </MotionNav>
      {infoVisibility && <Info openInfo={openInfo} />}
      {analyticsVisibility && <Analytics onClose={openAnalytics} database={database} />}
    </div>
  );
}

export default Navigation;
