import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0c0c0c] text-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[2fr_1.2fr_1fr] gap-6 md:gap-10 items-start text-sm">
        
        {/* About Us */}
        <div>
          <h3 className="text-[#1dbf73] font-semibold text-base mb-2">About Us</h3>
          <p className="text-gray-300 leading-relaxed">
            At Fiverr management’s platform, we connect talented freelancers with
            ambitious clients across the globe. Our mission is to enable growth
            through trusted digital services and world-class collaboration.
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-1">
  <h3 className="text-[#1dbf73] font-semibold text-base mb-2">Customer Support</h3>

  <p className="text-gray-300">
    Email:{" "}
    <a
      href="https://mail.google.com/mail/?view=cm&fs=1&to=waseemsajeela123@gmail.com"
      className="text-white hover:text-green-500 transition"
      target="_blank"
      rel="noopener noreferrer"
    >
      waseemsajeela123@gmail.com
    </a>
  </p>

  <p className="text-gray-300">
    Phone:{" "}
    <a
      href="tel:+11234567890"
      className="text-white hover:text-green-500 transition"
    >
      +1 (123) 456-7890
    </a>
  </p>

  <p className="text-gray-300">
    WhatsApp:{" "}
    <a
      href="https://wa.me/923116918845"
      className="text-white hover:text-green-500 transition"
      target="_blank"
      rel="noopener noreferrer"
    >
      0311-6918845
    </a>
  </p>
</div>



        {/* Social Media */}
        <div>
          <h3 className="text-[#1dbf73] font-semibold text-base mb-2">Follow Us</h3>
          <div className="flex space-x-4 text-lg mt-2">
            <a href="#" className="text-gray-300 hover:text-[#1dbf73] transition"><FaFacebookF /></a>
            <a href="#" className="text-gray-300 hover:text-[#1dbf73] transition"><FaInstagram /></a>
            <a href="#" className="text-gray-300 hover:text-[#1dbf73] transition"><FaLinkedinIn /></a>
            <a href="#" className="text-gray-300 hover:text-[#1dbf73] transition"><FaTwitter /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 mt-10 pt-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} All rights reserved by <span className="text-white font-semibold">Sajeela Waseem</span>.
      </div>
    </footer>
  );
};

export default Footer;
