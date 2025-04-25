import React, { useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
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

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const photoAnimation = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05, 
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
    transition: { duration: 0.3 }
  }
};

const headerTextAnimation = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8, 
      delay: 0.2 
    } 
  }
};

const SectionAnimation = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeIn}
    >
      {children}
    </motion.div>
  );
};

const HomePage = () => {
  
  useEffect(() => {
    
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="relative w-full font-['Poppins'] overflow-hidden">
     
      <div className="relative w-full h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </motion.div>

       
        <div className="relative z-10 flex flex-col items-start justify-center h-full px-10 md:px-20">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500"
            variants={headerTextAnimation}
            initial="hidden"
            animate="visible"
          >
            Bringing your <br />
            moments to <br />
            life, <span className="text-white">one click</span> <br />
            at a time
          </motion.h1>

         
          <motion.button 
            className="mt-5 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ENQUIRY NOW →
          </motion.button>
        </div>

       
        <motion.div 
          className="absolute right-20 md:right-40 top-1/3 transform -translate-y-1/2 rotate-6 w-72 md:w-96 shadow-lg"
          initial={{ opacity: 0, y: 100, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: 6 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          whileHover={{ rotate: 0, transition: { duration: 0.5 } }}
        >
        <img src={box} alt="Small Box" className="rounded-lg shadow-2xl" />
        </motion.div>

        
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-sm mb-2">Scroll Down</span>
          <motion.div 
            className="w-1 h-10 bg-orange-500 rounded-full"
            animate={{ 
              y: [0, 10, 0],
              opacity: [1, 0.6, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatType: "loop" 
            }}
          />
        </motion.div>
      </div>

      
  <SectionAnimation>
    <div
      className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center px-10 md:px-20 py-20"
      style={{
        backgroundImage: `url(${owner_background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "multiply",
        backgroundRepeat: "no-repeat",
      }}
      id="about"
    >
      
      <div className="absolute inset-0 bg-black/50"></div>

      
      <motion.div 
        className="relative w-full md:w-1/3 z-10 flex justify-center md:justify-end"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.img
          src={owner}
          alt="Photographer"
          className="w-64 md:w-80 rounded-lg shadow-lg border-4 border-orange-500"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.3)"
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      
      <div className="relative w-full md:w-2/3 z-10 flex flex-col items-center md:items-start md:pl-10">
        
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center md:text-left mt-[-100px]"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
      >
          <span className="text-orange-400">Who</span>{" "}
          <span className="text-white">We Are</span>{" "}
          <span className="text-orange-500">?</span>
        </motion.h2>


      
      <motion.div 
        className="relative mt-5 p-8 md:p-10 bg-green-200 text-gray-900 max-w-2xl custom-shape shadow-lg"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-lg leading-relaxed">
          We are dedicated to capturing life's most precious moments with a 
          creative and professional touch. Founded by Shahela Kahadawala, our 
          studio specializes in photography and videography services, ensuring 
          that every event is beautifully documented.
          <br />
          <br />
          We also offer photo and video editing, photo framing, album design, 
          as well as camera and light rentals for all your creative needs. With 
          years of experience, we're passionate about providing high-quality 
          work that preserves your memories for a lifetime. Trust us to deliver 
          exceptional results tailored to your unique story.
        </p>
      </motion.div>
    </div>
  </div>
  </SectionAnimation>


      
      <div
        className="relative w-full min-h-screen text-white py-20 px-10 md:px-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${dot})` }}
        id="services"
      >
        
        <div className="absolute inset-0 bg-black/50"></div>

        
        <div className="relative z-10">
          <motion.h2 
            className="text-center text-4xl md:text-5xl font-bold mb-10"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Our <span className="text-orange-500">Services</span>
          </motion.h2>

          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
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
              <motion.div
                key={index}
                className="bg-[#131313] p-5 rounded-lg shadow-lg overflow-hidden relative group cursor-pointer"
                variants={fadeInUp}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.3)"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div className="overflow-hidden rounded-lg mb-4">
                  <motion.img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-40 object-cover"
                    whileHover={{ 
                      scale: 1.1,
                      transition: { duration: 0.5 }
                    }}
                  />
                </motion.div>
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="text-sm text-gray-400">{service.desc}</p>
                <motion.div 
                  className="absolute bottom-0 left-0 w-full h-1 bg-orange-500"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      
      <div 
        className="relative w-full min-h-[600px] flex flex-col items-center justify-center py-20 px-10 md:px-20 bg-[#0a0a0a]"
        id="gallery"
      >
        
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50 rounded-lg"
          style={{ backgroundImage: `url(${dot})` }}
        ></div>

        
        <motion.h2 
          className="relative text-center text-4xl md:text-5xl font-bold text-white mb-16 -mt-10 z-20"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Latest Work <span className="text-orange-500">Gallery</span>
        </motion.h2>

       
        <div className="relative w-full max-w-6xl mx-auto mt-20">
         
          <motion.div 
            className="w-full h-100 md:h-80 bg-gray-800 rounded-lg overflow-hidden shadow-xl"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.img
              src={background3}
              alt="Background Gallery"
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              viewport={{ once: true }}
            />
          </motion.div>
          
          
          <div className="absolute top-[-15%] left-1/2 transform -translate-x-1/2 flex gap-6 z-10">
           
            <motion.div 
              className="w-40 md:w-52 h-52 bg-gray-800 rounded-lg overflow-hidden shadow-lg"
              variants={photoAnimation}
              initial="initial"
              whileHover="hover"
              whileInView={{ 
                opacity: [0, 1],
                y: [50, 0],
                rotate: [-5, 0]
              }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src={image1}
                alt="Gallery 1"
                className="w-full h-full object-cover"
              />
            </motion.div>

           
            <motion.div 
              className="w-48 md:w-60 h-60 bg-gray-800 rounded-lg overflow-hidden shadow-xl"
              variants={photoAnimation}
              initial="initial"
              whileHover="hover"
              whileInView={{ 
                opacity: [0, 1],
                y: [50, 0]
              }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <img
                src={image2}
                alt="Gallery 2"
                className="w-full h-full object-cover"
              />
            </motion.div>

           
            <motion.div 
              className="w-40 md:w-52 h-52 bg-gray-800 rounded-lg overflow-hidden shadow-lg"
              variants={photoAnimation}
              initial="initial"
              whileHover="hover"
              whileInView={{ 
                opacity: [0, 1],
                y: [50, 0],
                rotate: [5, 0]
              }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img
                src={image3}
                alt="Gallery 3"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>

       
        <motion.button 
          className="relative mt-8 px-6 py-3 bg-orange-500 text-white font-semibold rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          View All
        </motion.button>
      </div>

    
      <div
        className="relative w-full flex flex-col items-center justify-center py-20 px-6 md:px-12 bg-cover bg-center"
        style={{ backgroundImage: `url(${dot})` }}
        id="videos"
      >
       
        <div className="absolute inset-0 bg-black opacity-50"></div>

        
        <div className="relative z-10 w-full max-w-6xl text-center">
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Our <span className="text-orange-500">Videos</span>
          </motion.h2>

          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
           
            {[
              videoThumbnail1,
              videoThumbnail2,
              videoThumbnail3,
              videoThumbnail4,
            ].map((video, index) => (
              <motion.div
                key={index}
                className="relative group overflow-hidden rounded-lg shadow-lg"
                variants={fadeInUp}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.3)"
                }}
              >
                <motion.img
                  src={video}
                  alt={`Video ${index + 1}`}
                  className="w-full h-48 object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.button 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white p-3 rounded-full opacity-0 group-hover:opacity-100"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                >
                  ▶️
                </motion.button>
                <motion.div 
                  className="p-4 bg-gray-900"
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-white font-semibold">
                    Video Title {index + 1}
                  </h3>
                  <span className="text-gray-400 text-sm">Category</span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

     
      <footer className="bg-[#10202B] text-white py-8" id="contact">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
         
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p className="text-gray-300 text-sm">Sahan Ovrids</p>
            <p className="text-gray-300 text-sm">+07123456789</p>
            <p className="text-gray-300 text-sm">sahanovrids@gmail.com</p>

           
            <form className="space-y-3">
              <motion.input
                type="text"
                placeholder="Full Name"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                whileFocus={{ scale: 1.02, boxShadow: "0px 0px 8px rgba(249, 115, 22, 0.4)" }}
              />
              <motion.input
                type="text"
                placeholder="Mobile Number"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                whileFocus={{ scale: 1.02, boxShadow: "0px 0px 8px rgba(249, 115, 22, 0.4)" }}
              />
              <motion.input
                type="email"
                placeholder="Email"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                whileFocus={{ scale: 1.02, boxShadow: "0px 0px 8px rgba(249, 115, 22, 0.4)" }}
              />
              <motion.textarea
                placeholder="Message"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                whileFocus={{ scale: 1.02, boxShadow: "0px 0px 8px rgba(249, 115, 22, 0.4)" }}
              ></motion.textarea>
              <motion.button 
                className="w-full px-5 py-2 bg-orange-500 text-white font-semibold rounded-md shadow-lg hover:bg-orange-600 focus:outline-none text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit
              </motion.button>
            </form>
          </motion.div>

        
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              {[
                { name: "Gallery", href: "#gallery" },
                { name: "About Us", href: "#about" },
                { name: "Videos", href: "#videos" },
                { name: "Testimonials", href: "#testimonials" },
                { name: "Contact Us", href: "#contact" }
              ].map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5, color: "#f97316" }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href={link.href}
                    className="transition duration-200 ease-in-out"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.h3 
              className="text-lg font-semibold mb-2 flex items-center"
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.img
                src={logo}
                alt="SKW Photography Logo"
                className="mr-2 w-8 h-8 object-contain"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1 }}
              />
              SKW Photography
            </motion.h3>
            <p className="text-gray-300 text-sm">971/C, Malabe, Sri Lanka</p>
            <p className="text-gray-300 text-sm">+94 712 123 123</p>
            <p className="text-gray-300 text-sm">photography@gmail.com</p>
            <p className="text-gray-300 text-sm mt-2">
              Opening Hours: <br /> Mon-Sat: 8:00 AM - 6:00 PM
            </p>
          </motion.div>
        </div>

       
        <motion.div 
          className="text-center text-gray-400 text-xs mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          © Copyright 2024. SKW Photography. All Rights Reserved.
        </motion.div>
      </footer>
    </div>
  );
};

export default HomePage;