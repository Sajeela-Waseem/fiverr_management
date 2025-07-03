import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/login";
import Signup from "./Pages/signup";
import Buyer from "./Pages/buyer";
import Seller from "./Pages/seller";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/buyer" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/buyer" element={<Buyer />} />
        <Route path="/seller" element={<Seller />} />

        {/* Optional: redirect old Fiverr route */}
        <Route path="/fiverr" element={<Navigate to="/buyer" />} />
      </Routes>
    </Router>
  );
};

export default App;
