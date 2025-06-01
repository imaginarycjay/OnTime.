import { motion } from "framer-motion";
import Info from "./info.jsx"
import InfoIMG from "./assets/info-2.svg";
import { useState } from "react";
function Navigation() {

  const [infoVisibility, setInfoVisibility] = useState(false);

  const openInfo = () => {
    setInfoVisibility(prev => !prev)
  }

  return (
    <div>
      <motion.nav
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 1.7 } }}
        className="main-nav"
      >
        <h1>OnTime.</h1>
        <button onClick={openInfo} className="info-button"><img className="info-img" src={InfoIMG}/></button>
      </motion.nav>
      {infoVisibility && <Info openInfo={openInfo}/>}
    </div>
  );
}

export default Navigation;
