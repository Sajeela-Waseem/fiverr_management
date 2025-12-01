// Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Search } from "lucide-react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import AuthModal from "./AuthModal";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import tooGig1 from "../Images/TooGig1.png";

const getInitials = (name) => {
  if (!name) return "";
  const parts = name.split(" ");
  return parts.map((part) => part[0].toUpperCase()).slice(0, 2).join("");
};

// ---------------------- BUYER NAVBAR ----------------------
export const BuyerNavbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [authType, setAuthType] = useState("login");
  const dropdownRef = useRef();
  const initialTag = new URLSearchParams(location.search).get("tag") || "";
  const [tagSearch, setTagSearch] = useState(initialTag);
  const [suggestions, setSuggestions] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [profileImage, setProfileImage] = useState("");

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

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const data = userDoc.data();
          if (data?.profileImage) setProfileImage(data.profileImage);
        } catch (err) {
          console.error("Error fetching profile image:", err);
        }
      }
    };
    fetchProfileImage();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const tagParam = tagSearch ? `tag=${tagSearch}` : "";
    navigate(`/search?${tagParam}`);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
      window.location.href = "/"; // full reload ensures auth state is refreshed
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  

  return (
    <nav className="bg-white shadow-md py-5 px-6 flex justify-between items-center sticky top-0 z-50">
      <div className="text-green-600 font-extrabold text-2xl cursor-pointer" onClick={() => navigate("/")}>
        <img src={tooGig1} alt="TooGig Logo" className="w-30 h-8 sm:w-30 sm:h-10 object-contain" />
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-96">
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
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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

      {/* Auth/Profile */}
      {user ? (
        <div className="relative ml-4" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold cursor-pointer overflow-hidden"
          >
            {profileImage ? (
              <img src={profileImage} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              getInitials(user.displayName || user.email)
            )}
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
              <button
                onClick={() => navigate("/seller")}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Switch to Seller
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
      ) : (
        <div className="space-x-4 ml-4">
          <button
            onClick={() => {
              setAuthType("login");
              setShowModal(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthType("signup");
              setShowModal(true);
            }}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Join
          </button>
        </div>
      )}

{showModal && (
  <AuthModal onClose={() => setShowModal(false)}>
    {authType === "login" ? (
      <LoginForm onClose={() => setShowModal(false)} />
    ) : (
      <SignupForm onClose={() => setShowModal(false)} />
    )}
  </AuthModal>
)}

    </nav>
  );
};

// ---------------------- SELLER NAVBAR ----------------------
export const SellerNavbar = ({ user }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const data = userDoc.data();
          if (data?.profileImage) setProfileImage(data.profileImage);
        } catch (err) {
          console.error("Error fetching profile image:", err);
        }
      }
    };
    fetchProfileImage();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
      window.location.href = "/"; // full reload ensures auth state is refreshed
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  

  return (
    <nav className="bg-white shadow-md py-5 px-6 flex justify-between items-center sticky top-0 z-50">
      <div
        className="text-green-600 font-extrabold text-2xl cursor-pointer"
        onClick={() => navigate("/seller")}
      >
        <img src={tooGig1} alt="TooGig Logo" className="w-30 h-8 sm:w-30 sm:h-10 object-contain" />
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold cursor-pointer overflow-hidden"
            >
              {profileImage ? (
                <img src={profileImage} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                getInitials(user.displayName || user.email)
              )}
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
                <button
                  onClick={() => navigate("/seller/profile")}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate("/buyer")}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Switch to Buyer
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
      </div>
    </nav>
  );
};

// ---------------------- WRAPPER ----------------------
const Navbar = ({ user }) => {
  const location = useLocation();
  return location.pathname.startsWith("/seller") ? (
    <SellerNavbar user={user} />
  ) : (
    <BuyerNavbar user={user} />
  );
};

export default Navbar;
