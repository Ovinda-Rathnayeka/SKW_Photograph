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
import Product from "./pages/ProductDisplay.jsx";
import Cart from "./pages/CartDisplay.js";
import UpdateFeedback from "./pages/UpdateFeedback.js";
import DisplayRental from "./pages/DisplayRental.jsx";
import Profile from "./pages/ProfilePage.jsx";
import BookingHistory from "./pages/BookignHistory.jsx";
<<<<<<< HEAD
import Feedback from "./pages/feedback.js";
=======
import Displayrental from "./pages/DisplayRental.jsx";
>>>>>>> origin/main

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
        <Route path="/home" element={<HomePage />} />
        <Route path="/packages" element={<PackagePage />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<SignupPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/feedbacks" element={<Feedbacks />} />
        <Route path="/add-feedback" element={<AddFeedback />} />
        <Route path="/feedbacks/:id" element={<UpdateFeedback />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/rental" element={<DisplayRental />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking-history" element={<BookingHistory />} />
<<<<<<< HEAD
        <Route path="/feedback" element={<Feedback />} />
=======
        <Route path="/rental" element={<DisplayRental/>}/>
>>>>>>> origin/main
      </Routes>
    </Router>
  );
}

export default App;
