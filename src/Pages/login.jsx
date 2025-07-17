import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import login from "../Images/signup.jpg"; // reuse same image


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const navigate = useNavigate();

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
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div
        className="w-1/2 bg-cover bg-center text-white flex flex-col justify-center px-10 relative"
        style={{ backgroundImage: `url(${login})` }}
      ></div>

      {/* Right Section - Login Form */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm px-6 py-10"
        >
          <h2 className="text-2xl font-bold mb-4">Log in to your account</h2>
          <p className="mb-4 text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-green-700 font-medium underline">
              Sign Up
            </a>
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
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  fill="currentColor"
                >
                  <path d="M318.7 268.7c-.3-56.6 46.2-83.7 48.2-85-26.4-38.6-67.6-43.9-82.2-44.4-35.1-3.6-68.5 20.7-86.2 20.7-17.7 0-45.1-20.2-74.3-19.6-38.2.5-73.5 22.1-93.2 56.2-40 69.3-10.2 171.8 28.7 228.1 19 27.6 41.6 58.6 71.3 57.4 28.3-1.1 39.1-18.4 73.2-18.4s44.3 18.4 74.7 17.9c30.9-.5 50.4-28.1 69.3-55.9 21.8-31.9 30.7-62.9 31-64.5-.7-.3-59.4-22.9-59.7-90.2zm-56.1-175.6c15.7-19 26.3-45.3 23.3-71.6-22.5.9-49.8 14.9-65.8 33.9-14.4 16.7-26.9 43.6-23.6 69 25.1 1.9 50.5-12.7 66.1-31.3z" />
                </svg>
                Apple
              </button>
              <button
                type="button"
                className="w-1/2 flex justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  fill="currentColor"
                >
                  <path d="M279.1 288l14.2-92.7h-88.9V132.3c0-25.4 12.4-50.1 52.2-50.1h40.4V6.3S271.2 0 240.6 0C174.5 0 135.8 38.7 135.8 109.3v58H48v92.7h87.8V512h107.6V288z" />
                </svg>
                Facebook
              </button>
            </div>
          )}

          {/* Email Login Form */}
          {showEmailForm && (
            <>
              <div className="my-4 text-center text-sm text-gray-500">
                Log in with email:
              </div>

              <input
                type="email"
                placeholder="Email"
                className="w-full mb-3 px-4 py-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full mb-4 px-4 py-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-600"
              >
                Log In
              </button>
            </>
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
        </form>
      </div>
    </div>
  );
};

export default Login;
