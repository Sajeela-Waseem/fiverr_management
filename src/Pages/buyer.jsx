import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
// import emailjs from "@emailjs/browser";
import services1 from "../Images/services1.webp";
import services2 from "../Images/services2.webp";
import services3 from "../Images/services3.webp";
import services4 from "../Images/services4.webp";
import services5 from "../Images/services5.webp";
import herosection from "../Images/hero section.webp";
import fiverr from "../Images/fiverr.webp";
import profile from "../Images/profile.webp";
import bg from "../Images/bg.mp4";
import freelancer from "../Images/freelancer.webp";
import fiverrDeal from "../Images/buyersec.webp";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Footer from '../components/footer';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import emailjs from "emailjs-com";
import CategoryFilter from "../components/CategoryFilter";

const Buyer = () => {

const [promotedGigs, setPromotedGigs] = useState([]);
useEffect(() => {
  const fetchPromotedGigs = async () => {
    const snapshot = await getDocs(collection(db, "promotedGigs"));
    const gigs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPromotedGigs(gigs);
  };

  fetchPromotedGigs();
}, []);
    const allCategories = [
    { title: "Programming & Tech", image: services1 },
    { title: "Marketing & Sales", image: services2 },
    { title: "Photography & Editing", image: services3 },
    { title: "Graphics & Design", image: services4 },
    { title: "Virtual Assistant", image: services5 },
    { title: "Content Writing", image: services3 },
    { title: "UI/UX Design", image: services4 },
    { title: "Customer Support", image: services5 },
  ];

  const [showAll, setShowAll] = useState(false);

  const displayedCategories = showAll ? allCategories : allCategories.slice(0, 5);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/signup");
      }
    });
    return () => unsubscribe();
  }, []);

 
// 🔐 EmailJS configuration
const SERVICE_ID = "service_bi2xmdb";
const TEMPLATE_ID = "template_d5k9y4k";
const PUBLIC_KEY = "j8VnXuRx-HiUjs4h1";

// 🔢 Coupon Generator
const generateCouponCode = () => {
  const prefix = "FVR";
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
};

// 📧 Send coupon code to both buyer and seller
const sendCouponEmail = async (couponData) => {
  const {
    gigTitle,
    discount,
    gigLink,
    sellerEmail,
    buyerEmail
  } = couponData;

  const couponCode = generateCouponCode();

  const templateParams = {
    gig_title: gigTitle || "Fiverr Gig",
    discount: discount || "0",
    coupon: couponCode,
    buyer_email: buyerEmail,
    seller_email: sellerEmail,
    gig_link: gigLink
  };

  try {
    // Send to buyer
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

    // Send to seller
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

    alert("Coupon code sent to both buyer and seller!");
  } catch (error) {
    console.error("Email send error:", error);
    alert("Failed to send coupon.");
  }
};

// 🧠 Handler: When Buyer Clicks "Get Coupon"
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
    name: "Fiverr Deals Bot", // Optional
    email: userEmail           // Optional (used in reply_to)
  };

  emailjs
    .send("service_bi2xmdb", "template_d5k9y4k", templateParams, "j8VnXuRx-HiUjs4h1")
    .then(() => {
      alert("🎉 Coupon sent to your email!");
    })
    .catch((error) => {
      console.error("Email send error:", error);
      alert("Failed to send coupon. Please try again.");
    });
};



 

 
  const freelancers = [
    {
      name: "Awais Nadeem",
      title: "Virtual Assistant",
      image: freelancer,
      rate: "$25/hr",
    },
    {
      name: "Abdul Basit",
      title: "WordPress Developer",
      image: freelancer,
      rate: "$20/hr",
    },
    {
      name: "Khurram Nadeem",
      title: "Graphics Designer",
      image: freelancer,
      rate: "$20/hr",
    },
    {
      name: "Fateh Ali",
      title: "Digital Marketer",
      image: freelancer,
      rate: "$20/hr",
    },
  ];
  
