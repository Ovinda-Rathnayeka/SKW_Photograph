import { useEffect, useState } from "react";
import { fetchPhotoPackages } from "../Api/PackageAPI.js"; 
import { fetchUserDetails } from "../Api/AuthAPI.js"; 
import dot from "../components/images/dot.jpg"; 
import BookingPage from "./BookingPage"; 

const PackagePage = () => {
  const [packages, setPackages] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const categories = ["Wedding", "Pre-Shoot", "Pre-Shoot + Wedding", "Party", "Normal"];

  // Fetch user details when the component loads
  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchUserDetails();
        setUser(userData);
      } catch (error) {
        console.error("❌ Error fetching user details:", error);
      }
    };
    getUser();
  }, []);

  // Fetch packages when the component loads
  useEffect(() => {
    const getPackages = async () => {
      try {
        const data = await fetchPhotoPackages();
        console.log("✅ Packages fetched:", data);
        setPackages(data);
      } catch (error) {
        console.error("❌ Error fetching packages:", error);
      }
    };
    getPackages();
  }, []);

  // Handle opening the booking modal
  const handleBookNow = (pkg) => {
    console.log("📦 Selected Package (Before Fix):", pkg);
  
    setSelectedPackage({
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
      description: pkg.description
    });
  
    console.log("📦 Selected Package (After Fix):", selectedPackage);
    setIsBookingOpen(true);
  };
  // Handle closing the booking modal
  const closeBookingModal = () => {
    setIsBookingOpen(false);
    setSelectedPackage(null);
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-[#0D1317] text-white"
      style={{
        backgroundImage: `url(${dot})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Page Title */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-red-500 tracking-wide">Packages</h2>
        <p className="text-gray-400 text-sm mt-1">Choose a package that fits your needs.</p>
      </div>

      <div className="flex-grow">
        {categories.map((category) => {
          const categoryPackages = packages.filter((pkg) => pkg.category === category);
          if (categoryPackages.length === 0) return null;

          return (
            <div key={category} className="container mx-auto px-4 mb-12">
              <h3 className="text-2xl font-semibold text-red-500 mb-5 border-b border-gray-700 pb-1">
                {category} Packages
              </h3>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categoryPackages.map((pkg) => (
                  <div
                    key={pkg._id} 
                    className="bg-[#1B242C] rounded-lg p-4 shadow-md transform hover:scale-105 transition duration-300"
                  >
                    <h3
                      className={`text-lg font-bold ${
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

                    <ul className="text-xs space-y-1 text-gray-300 mb-3">
                      <li>📷 <span className="font-semibold">{pkg.duration}</span> of photography</li>
                      <li>🖼 <span className="font-semibold">{pkg.numberOfPhotos}</span> high-res photos</li>
                      <li>✨ {pkg.photoEditing} Editing</li>
                      <li>🚀 Delivery: <span className="font-semibold">{pkg.deliveryTime}</span></li>
                      <li className="text-red-400 font-bold text-md">${pkg.price}</li>
                    </ul>

                    <p className="text-gray-400 text-xs italic mb-3">{pkg.description}</p>

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
          onClose={closeBookingModal} // Function to close the modal
        />
      )}

      <footer className="bg-[#0D1317] text-center text-gray-400 text-sm py-4">
        <p>© 2024 SKW Photography. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default PackagePage;
