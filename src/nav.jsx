import { motion } from "framer-motion";
import Info from "./info";
import 
function Navigation() {
  return (
    <div>
      <motion.nav
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 1.7 } }}
        className="main-nav"
      >
        <h1>OnTime.</h1>
      </motion.nav>
      <Info />
    </div>
  );
}

export default Navigation;
