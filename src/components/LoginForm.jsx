import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import signup from "../Images/signup.jpg";

const LoginForm = ({ onClose, onToggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const modalRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/fiverr");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  const handleGoogleLogin = async () => {
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
          className="w-1/2 bg-cover bg-center hidden md:block"
          style={{ backgroundImage: `url(${signup})` }}
        ></div>

        {/* Right form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">Log in to your account</h2>
          <p className="mb-4 text-sm text-gray-600">
  Don’t have an account?{" "}
  <button
    type="button"
    className="text-green-700 font-medium underline"
    onClick={onToggleForm}
  >
    Sign Up
  </button>
</p>


          {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 py-2 rounded mb-3 flex items-center justify-center gap-2 hover:bg-gray-100"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* Toggle Email Form */}
          {!showEmailForm && (
            <div
              onClick={() => setShowEmailForm(true)}
              className="w-full border border-gray-300 py-2 rounded mb-3 text-center cursor-pointer hover:bg-gray-100"
            >
              Continue with email/username
            </div>
          )}

          {/* Apple & Facebook */}
          {!showEmailForm && (
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                className="w-1/2 flex justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100"
              >
                 Apple
              </button>
              <button
                type="button"
                className="w-1/2 flex justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100 text-blue-600"
              >
               Facebook
              </button>
            </div>
          )}

          {/* Email Login Form */}
          {showEmailForm && (
            <form onSubmit={handleLogin} className="space-y-3">
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
                Log In
              </button>
            </form>
          )}

          <p className="text-xs text-gray-500 mt-6">
            By logging in, you agree to the Fiverr{" "}
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

export default LoginForm;
