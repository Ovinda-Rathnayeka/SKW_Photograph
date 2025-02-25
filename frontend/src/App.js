import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import PackagePage from "./pages/PackagePage.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* ✅ Use Route */}
        <Route path="/packages" element={<PackagePage />} />{" "}
        {/* ✅ Use Route */}
      </Routes>
    </Router>
  );
}

export default App;