const [gigs, setGigs] = useState([]);

useEffect(() => {
  const fetchGigs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "promotedGigs"));
      const gigsData = querySnapshot.docs.map((doc) => doc.data());
      setGigs(gigsData);
    } catch (error) {
      console.error("Error fetching gigs:", error);
    }
  };

  fetchGigs();
}, []);

const [selectedCategory, setSelectedCategory] = useState("");

return (
<>
      {/* Navbar */}
     <Navbar user={user} />
      <div className="px-4 py-2">
      
      <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
    
      </div>

  
  <section className="py-10 px-10 text-center bg-white">
  <h2 className="text-3xl font-bold mb-2">Latest Services</h2>
  <p className="text-gray-600 mb-8">
    Explore the best services that suit you & Get a discount on Fiverr.
  </p>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {gigs.map((gig, index) => (
    <div
      key={index}
      className="relative bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 flex flex-col"
    >
      {/* Discount Badge */}
      <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
        -{gig.discount}%
      </div>

      {/* Image */}
      <a href={gig.gigLink} target="_blank" rel="noopener noreferrer">
        <img
          src={gig.gigImage}
          alt={gig.gigTitle}
          className="w-full h-40 object-cover"
        />
      </a>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <a
          href={gig.gigLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-md font-semibold text-gray-800 hover:underline mb-4"
        >
          {gig.gigTitle}
        </a>
         <p className="text-sm text-gray-500">
  {gig.category} / {gig.subcategory || "No subcategory"}
</p>

        <div className="mt-auto">
          <button
            onClick={() => handleGetCoupon(gig)}
            className="w-full bg-green-700 hover:bg-green-800 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
          >
            Get a Coupon Code
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


</section>
<section className="px-10 py-10 bg-white">
  <div className="max-w-7xl mx-auto text-center">
    <h2 className="text-4xl font-bold text-gray-900 mb-4">Service Categories</h2>
    <p className="text-gray-600 text-lg mb-10">
      Browse and buy services quickly & get a discount on Fiverr.
    </p>

    <div className="flex flex-wrap justify-center gap-5">
      {displayedCategories.map((category, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.98 }}
          className="w-56 cursor-pointer transition-all duration-300"
          onClick={() =>
            navigate(`/search?category=${encodeURIComponent(category.title)}`)
          } // ✅ 2. Navigate on click
        >
          <div className="w-full overflow-hidden rounded-xl mb-4">
            <img
              src={category.image}
              alt={category.title}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-semibold text-2xl text-gray-800 text-center">
            {category.title}
          </p>
        </motion.div>
      ))}
    </div>

    {/* ✅ Toggle Button */}
    <div className="mt-12">
      <button
        onClick={() => setShowAll(!showAll)}
        className="bg-green-900 text-white text-lg px-8 py-3 rounded-lg hover:bg-green-800 transition"
      >
        {showAll ? "Show Less" : "View All Services"}
      </button>
    </div>
  </div>
</section>


<motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-gray-50 py-10 px-6"
    >
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Top Rated Freelancers</h2>
        <p className="text-gray-600 mt-2">
          Explore the best services that suit you & Get a discount on Fiverr.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-20">
        {freelancers.map((freelancer, index) => (
          <div
            key={index}
            className="bg-white rounded-xl overflow-hidden shadow-md border hover:shadow-lg transition duration-300"
          >
            <img
              src={freelancer.image}
              alt={freelancer.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="font-semibold text-lg text-gray-900">{freelancer.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                <span className="inline-block mr-1">⭐</span> 5.0 —{" "}
                <span className="text-gray-500">{freelancer.title}</span>
              </p>
              <p className="font-medium text-md text-gray-800 mt-2">
                From <span className="text-green-800">{freelancer.rate}</span>
              </p>
              <button className="mt-4 bg-green-900 text-white px-4 py-2 rounded hover:bg-green-800 transition">
                Order Now
              </button>
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
