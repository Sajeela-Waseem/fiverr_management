import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const getInitials = (name) => {
  if (!name) return "";
  const parts = name.split(" ");
  const initials = parts.map(part => part[0].toUpperCase());
  return initials.slice(0, 2).join("");
};

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Detect outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/signup"));
  };

  const switchRole = () => {
    if (location.pathname === "/seller") {
      navigate("/"); // Go back to Buyer page
    } else {
      navigate("/seller"); // Switch to Seller page
    }
    setDropdownOpen(false);
  };

  const hideNavbarRoutes = ["/signup", "/login"];
  if (hideNavbarRoutes.includes(location.pathname)) return null;

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <div
        className="text-green-600 font-extrabold text-2xl cursor-pointer"
        onClick={() => navigate("/")}
      >
        fiverr<sup className="text-xs text-gray-500 font-normal ml-1">®</sup>
      </div>

      {/* User Dropdown */}
      {user && (
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold cursor-pointer"
          >
            {getInitials(user.displayName || user.email)}
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
              <button
                onClick={switchRole}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                {location.pathname === "/seller" ? "Switch to Buyer" : "Switch to Seller"}
              </button>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
