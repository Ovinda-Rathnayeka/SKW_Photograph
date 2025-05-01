import React from "react";
import logo from "../../src/components/images/logo.png";

const LoadingModal = ({ show = false }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative w-[320px] h-[320px] flex items-center justify-center">
        <div className="absolute w-[320px] h-[320px] border-[6px] border-t-blue-500 border-transparent rounded-full animate-spin-slow"></div>

        <div className="absolute w-[280px] h-[280px] border-[5px] border-l-purple-500 border-transparent rounded-full animate-spin-reverse-slower"></div>

        <div className="absolute w-[240px] h-[240px] border-[5px] border-r-teal-400 border-transparent rounded-full animate-spin"></div>

        <div className="absolute w-[200px] h-[200px] border-[4px] border-b-yellow-400 border-transparent rounded-full animate-spin-slow"></div>

        <div className="absolute w-[160px] h-[160px] border-[4px] border-t-pink-500 border-transparent rounded-full animate-spin-reverse-slower"></div>

        <img src={logo} alt="Logo" className="w-36 h-36 object-contain z-10" />
      </div>
    </div>
  );
};

export default LoadingModal;
