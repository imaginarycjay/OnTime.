import Nav from "./nav.jsx";
import MainContent from "./content.jsx";
import Quote from "./quote.jsx";
import Footer from "./footer.jsx";

function App() {
  return (
    <>
      <Nav />
      <div className="wrapper">
        <MainContent />
        <Quote msg="It's not how much time you have, it's how you use it -Ekko" />
        {/* <Footer /> */}
      </div>
    </>
  );
}

export default App;
