import { useEffect, useState } from "react";
import Nav from "./nav.jsx";
import MainContent from "./content.jsx";
import database from "./services/database.js";

function App() {
   const [isOnline, setIsOnline] = useState(window.navigator.onLine);
   const [dbReady, setDbReady] = useState(false);

   useEffect(() => {
      // Initialize database
      database.init().then(() => {
         setDbReady(true);
         console.log('Database ready');
      }).catch(err => {
         console.error('Database initialization failed:', err);
         // Still allow app to load even if database fails
         setDbReady(true);
      });

      // Online/Offline detection
      const handleOnline = () => {
         console.log('Online event fired');
         setIsOnline(true);
      };
      const handleOffline = () => {
         console.log('Offline event fired');
         setIsOnline(false);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
         window.removeEventListener('online', handleOnline);
         window.removeEventListener('offline', handleOffline);
      };
   }, []);

   return (
      <>
         <Nav isOnline={isOnline} database={database} />
         <div className="wrapper">
            {dbReady ? (
               <MainContent isOnline={isOnline} database={database} />
            ) : (
               <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
                  Loading...
               </div>
            )}
         </div>
      </>
   );
}

export default App;
