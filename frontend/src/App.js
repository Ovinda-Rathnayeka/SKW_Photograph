import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import PackagePage from "./pages/PackagePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { logout } from "./Api/AuthAPI.js";
<<<<<<< Updated upstream
import PaymentPage from "./pages/PaymentPage.jsx";
=======
>>>>>>> Stashed changes

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      sessionStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/packages" element={<PackagePage />} />
        <Route
          path="/login"
          element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />
<<<<<<< Updated upstream
        <Route path="/payment" element={<PaymentPage />} />
=======
>>>>>>> Stashed changes
      </Routes>
    </Router>
  );
}

export default App;
