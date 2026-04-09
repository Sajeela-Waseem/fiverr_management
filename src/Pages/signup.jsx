import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import signup from "../Images/signup.jpg";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const navigate = useNavigate();

  const saveUserToFirestore = async (user) => {
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName || email.split("@")[0],
      email: user.email,
      createdAt: serverTimestamp()
    }, { merge: true });
  };

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

      const result = await createUserWithEmailAndPassword(auth, email, password);
      await saveUserToFirestore(result.user); // ✅ save to Firestore
      navigate("/fiverr");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserToFirestore(result.user); // ✅ save to Firestore
      navigate("/fiverr");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div
        className="w-1/2 bg-cover bg-center text-white flex flex-col justify-center px-10 relative"
        style={{ backgroundImage: `url(${signup})` }}
      ></div>

      <div className="w-1/2 flex items-center justify-center bg-white">
        <form onSubmit={handleSignup} className="w-full max-w-sm px-6 py-10">
          <h2 className="text-2xl font-bold mb-4">Sign in to your account</h2>
          <p className="mb-4 text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-green-700 font-medium underline">
              Login
            </a>
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

          {!showEmailForm && (
            <div
              onClick={() => setShowEmailForm(true)}
              className="w-full border border-gray-300 py-2 rounded mb-3 text-center cursor-pointer hover:bg-gray-100"
            >
              Continue with email/username
            </div>
          )}

          {!showEmailForm && (
            <div className="flex gap-2 mb-3">
              <button type="button" className="w-1/2 flex justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100">
                Apple
              </button>
              <button type="button" className="w-1/2 flex justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100">
                Facebook
              </button>
            </div>
          )}

          {showEmailForm && (
            <>
              <div className="my-4 text-center text-sm text-gray-500">
                Create an account with email:
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
                Sign Up
              </button>
            </>
          )}

          <p className="text-xs text-gray-500 mt-6">
            By joining, you agree to the Fiverr{" "}
            <a href="#" className="underline">Terms of Service</a>{" "}
            and to occasionally receive emails from us. Please read our{" "}
            <a href="#" className="underline">Privacy Policy</a>{" "}
            to learn how we use your personal data.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;