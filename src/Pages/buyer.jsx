import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import freelancer from "../Images/freelancer.webp";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Footer from "../components/footer";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import emailjs from "emailjs-com";
import CategoryFilter from "../components/CategoryFilter";
import { useLocation } from "react-router-dom";

const Buyer = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [gigs, setGigs] = useState([]);
  const location = useLocation();

  // ✅ Listen to auth changes (no redirect)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch gigs
  useEffect(() => {
    const fetchApprovedGigs = async () => {
      try {
        const q = query(
          collection(db, "promotedGigs"),
          where("status", "==", "approved"),
          where("visible", "==", true)
        );
        const querySnapshot = await getDocs(q);
        const gigsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGigs(gigsData);
      } catch (error) {
        console.error("Error fetching gigs:", error);
      }
    };

    fetchApprovedGigs();
  }, []);

  const fallbackImg = "https://ui-avatars.com/api/?name=Seller";
  const SERVICE_ID = "service_bi2xmdb";
  const TEMPLATE_ID = "template_d5k9y4k";
  const PUBLIC_KEY = "j8VnXuRx-HiUjs4h1";

  const generateCouponCode = () => {
    const prefix = "FVR";
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${random}`;
  };

  const handleGetCoupon = (gig) => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) {
      alert("Please log in to receive your coupon.");
      return;
    }

    const templateParams = {
      user_email: userEmail,
      gig_title: gig?.gigTitle || "Fiverr Gig",
      discount: gig?.discount || "0",
      coupon: gig?.couponCode || generateCouponCode(),
      gig_link: gig?.gigLink || "#",
      name: "Fiverr Deals Bot",
      email: userEmail,
    };

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => alert("🎉 Coupon sent to your email!"))
      .catch((error) => {
        console.error("Email send error:", error);
        alert("Failed to send coupon. Please try again.");
      });
  };

  const freelancers = [
    { name: "Awais Nadeem", title: "Virtual Assistant", image: freelancer, rate: "$25/hr" },
    { name: "Abdul Basit", title: "WordPress Developer", image: freelancer, rate: "$20/hr" },
    { name: "Khurram Nadeem", title: "Graphics Designer", image: freelancer, rate: "$20/hr" },
    { name: "Fateh Ali", title: "Digital Marketer", image: freelancer, rate: "$20/hr" },
  ];

  return (
    <>
      <Navbar user={user} />

      <div>
        <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>

      <section className="py-10 px-10 text-center bg-white">
        <h2 className="text-3xl font-bold mb-2">Latest Services</h2>
        <p className="text-gray-600 mb-8">Explore the best services that suit you & Get a discount on Fiverr.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gigs.map((gig, index) => (
            <div key={index} className="relative bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 flex flex-col">
              <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                -{gig.discount}%
              </div>
              <a href={gig.gigLink} target="_blank" rel="noopener noreferrer">
                <img src={gig.gigImage || fallbackImg} alt={gig.gigTitle} className="w-full h-40 object-cover" />
              </a>

              <div className="p-2 flex flex-col flex-grow">
                <div onClick={() => navigate(`/seller/${gig.sellerUid}`)} className="flex items-center pb-2 gap-3 mt-3 cursor-pointer group">
                  <img
                    src={
                      gig.sellerImage?.trim()
                        ? gig.sellerImage
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(gig.sellerName || "Seller")}`
                    }
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImg;
                    }}
                    alt={gig.sellerName}
                    className="w-8 h-8 rounded-full border border-gray-300 object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition">{gig.sellerName}</p>
                  </div>
                </div>
                <a href={gig.affiliateLink || gig.gigLink} target="_blank" rel="noopener noreferrer" className="text-md text-start font-semibold text-gray-800 hover:underline mb-2">
                  {gig.gigTitle}
                </a>
                <p className="text-start text-sm text-gray-500">{gig.category} / {gig.subcategory || "No subcategory"}</p>
                <div className="mt-auto">
                  {user ? (
                    <button onClick={() => handleGetCoupon(gig)} className="w-full bg-green-700 hover:bg-green-800 text-white text-sm font-medium py-2 px-4 rounded transition-colors">
                      Get a Coupon Code
                    </button>
                  ) : (
                    <p className="text-sm text-red-600 font-medium text-center py-2"></p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="bg-gray-50 py-10 px-6">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Top Rated Freelancers</h2>
          <p className="text-gray-600 mt-2">Explore the best services that suit you & Get a discount on Fiverr.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-20">
          {freelancers.map((freelancer, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md border hover:shadow-lg transition duration-300">
              <img src={freelancer.image} alt={freelancer.name} className="w-full h-64 object-cover" />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg text-gray-900">{freelancer.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="inline-block mr-1">⭐</span> 5.0 — {freelancer.title}
                </p>
                <p className="font-medium text-md text-gray-800 mt-2">
                  From <span className="text-green-800">{freelancer.rate}</span>
                </p>
             </div>
            </div>
          ))}
        </div>
      </motion.section>

      <Footer />
    </>
  );
};

export default Buyer;
