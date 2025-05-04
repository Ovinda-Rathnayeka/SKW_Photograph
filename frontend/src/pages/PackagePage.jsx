import { useEffect, useState } from "react";
import { fetchPhotoPackages } from "../Api/PackageAPI.js";
import { fetchUserDetails } from "../Api/AuthAPI.js";
import dot from "../components/images/dot.jpg";
import BookingPage from "./BookingPage";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingModal from "./LoadingModal.js";

const PackagePage = () => {
  const [packages, setPackages] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Manage loading state

  const categories = [
    "Wedding",
    "Pre-Shoot",
    "Pre-Shoot + Wedding",
    "Party",
    "Normal",
  ];

  const navigate = useNavigate();

  // Fetch User Details
  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchUserDetails();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    getUser();
  }, []);

  // Fetch Packages
  useEffect(() => {
    const getPackages = async () => {
      try {
        const data = await fetchPhotoPackages();
        setPackages(data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching packages:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };
    getPackages();
  }, []);

  // Handle Book Now
  const handleBookNow = (pkg) => {
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Please login first",
        text: "You must be logged in to book a package.",
        confirmButtonColor: "#e3342f",
      });
      return;
    }

    const selected = {
      _id: pkg._id,
      packageName: pkg.packageName,
      category: pkg.category,
      price: pkg.price,
      duration: pkg.duration,
      numberOfPhotos: pkg.numberOfPhotos,
      photoEditing: pkg.photoEditing,
      deliveryTime: pkg.deliveryTime,
      additionalServices: pkg.additionalServices,
      image: pkg.image,
      description: pkg.description,
    };

    setSelectedPackage(selected);
    setIsBookingOpen(true);
  };

  // Close Booking Modal
  const closeBookingModal = () => {
    setIsBookingOpen(false);
    setSelectedPackage(null);
  };

  // Navigate to Custom Package Creation
  const handleCreateCustomizationPackage = () => {
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Please login first",
        text: "You must be logged in to create a custom package.",
        confirmButtonColor: "#e3342f",
      });
      return;
    }

    navigate("/customization");
  };

  return (
    <>
      <LoadingModal show={loading} /> {/* Show the loader while loading */}
      {/* Rest of the content will be shown after loading is complete */}
      {!loading && (
        <div
          className="flex flex-col min-h-screen bg-[#0D1317] text-white"
          style={{
            backgroundImage: `url(${dot})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          {/* Header */}
          <div className="text-center py-8 pt-20">
            <h2 className="text-3xl font-bold text-red-500 tracking-wide">
              Packages
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Choose a package that fits your needs.
            </p>
          </div>

          {/* Custom Package Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleCreateCustomizationPackage}
              className="w-64 mx-auto bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-semibold text-lg py-3 rounded-md shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              Create Customization Package
            </button>
          </div>

          {/* Packages by Category */}
          <div className="flex-grow">
            {categories.map((category) => {
              const categoryPackages = packages.filter(
                (pkg) => pkg.category === category
              );
              if (categoryPackages.length === 0) return null;

              return (
                <div key={category} className="container mx-auto px-4 mb-12">
                  <h3 className="text-2xl font-semibold text-red-500 mb-5 border-b border-gray-700 pb-1">
                    {category} Packages
                  </h3>

                  <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryPackages.map((pkg) => (
                      <div
                        key={pkg._id}
                        className="bg-[#1B242C] w-full h-[400px] flex flex-col justify-between rounded-lg p-4 shadow-md transform hover:scale-105 hover:border-red-500 border border-transparent transition duration-300"
                      >
                        <div>
                          <h3
                            className={`text-lg font-bold mb-2 ${
                              pkg.packageName === "SILVER"
                                ? "text-gray-300"
                                : pkg.packageName === "GOLD"
                                ? "text-yellow-400"
                                : "text-gray-100"
                            }`}
                          >
                            {pkg.packageName}
                          </h3>

                          <img
                            src={pkg.image}
                            alt={pkg.packageName}
                            className="mx-auto my-3 w-28 h-28 object-cover rounded-md shadow-sm"
                          />

                          <ul className="text-sm space-y-1 text-gray-300 mb-3">
                            <li>
                              📷{" "}
                              <span className="font-semibold">
                                {pkg.duration}
                              </span>{" "}
                              of photography
                            </li>
                            <li>
                              🖼{" "}
                              <span className="font-semibold">
                                {pkg.numberOfPhotos}
                              </span>{" "}
                              high-res photos
                            </li>
                            <li>✨ {pkg.photoEditing} Editing</li>
                            <li>
                              🚀 Delivery:{" "}
                              <span className="font-semibold">
                                {pkg.deliveryTime}
                              </span>
                            </li>
                            <li className="text-red-400 font-bold text-md">
                              LKR{pkg.price}
                            </li>
                          </ul>

                          <p className="text-gray-400 text-xs italic mb-3 line-clamp-2">
                            {pkg.description}
                          </p>
                        </div>

                        <button
                          onClick={() => handleBookNow(pkg)}
                          className="w-full bg-red-500 text-white font-semibold text-sm py-2 rounded-md hover:bg-red-600 transition duration-300"
                        >
                          Book Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booking Modal */}
          {isBookingOpen && (
            <BookingPage
              selectedPackage={selectedPackage}
              user={user}
              onClose={closeBookingModal}
            />
          )}

          {/* Footer */}
          <footer className="bg-[#0D1317] text-center text-gray-400 text-sm py-4">
            <p>© 2025 SKW Photography. All Rights Reserved.</p>
          </footer>
        </div>
      )}
    </>
  );
};

export default PackagePage;
