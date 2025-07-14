import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Search } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";






const getInitials = (name) => {
  if (!name) return "";
  const parts = name.split(" ");
  const initials = parts.map((part) => part[0].toUpperCase());
  return initials.slice(0, 2).join("");
};

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Hide navbar on login/signup pages
  const hideNavbarRoutes = ["/signup", "/login"];
  if (hideNavbarRoutes.includes(location.pathname)) return null;

  // Load initial tag from URL
  const initialTag = new URLSearchParams(location.search).get("tag") || "";
  const [tagSearch, setTagSearch] = useState(initialTag);

  // Dropdown outside click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout handler
  const handleLogout = () => {
    signOut(auth).then(() => navigate("/signup"));
  };

  // Switch between buyer/seller views
  const switchRole = () => {
    if (location.pathname === "/seller") {
      navigate("/"); // Go back to Buyer page
    } else {
      navigate("/seller"); // Switch to Seller page
    }
    setDropdownOpen(false);
  };

  // Handle tag search
  const handleSearch = () => {
    const tagParam = tagSearch ? `tag=${tagSearch}` : "";
    navigate(`/search?${tagParam}`);
  };

  // Optional: Trigger search on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
const [suggestions, setSuggestions] = useState([]);
const [allTags, setAllTags] = useState([]); 

useEffect(() => {
  const fetchTags = async () => {
    const snapshot = await getDocs(collection(db, "promotedGigs"));
    const tagsSet = new Set();

    snapshot.docs.forEach((doc) => {
      const gig = doc.data();
      if (gig.tags && Array.isArray(gig.tags)) {
        gig.tags.forEach((tag) => tagsSet.add(tag.toLowerCase()));
      }
      if (gig.gigTitle) {
        tagsSet.add(gig.gigTitle.toLowerCase());
      }
    });

    setAllTags([...tagsSet]);
  };

  fetchTags();
}, []);

const searchRef = useRef();
useEffect(() => {
  const handleClickOutsideSearch = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSuggestions([]); // clear suggestions if clicked outside
    }
  };
  document.addEventListener("mousedown", handleClickOutsideSearch);
  return () => document.removeEventListener("mousedown", handleClickOutsideSearch);
}, []);

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <div
        className="text-green-600 font-extrabold text-2xl cursor-pointer"
        onClick={() => navigate("/")}
      >
        fiverr<sup className="text-xs text-gray-500 font-normal ml-1">®</sup>
      </div>

      {/* Search Bar */}
  <div ref={searchRef} className="relative w-full sm:w-96">
  <input
    type="text"
    className="w-full border border-gray-300 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
    placeholder="Search by tags..."
    value={tagSearch}
    onChange={(e) => {
      const value = e.target.value;
      setTagSearch(value);
      const filtered = allTags
        .filter((tag) => tag.includes(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
    }}
    onKeyDown={handleKeyDown}
  />
  {suggestions.length > 0 && (
    <ul className="absolute z-50 bg-white border border-gray-300 w-full mt-1 rounded-md shadow-md">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          onClick={() => {
            setTagSearch(suggestion);
            setSuggestions([]);
            navigate(`/search?tag=${encodeURIComponent(suggestion)}`);
          }}
          className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700"
        >
          {suggestion}
        </li>
      ))}
    </ul>
  )}
  <button
    onClick={handleSearch}
    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
  >
    <Search className="w-5 h-5" />
  </button>
</div>




      {/* User Dropdown */}
      {user && (
        <div className="relative ml-4" ref={dropdownRef}>
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
                {location.pathname === "/seller"
                  ? "Switch to Buyer"
                  : "Switch to Seller"}
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
