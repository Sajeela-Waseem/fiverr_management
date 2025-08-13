import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg flex overflow-hidden relative">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          ×
        </button>

        {isLogin ? (
          <LoginForm onClose={onClose} onToggleForm={toggleForm} />
        ) : (
          <SignupForm onClose={onClose} onToggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
