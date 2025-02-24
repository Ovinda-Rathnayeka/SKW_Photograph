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
      <div className="relative w-full min-h-screen bg-[#0a0a0a] text-white py-20 px-10 md:px-20">
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
  );
};

export default HomePage;
