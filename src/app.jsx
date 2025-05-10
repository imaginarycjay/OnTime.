import Nav from "./nav.jsx";
import MainContent from "./content.jsx";
import Quote from "./quote.jsx";

function App() {
  return (
    <>
      <Nav />
      <div className="wrapper">
        <MainContent />
        <Quote msg="It's not how much time you have, it's how you use it -Ekko" />
      </div>
    </>
  );
}

export default App;
