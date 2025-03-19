import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Nav from "../Nav/Nav";
import axios from "axios";
import Feedbacks from "../Feedbacks/Feedbacks";
import { ArrowUpCircle } from "lucide-react"; // Import Jump to Top Icon

const url = "http://localhost:5000/feedbacks";

// Fetch feedbacks from API
const fetchHandler = async () => {
  try {
    const response = await axios.get(url);
    console.log("Updated Feedback List:", response.data.feedbacks);
    return response.data;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return { feedbacks: [] };
  }
};

function FeedbackDetails() {
  const [feedbacks, setFeedbacks] = useState([]);

  // Show Jump to Top Button
  const [showTopBtn, setShowTopBtn] = useState(false);
  // Show button when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300); // Show button when scrolled down 300px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to Scroll to Top
  const scrollToTop = () => {
    window.scrollTo({ top: 0 });
  };  

  useEffect(() => {
    fetchHandler().then((data) => {
      setFeedbacks(data.feedbacks || []);
    });
  }, []);

  // Categorize Feedbacks
  const packages = feedbacks.filter(
    (fb) => fb.category?.trim().toLowerCase() === "package"
  );
  const rentals = feedbacks.filter(
    (fb) => fb.category?.trim().toLowerCase() === "rental"
  );
  const purchases = feedbacks.filter(
    (fb) => fb.category?.trim().toLowerCase() === "purchase"
  );

  // Smooth scrolling function
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <Nav />
      <br />

      {/* Customer Feedback Heading */}
      <h1 className="text-orange-400 text-3xl font-bold text-center mb-6">
        Customer Feedbacks
      </h1>

      {/* Small Navigation for Sections */}
      <div className="flex justify-center space-x-6 mb-8">
        <button
          onClick={() => scrollToSection("packages")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          📦 Packages
        </button>
        <button
          onClick={() => scrollToSection("rentals")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          🏠 Rentals
        </button>
        <button
          onClick={() => scrollToSection("purchases")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          🛒 Purchases
        </button>
      </div>

      {/* Animated Container for Smooth Fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="container mx-auto px-4"
      >
        {/* Section: Packages */}
        <div id="packages" className="mb-10">
          <h2 className="text-white text-2xl font-bold mb-4">📦 Packages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {packages.length > 0 ? (
              packages.map((feedback, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: i * 0.1,
                  }}
                >
                  <Feedbacks feedback={feedback} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-400">
                No package feedback available.
              </p>
            )}
          </div>
        </div>

        {/* Section: Rentals */}
        <div id="rentals" className="mb-10">
          <h2 className="text-white text-2xl font-bold mb-4">🏠 Rentals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {rentals.length > 0 ? (
              rentals.map((feedback, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: i * 0.1,
                  }}
                >
                  <Feedbacks feedback={feedback} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-400">
                No rental feedback available.
              </p>
            )}
          </div>
        </div>

        {/* Section: Purchases */}
        <div id="purchases" className="mb-10">
          <h2 className="text-white text-2xl font-bold mb-4">🛒 Purchases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.length > 0 ? (
              purchases.map((feedback, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: i * 0.1,
                  }}
                >
                  <Feedbacks feedback={feedback} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-400">
                No purchase feedback available.
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Jump to Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <ArrowUpCircle size={32} />
        </button>
      )}
    </div>
  );
}

export default FeedbackDetails;
// Compare this snippet from frontend/src/pages/FeedbackDetails.js: