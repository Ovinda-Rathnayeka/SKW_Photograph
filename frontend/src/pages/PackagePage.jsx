import { useEffect, useState } from "react";
import { fetchPhotoPackages } from "../Api/PackageAPI.js"; // Import API function
import dot from "../components/images/dot.jpg"; // Background image

const PackagePage = () => {
  const [packages, setPackages] = useState([]);
  const categories = ["Wedding", "Normal", "Event", "Party", "Musical"];

  useEffect(() => {
    const getPackages = async () => {
      try {
        const data = await fetchPhotoPackages();
        setPackages(data);
      } catch (error) {
        console.error("❌ Error fetching packages:", error);
      }
    };

    getPackages();
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen bg-[#0D1317] text-white"
      style={{
        backgroundImage: `url(${dot})`, // Set background image
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
        {/* Loop through each category */}
        {categories.map((category) => {
          const categoryPackages = packages.filter((pkg) => pkg.category === category);
          if (categoryPackages.length === 0) return null;

          return (
            <div key={category} className="container mx-auto px-4 mb-12">
              {/* Category Title */}
              <h3 className="text-2xl font-semibold text-yellow-400 mb-5 border-b border-gray-700 pb-1">
                {category} Packages
              </h3>

              {/* Package Cards Grid */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categoryPackages.map((pkg) => (
                  <div
                    key={pkg.packageId}
                    className="bg-[#1B242C] rounded-lg p-4 shadow-md transform hover:scale-105 transition duration-300"
                  >
                    {/* Package Name */}
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

                    {/* Package Image */}
                    <img
                      src={pkg.image}
                      alt={pkg.packageName}
                      className="mx-auto my-3 w-28 h-28 object-cover rounded-md shadow-sm"
                    />

                    {/* Package Details */}
                    <ul className="text-xs space-y-1 text-gray-300 mb-3">
                      <li>📷 <span className="font-semibold">{pkg.duration}</span> of photography</li>
                      <li>🖼 <span className="font-semibold">{pkg.numberOfPhotos}</span> high-resolution photos</li>
                      <li>✨ {pkg.photoEditing} Editing</li>
                      <li>🚀 Delivery: <span className="font-semibold">{pkg.deliveryTime}</span></li>
                      <li className="text-red-400 font-bold text-md">${pkg.price}</li>
                    </ul>

                    {/* Package Description */}
                    <p className="text-gray-400 text-xs italic mb-3">{pkg.description}</p>

                    {/* "Book Now" Button */}
                    <button className="w-full bg-red-500 text-white font-semibold text-sm py-2 rounded-md hover:bg-red-600 transition duration-300">
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="bg-[#0D1317] text-center text-gray-400 text-sm py-4">
        <p>© 2024 SKW Photography. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default PackagePage;
