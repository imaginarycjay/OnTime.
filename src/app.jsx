import Nav from "./nav.jsx";
import MainContent from "./content.jsx";

function App() {
   return (
      <>
         <Nav />
         <div className="wrapper">
            <MainContent />
         </div>
      </>
   );
}

export default App;
