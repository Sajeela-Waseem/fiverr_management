import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Buyer from "./Pages/buyer";
import Seller from "./Pages/seller";
import Search from "./Pages/search";
import ProfilePage from "./Pages/sellerprofile";
import SellerPreviewPage from "./Pages/sellerPreviewPage";
import ScrollToTop from "./components/ScrollToTop";
import LandingPage from "./Pages/landingPage";
import AuthModal from "./components/AuthModal";


import { onAuthStateChanged } from "firebase/auth";  // <-- IMPORTANT
import { auth } from "./firebase";                  // <-- IMPORTANT

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <ScrollToTop />
      <Routes>

    <Route
  path="/"
  element={!user ? <LandingPage /> : <Navigate to="/buyer" />}
/>

<Route
  path="/auth"
  element={!user ? <AuthModal /> : <Navigate to="/buyer" />}
/>

<Route path="/buyer" element={user ? <Buyer /> : <Navigate to="/" />} />
<Route path="/seller" element={user ? <Seller /> : <Navigate to="/" />} />

<Route path="/search" element={<Search />} />
<Route path="/seller/profile" element={<ProfilePage />} />
<Route path="/seller/:uid" element={<SellerPreviewPage />} />

<Route path="*" element={<div>404 – Page Not Found</div>} />

      </Routes>
    </Router>
  );
};

export default App;
