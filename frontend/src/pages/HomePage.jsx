import React from "react";
import backgroundImage from "../components/images/background.jpg";
import box from "../components/images/box.jpg";
import owner from "../components/images/owner.jpg";
import owner_background from "../components/images/owner_background.jpg";
import service1 from "../components/images/service1.jpg";
import service2 from "../components/images/service2.jpg";
import service3 from "../components/images/service3.jpg";
import service4 from "../components/images/service4.jpg";
import service5 from "../components/images/service5.jpg";
import service6 from "../components/images/service6.jpg";
import service7 from "../components/images/service7.jpg";
import service8 from "../components/images/service8.jpg";
import dot from "../components/images/dot.jpg";
import image1 from "../components/images/image1.jpg";
import image2 from "../components/images/image2.jpg";
import image3 from "../components/images/image3.jpg";
import background3 from "../components/images/background3.jpg";
import videoThumbnail1 from "../components/images/vedios1.jpg";
import videoThumbnail2 from "../components/images/vedios2.jpg";
import videoThumbnail3 from "../components/images/vedios3.jpg";
import videoThumbnail4 from "../components/images/vedios4.jpg";
import logo from "../components/images/logo.png";



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
      <div className="absolute right-20 md:right-40 top-1/2 transform -translate-y-1/2 rotate-6 w-72 md:w-96 shadow-lg">
        <img src={box} alt="Small Box" className="rounded-lg shadow-2xl" />
      </div>

      {/* Who We Are Section */}
      <div
        className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center px-10 md:px-20 py-20"
        style={{
          backgroundImage: `url(${owner_background})`,
          backgroundSize: "cover, contain",
          backgroundPosition: "center, top",
          backgroundBlendMode: "multiply",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Left Side: Person Image */}
        <div className="relative w-full md:w-1/3 z-10 flex justify-center md:justify-end">
          <img
            src={owner}
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
          <div className="relative mt-5 p-8 md:p-10 bg-green-200 text-gray-900 max-w-2xl custom-shape shadow-lg">
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
              Trust us to deliver exceptional results tailored to your unique
              story.
            </p>
          </div>
        </div>
      </div>
      {/* 🔥 Our Services Section */}
      <div
        className="relative w-full min-h-screen text-white py-20 px-10 md:px-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${dot})` }} // Replace with your actual image variable
      >
        {/* Dark Overlay for Better Text Visibility */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content Container */}
        <div className="relative z-10">
          <h2 className="text-center text-4xl md:text-5xl font-bold mb-10">
            Our <span className="text-orange-500">Services</span>
          </h2>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                img: service1,
                title: "Camera Items and Lights",
                desc: "We offer high-quality lighting and camera equipment.",
              },
              {
                img: service2,
                title: "Photographers",
                desc: "We click and capture the moment forever!",
              },
              {
                img: service3,
                title: "Lamination Services",
                desc: "Complete lamination services by our expert team.",
              },
              {
                img: service4,
                title: "Video Shooting Services",
                desc: "Professional videography for all occasions.",
              },
              {
                img: service5,
                title: "Photo Studio & Services",
                desc: "A well-equipped studio for creative photography.",
              },
              {
                img: service6,
                title: "Wedding Photography",
                desc: "Exquisite wedding photography and videography.",
              },
              {
                img: service7,
                title: "Outdoor Photography",
                desc: "Capturing nature, wildlife, and adventure.",
              },
              {
                img: service8,
                title: "Video Recording",
                desc: "Advanced technology for high-quality video recording.",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-[#131313] p-5 rounded-lg shadow-lg overflow-hidden relative group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-40 object-cover rounded-lg mb-4 transition-transform duration-500 group-hover:scale-110"
                />
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="text-sm text-gray-400">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 🖼️ Latest Work Gallery Section */}
      <div className="relative w-full min-h-[600px] flex flex-col items-center justify-center py-20 px-10 md:px-20 bg-[#0a0a0a]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50 rounded-lg"
          style={{ backgroundImage: `url(${dot})` }} // Background image
        ></div>

        {/* Section Heading (Remains in Place) */}
        <h2 className="relative text-center text-4xl md:text-5xl font-bold text-white mb-16 -mt-10 z-20">
          Latest Work <span className="text-orange-500">Gallery</span>
        </h2>

        {/* 🔽 Moved Entire Image Group Down 🔽 */}
        <div className="relative w-full max-w-6xl mx-auto mt-20">
          {" "}
          {/* Increased margin-top to push down */}
          {/* Background Horizontal Image */}
          <div className="w-full h-100 md:h-80 bg-gray-800 rounded-lg overflow-hidden shadow-xl">
            <img
              src={background3}
              alt="Background Gallery"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Floating Images (Moved Down) */}
          <div className="absolute top-[-15%] left-1/2 transform -translate-x-1/2 flex gap-6 z-10">
            {/* Left Image */}
            <div className="w-40 md:w-52 h-52 bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-110 transition-all duration-300">
              <img
                src={image1}
                alt="Gallery 1"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Center Image (Bigger & Even Higher) */}
            <div className="w-48 md:w-60 h-60 bg-gray-800 rounded-lg overflow-hidden shadow-xl transform hover:scale-110 transition-all duration-300">
              <img
                src={image2}
                alt="Gallery 2"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Image */}
            <div className="w-40 md:w-52 h-52 bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-110 transition-all duration-300">
              <img
                src={image3}
                alt="Gallery 3"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 🟠 View All Button */}
        <button className="relative mt-8 px-6 py-3 bg-orange-500 text-white font-semibold rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 z-10">
          View All
        </button>
      </div>
      {/* 🔴 Video Section with Background Image */}
      <div
        className="relative w-full flex flex-col items-center justify-center py-20 px-6 md:px-12 bg-cover bg-center"
        style={{ backgroundImage: `url(${dot})` }} // Replace with your image path
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Section Content */}
        <div className="relative z-10 w-full max-w-6xl text-center">
          {/* Section Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Our <span className="text-orange-500">Videos</span>
          </h2>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Video Cards */}
            {[
              videoThumbnail1,
              videoThumbnail2,
              videoThumbnail3,
              videoThumbnail4,
            ].map((video, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-lg shadow-lg"
              >
                <img
                  src={video}
                  alt={`Video ${index + 1}`}
                  className="w-full h-48 object-cover transition duration-300 group-hover:brightness-75"
                />
                <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white p-3 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  ▶️
                </button>
                <div className="p-4 bg-gray-900">
                  <h3 className="text-white font-semibold">
                    Video Title {index + 1}
                  </h3>
                  <span className="text-gray-400 text-sm">Category</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 🔵 Footer Section */}
      <footer className="bg-[#10202B] text-white py-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p className="text-gray-300 text-sm">Sahan Ovrids</p>
            <p className="text-gray-300 text-sm">+07123456789</p>
            <p className="text-gray-300 text-sm">sahanovrids@gmail.com</p>

            {/* Contact Form */}
            <form className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <input
                type="text"
                placeholder="Mobile Number"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <textarea
                placeholder="Message"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              ></textarea>
              <button className="w-full px-5 py-2 bg-orange-500 text-white font-semibold rounded-md shadow-lg hover:bg-orange-600 focus:outline-none text-sm">
                Submit
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <a
                  href="#gallery"
                  className="hover:text-orange-500 transition duration-200 ease-in-out"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-orange-500 transition duration-200 ease-in-out"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#videos"
                  className="hover:text-orange-500 transition duration-200 ease-in-out"
                >
                  Videos
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="hover:text-orange-500 transition duration-200 ease-in-out"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-orange-500 transition duration-200 ease-in-out"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <img
                src={logo} // Ensure your logo path is correct here
                alt="MCU Photography Logo"
                className="mr-2 w-8 h-8 object-contain"
              />
              SKW Photography
            </h3>
            <p className="text-gray-300 text-sm">971/C, Malabe, Sri Lanka</p>
            <p className="text-gray-300 text-sm">+94 712 123 123</p>
            <p className="text-gray-300 text-sm">photography@gmail.com</p>
            <p className="text-gray-300 text-sm mt-2">
              Opening Hours: <br /> Mon-Sat: 8:00 AM - 6:00 PM
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-xs mt-6">
          © Copyright 2024. SKW Photography. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
