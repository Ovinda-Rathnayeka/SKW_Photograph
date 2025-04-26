import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import PackagePage from "./pages/PackagePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import logout from "./Api/AuthAPI.js";
import PaymentPage from "./pages/PaymentPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import Feedbacks from "./pages/FeedbackDetails.js";
import AddFeedback from "./pages/AddFeedback.js";
<<<<<<< HEAD
import Product from "./pages/ProductDisplay.jsx";
import Cart from "./pages/CartDisplay.js";
=======
import UpdateFeedback from "./pages/UpdateFeedback.js";
import Profile from "./pages/ProfilePage.jsx";
<<<<<<< HEAD
>>>>>>> main
=======
import BookingHistory from "./pages/BookignHistory.jsx";
>>>>>>> main

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
        <Route
          path="/signup"
          element={<SignupPage setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/payment" element={<PaymentPage />} />

        <Route path="/feedbacks" element={<Feedbacks />} />
        <Route path="/add-feedback" element={<AddFeedback />} />
<<<<<<< HEAD
        <Route path="/product" element={<Product/>} />
=======
        <Route path="/feedbacks/:id" element={<UpdateFeedback />} />
<<<<<<< HEAD
        <Route path="/profile" element={<Profile/>} />
>>>>>>> main
=======
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking-history" element={<BookingHistory />} />
>>>>>>> main
      </Routes>
    </Router>
  );
}

export default App;
