import { motion } from "framer-motion";
import Info from "./info.jsx";
import Analytics from "./analytics.jsx";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import ShowChartIcon from "@mui/icons-material/ShowChart";

import { useState, useEffect } from "react";
function Navigation() {
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
        <div>
          <button onClick={openAnalytics} className="stat-button">
            <ShowChartIcon sx={{ fontSize: 32, color: "white" }} />
          </button>
          <button onClick={openInfo} className="info-button">
            <InfoOutlineIcon sx={{ fontSize: 32, color: "white" }} />
          </button>
        </div>
      </MotionNav>
      {infoVisibility && <Info openInfo={openInfo} />}
      {analyticsVisibility && <Analytics onClose={openAnalytics} />}
    </div>
  );
}

export default Navigation;
