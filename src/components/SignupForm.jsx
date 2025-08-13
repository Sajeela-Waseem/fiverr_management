import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import signup from "../Images/signup.jpg";

const SignupForm = ({ onClose, onToggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const modalRef = useRef();
  const navigate = useNavigate();

  // 👇 Close modal when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose(); // Call parent function to close modal
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setError("An account with this email already exists. Please log in instead.");
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/fiverr");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/fiverr");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-xl w-[800px] flex shadow-lg overflow-hidden relative"
      >

<button
    onClick={onClose}
    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
    aria-label="Close"
  >
    &times;
  </button>    

        {/* Left image */}
        <div
          className="w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${signup})`}}
        ></div>

        {/* Right form */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4">SignUp</h2>
        <p className="text-sm text-gray-600 mb-5">
  Already have an account?{" "}
  <button
    type="button"
    className="text-green-700 font-medium underline"
    onClick={onToggleForm}
  >
    Sign In
  </button>
</p>


          {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full border border-gray-300 py-2 rounded mb-3 flex items-center justify-center gap-2 hover:bg-gray-100"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <button
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="w-full border border-gray-300 py-2 rounded mb-3 flex items-center justify-center gap-2 hover:bg-gray-100"
          >
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 4a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 0v.01L12 13 20 4.01V4H4z" />
            </svg>
            Continue with email
          </button>

          <div className="flex gap-2 mb-4">
            <button className="w-1/2 border border-gray-300 py-2 rounded hover:bg-gray-100">
              Apple
            </button>
            <button className="w-1/2 border border-gray-300 py-2 rounded hover:bg-gray-100 text-blue-600">
             Facebook
            </button>
          </div>

          {showEmailForm && (
            <form onSubmit={handleSignup} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-600">
                Continue
              </button>
            </form>
          )}

          <p className="text-xs text-gray-500 mt-6">
            By joining, you agree to the Fiverr{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and to occasionally receive emails from us. Please read our{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>{" "}
            to learn how we use your personal data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
