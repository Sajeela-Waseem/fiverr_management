import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded"
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

        <div className="my-4 text-center">or</div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-500 flex items-center justify-center gap-2"
        >
          {/* Google Icon */}
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
            fill="white"
          >
            <path d="M488 261.8c0-17.8-1.6-35-4.6-51.8H249v98h134c-6 32-24 59-51 77v64h82c48-44 76-109 76-187z" />
            <path d="M249 492c67 0 123-22 164-59l-82-64c-23 16-53 26-82 26-63 0-117-42-136-99H33v62c41 81 124 134 216 134z" />
            <path d="M113 297c-10-30-10-62 0-92v-62H33c-41 81-41 173 0 254l80-62z" />
            <path d="M249 97c36 0 69 12 94 36l70-70C370 23 314 0 249 0 157 0 74 53 33 134l80 62c19-57 73-99 136-99z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-green-700 font-semibold underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
