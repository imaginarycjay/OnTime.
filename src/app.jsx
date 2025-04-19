import AwesomeNavigation from "./nav.jsx";
import AwesomeContent from "./content.jsx";
import AwesomeFooter from "./footer.jsx";
import Quote from "./quote.jsx";

function App() {
  return (
    <div className="wrapper">
      <AwesomeNavigation />
      <AwesomeContent />
      <Quote msg="It's not how much time you have, it's how you use it -Ekko" />
      <AwesomeFooter />
    </div>
  );
}

export default App;
