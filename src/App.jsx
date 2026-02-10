import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Homepage from "./pages/Homepage";
import FloorPlans from "./pages/FloorPlans";
import Viewspage from "./pages/Viewspage";
import Locations from "./pages/Locations";

// Placeholder components for other pages (we'll build these next)
const PlaceholderPage = ({ title }) => {
  const navigate = useNavigate();

  const handleBackToMenu = () => {
    // Navigate back to homepage with state to keep menu open
    navigate("/", { state: { menuOpen: true } });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #1a1520 0%, #2d2535 100%)",
        fontFamily: "Arboria, sans-serif",
      }}
    >
      <style>{`
        @font-face {
          font-family: 'Arboria';
          src: url('/fonts/ARBORIA-BOOK.TTF') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
      `}</style>
      <div className="text-center">
        <h1 className="text-white text-4xl mb-4">{title}</h1>
        <p className="text-white/50 mb-8">Coming soon...</p>
        <button
          onClick={handleBackToMenu}
          className="px-6 py-3 rounded-lg text-white text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105 cursor-pointer"
          style={{
            background:
              "linear-gradient(135deg, #d4956a 0%, #c47a4a 40%, #a85a35 100%)",
          }}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

const Apartments = () => <PlaceholderPage title="Apartments" />;
const Amenities = () => <PlaceholderPage title="Amenities" />;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/views" element={<Viewspage />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/floor-plans" element={<FloorPlans />} />
        <Route path="/apartments" element={<Apartments />} />
        <Route path="/amenities" element={<Amenities />} />
      </Routes>
    </Router>
  );
};

export default App;