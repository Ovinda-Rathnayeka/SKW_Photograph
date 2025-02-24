import React from "react";
import backgroundImage from "../components/images/background.jpg";
import box from "../components/images/box.jpg";
import owner from "../components/images/owner.jpg";
import owner_background from "../components/images/owner_background.jpg";

const HomePage = () => {
  return (
    <div className="relative w-full h-screen font-['Poppins']">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>{" "}
        {/* Dark overlay */}
      </div>

      {/* Text Section */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full px-10 md:px-20">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
          Bringing your <br />
          moments to <br />
          life, <span className="text-white">one click</span> <br />
          at a time
        </h1>

        {/* Enquiry Button */}
        <button className="mt-5 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105">
          ENQUIRY NOW →
        </button>
      </div>

      {/* Small Box Image - Rotated & Positioned */}
      {/* Small Box Image - Centered Vertically */}
      <div className="absolute right-20 md:right-40 top-1/2 transform -translate-y-1/2 rotate-6 w-72 md:w-96 shadow-lg">
        <img src={box} alt="Small Box" className="rounded-lg shadow-2xl" />
      </div>

      {/* Who We Are Section */}
      <div
        className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center px-10 md:px-20 py-20"
        style={{
          backgroundImage: `url(${owner_background}), url('/path/to/broken-paper-texture.png')`,
          backgroundSize: "cover, contain",
          backgroundPosition: "center, center",
          backgroundBlendMode: "overlay",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Left Side: Person Image */}
        <div className="relative w-full md:w-1/3 z-10 flex justify-center md:justify-end">
          <img
            src={owner} // Replace with actual path
            alt="Photographer"
            className="w-64 md:w-80 rounded-lg shadow-lg"
          />
        </div>

        {/* Right Side: Text Section with Curved Box */}
        <div className="relative w-full md:w-2/3 z-10 flex flex-col items-start md:pl-10">
          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-orange-400">Who</span>{" "}
            <span className="text-white">We Are</span>{" "}
            <span className="text-orange-500">?</span>
          </h2>

          {/* Curved Text Box */}
          <div className="relative mt-5 p-6 md:p-10 bg-green-200 text-gray-900 rounded-[40px] shadow-lg max-w-2xl">
            <p className="text-lg leading-relaxed">
              At, we are dedicated to capturing life's most precious moments
              with a creative and professional touch. Founded by Shahela
              Kahadawala, our studio specializes in photography and videography
              services, ensuring that every event is beautifully documented.
              <br />
              <br />
              We also offer photo and video editing, photo framing, album
              design, as well as camera and light rentals for all your creative
              needs. With years of experience, we’re passionate about providing
              high-quality work that preserves your memories for a lifetime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
