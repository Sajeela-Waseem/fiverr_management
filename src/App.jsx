import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Buyer from "./Pages/buyer";
import Seller from "./Pages/seller";
import Search from "./Pages/search";
import ProfilePage from "./Pages/sellerprofile";
import SellerPreviewPage from "./Pages/sellerPreviewPage";
import ScrollToTop from "./components/ScrollToTop";
import "./index.css";
import "./App.css";

const App = () => {
  
  return (
   <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/buyer" />} />
        <Route path="/buyer" element={<Buyer />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="/search" element={<Search />} /> 
        <Route path="/fiverr" element={<Navigate to="/buyer" />} />
        <Route path="/seller/profile" element={<ProfilePage />} />
        <Route path="/seller/:uid" element={<SellerPreviewPage />} />
        <Route path="*" element={<div>404 — Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
