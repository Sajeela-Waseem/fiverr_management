import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import emailjs from "@emailjs/browser";
import service1 from "../Images/1.webp";
import service2 from "../Images/2.webp";
import service3 from "../Images/3.webp";
import service4 from "../Images/4.webp";
import services1 from "../Images/services1.webp";
import services2 from "../Images/services2.webp";
import services3 from "../Images/services3.webp";
import services4 from "../Images/services4.webp";
import services5 from "../Images/services5.webp";
import herosection from "../Images/hero section.webp";
import fiverr from "../Images/fiverr.webp";
import profile from "../Images/profile.webp";
import { Star } from "lucide-react";
import bg from "../Images/bg.mp4";
import freelancer from "../Images/freelancer.webp";
import fiverrDeal from "../Images/buyersec.webp";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Footer from '../components/footer';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";



    // Sample freelancer images

 
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

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/signup");
    });
  };
const generateCouponCode = () => {
  const prefix = "FVR";
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
};
 
 const sendCouponEmail = async (sellerEmail) => {
  if (!user || !user.email) {
    alert("User not logged in.");
    return;
  }

  const couponCode = generateCouponCode();

  try {
    await Promise.all([
      emailjs.send("service_id", "template_id", {
        user_email: user.email,
        coupon_code: couponCode,
      }, "public_key"),
      emailjs.send("service_id", "template_id", {
        user_email: sellerEmail,
        coupon_code: couponCode,
      }, "public_key")
    ]);

    alert("Coupon Code sent to you and seller!");
  } catch (err) {
    console.error("Error sending email:", err);
    alert("Failed to send coupon.");
  }
};


  const services = [
    { title: "Service 1", image: service1, price: "From PKR 35,214", rating: 5.0, reviews: 44,  link: "https://www.fiverr.com/shopify_manir/build-wordpress-website-development-redesign-wordpress-using-elementor-pro?context_referrer=search_gigs&source=top-bar&ref_ctx_id=c1512595f15943afa59d1f2b651355b1&pckg_id=1&pos=1&context_type=auto&funnel=c1512595f15943afa59d1f2b651355b1&seller_online=true&fiverr_choice=true&imp_id=1af4e1d2-2ba1-4365-be87-71ca94659bdd" },
    { title: "Service 2", image: service2, price: "From PKR 14,673", rating: 5.0, reviews: 13, link: "https://www.fiverr.com/shopify_manir/build-wordpress-website-development-redesign-wordpress-using-elementor-pro?context_referrer=search_gigs&source=top-bar&ref_ctx_id=c1512595f15943afa59d1f2b651355b1&pckg_id=1&pos=1&context_type=auto&funnel=c1512595f15943afa59d1f2b651355b1&seller_online=true&fiverr_choice=true&imp_id=1af4e1d2-2ba1-4365-be87-71ca94659bdd" },
    { title: "Service 3", image: service3, price: "From PKR 21,214", rating: 5.0, reviews: 34, link: "https://www.fiverr.com/shopify_manir/build-wordpress-website-development-redesign-wordpress-using-elementor-pro?context_referrer=search_gigs&source=top-bar&ref_ctx_id=c1512595f15943afa59d1f2b651355b1&pckg_id=1&pos=1&context_type=auto&funnel=c1512595f15943afa59d1f2b651355b1&seller_online=true&fiverr_choice=true&imp_id=1af4e1d2-2ba1-4365-be87-71ca94659bdd" },
    { title: "Service 4", image: service4, price: "From PKR 29,214", rating: 4.8, reviews: 126,link: "https://www.fiverr.com/shopify_manir/build-wordpress-website-development-redesign-wordpress-using-elementor-pro?context_referrer=search_gigs&source=top-bar&ref_ctx_id=c1512595f15943afa59d1f2b651355b1&pckg_id=1&pos=1&context_type=auto&funnel=c1512595f15943afa59d1f2b651355b1&seller_online=true&fiverr_choice=true&imp_id=1af4e1d2-2ba1-4365-be87-71ca94659bdd" },
  ];
const [count, setCount] = useState(0);

  // Animate number from 0 to 128000
  useEffect(() => {
    let start = 0;
    const end = 128000;
    const duration = 2000; // ms
    const increment = Math.ceil(end / (duration / 16));

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end.toLocaleString());
        clearInterval(counter);
      } else {
        setCount(start.toLocaleString());
      }
    }, 16);

    return () => clearInterval(counter);
  }, []);
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
  return (

    <>
      {/* Navbar */}
     <Navbar user={user} />
 <section className="relative bg-green-950 text-white py-28 px-4 sm:px-8 lg:px-16 overflow-hidden text-center">
  {/* Background Image with Overlay */}
  <div className="absolute inset-0">
    <img
      src={herosection}
      alt="Background"
      className="w-full h-full object-cover opacity-30"
    />
    <div className="absolute inset-0 bg-green-950 opacity-60"></div>
  </div>

  {/* Animated Content */}
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 1, ease: "easeOut" }}
    className="relative max-w-3xl mx-auto z-10"
  >
    <span className="inline-block text-green-300 text-sm font-semibold border border-green-300 px-4 py-1 rounded-full mb-6">
      Unlock Coupons – Reveal & Save!
    </span>

    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 leading-tight drop-shadow-md">
      Get Exclusive Fiverr<span className="text-green-400">.</span><br />
      Coupon Codes
    </h2>

    <div className="flex justify-center gap-16 mb-10">
      <div>
        <p className="text-green-400 text-4xl font-extrabold">7M+</p>
        <p className="text-gray-300 text-base mt-1">Monthly visits</p>
      </div>
      <div>
        <p className="text-green-400 text-4xl font-extrabold">3M</p>
        <p className="text-gray-300 text-base mt-1">Social Followers</p>
      </div>
    </div>
     
    <button
  onClick={() => sendCouponEmail(service.sellerEmail)}
  className="mt-4 bg-green-800 text-white py-2 px-4 rounded hover:bg-green-700 transition "
>
  Get a Coupon Code
</button>
  </motion.div>
</section>
   <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative overflow-hidden text-white px-4 py-10 md:px-10"
    >
   
<video
  src={bg}
  autoPlay
  muted
  loop
  playsInline
  className="absolute inset-0 w-full h-full object-cover z-0"
/>

      {/* 🟢 Overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-10" />

      {/* 🔵 Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto grid md:grid-cols-3 items-center">
        {/* Fiverr Image Card */}
        <div className="p-6 flex items-center justify-center">
          <img
            src={fiverr}
            alt="Fiverr Coupon"
            className="h-full w-full object-contain rounded-2xl"
          />
        </div>

        {/* Stats Section with Divider */}
        <div className="text-center md:text-left space-y-4 px-10 border-r border-white/20">
          <div className="flex items-center justify-center md:justify-start gap-2 text-base text-gray-300 font-medium">
            <span className="text-yellow-400 text-xl">⭐</span>
            <span>Google Rating</span>
            <span className="text-white font-semibold text-lg">4.8</span>
          </div>
          <h2 className="text-5xl font-extrabold tracking-tight leading-tight">
            {count} +
          </h2>
          <p className="text-gray-300 text-lg leading-snug">
            customers in over 120 countries growing <br /> their businesses with us
          </p>
        </div>

        {/* Testimonial */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left pl-6">
          <div className="flex items-center mb-4">
            <img
              src={profile}
              alt="Awais Nadeem"
              className="w-14 h-14 rounded-full mr-4"
            />
            <div>
              <h4 className="font-bold text-lg text-white">Awais Nadeem</h4>
              <p className="text-sm text-gray-400">Business Owner</p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">Strategic Planning</h3>
            <p className="text-gray-300 text-base max-w-xs leading-relaxed">
              This platform provides exclusive coupon codes that help you save big on your purchases.
            </p>
          </div>
        </div>
      </div>
    </motion.section>

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

{/* Fiverr Section */}
      <section className="py-10 px-10 text-center bg-white">
        <h2 className="text-3xl font-bold mb-2">Latest Services</h2>
        <p className="text-gray-600 mb-8">
          Explore the best services that suit you & Get a discount on Fiverr.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
   {gigs.map((gig, index) => (
  <div key={index} className="gig-card">
    <img src={gig.gigImage} alt={gig.gigTitle} className="w-full h-40 object-cover" />
    <h2 className="text-lg font-bold mt-2">{gig.gigTitle}</h2>
    <p className="text-green-700">Discount: {gig.discount}%</p>
    <a
      href={gig.gigLink}
      target="_blank"
      rel="noopener noreferrer"
      className="block mt-2 bg-green-700 text-white text-center py-2 rounded"
    >
      Get a Coupon Code
    </a>
  </div>
))}


        </div>
      </section>

    <section className="bg-green-50 py-10 px-10 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Left Content */}
        <div>
          <h4 className="text-sm text-gray-700 font-semibold mb-2">
            Opportunity for Buyers
          </h4>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
            Unlock Exclusive Deals <br /> on Fiverr Services!
          </h2>
          <p className="text-gray-700 text-base mb-6 leading-relaxed">
            Looking for top-quality services at unbeatable prices? Now’s your
            chance to grab amazing deals on Fiverr! Whether you need graphic
            design, website development, marketing strategies, or content
            writing, get professional services at a fraction of the cost.
          </p>
          <ul className="space-y-3 text-gray-700 text-base mb-6">
            <li className="flex items-start">
              <span className="text-green-700 mr-2 mt-1">✔️</span>
              High-quality work from top-rated freelancers
            </li>
            <li className="flex items-start">
              <span className="text-green-700 mr-2 mt-1">✔️</span>
              Quick delivery to meet your deadlines
            </li>
            <li className="flex items-start">
              <span className="text-green-700 mr-2 mt-1">✔️</span>
              Secure and reliable transactions
            </li>
            <li className="flex items-start">
              <span className="text-green-700 mr-2 mt-1">✔️</span>
              24/7 support for a hassle-free experience
            </li>
          </ul>

          <p className="text-gray-800 mb-6">
            Don’t miss out on limited-time savings—browse, hire, and save on your next project today! 🚀
          </p>

          <button className="bg-green-900 text-white px-10 py-3 rounded-md hover:bg-green-800 transition">
            Get Started Now
          </button>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <img
            src={fiverrDeal}
            alt="Fiverr buyer deals"
            className="rounded-2xl shadow-lg object-cover w-full h-auto max-w-md"
          />
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
