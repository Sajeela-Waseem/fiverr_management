import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import emailjs from "@emailjs/browser";
import service1 from "../Images/1.webp";
import service2 from "../Images/2.webp";
import service3 from "../Images/3.webp";
import service4 from "../Images/4.webp";
import Navbar from "../components/Navbar";

const Buyer = () => {
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
 
 const sendCouponEmail = async () => {
  if (!user || !user.email) {
    alert("User not logged in.");
    return;
  }

  const couponCode = generateCouponCode(); // ← generate new each time

  try {
    await emailjs.send(
      "service_bi2xmdb",
      "template_d5k9y4k",
      {
        user_email: user.email,
        coupon_code: couponCode,
      },
      "j8VnXuRx-HiUjs4h1"
    );
    alert("Coupon Code sent to your email.");
  } catch (err) {
    console.error("❌ Error sending email:", err);
    alert("Failed to send coupon.");
  }
};


  const services = [
    { title: "Service 1", image: service1, price: "From PKR 35,214", rating: 5.0, reviews: 44,  link: "https://www.fiverr.com/shopify_manir/build-wordpress-website-development-redesign-wordpress-using-elementor-pro?context_referrer=search_gigs&source=top-bar&ref_ctx_id=c1512595f15943afa59d1f2b651355b1&pckg_id=1&pos=1&context_type=auto&funnel=c1512595f15943afa59d1f2b651355b1&seller_online=true&fiverr_choice=true&imp_id=1af4e1d2-2ba1-4365-be87-71ca94659bdd" },
    { title: "Service 2", image: service2, price: "From PKR 14,673", rating: 5.0, reviews: 13, link: "https://www.fiverr.com/shopify_manir/build-wordpress-website-development-redesign-wordpress-using-elementor-pro?context_referrer=search_gigs&source=top-bar&ref_ctx_id=c1512595f15943afa59d1f2b651355b1&pckg_id=1&pos=1&context_type=auto&funnel=c1512595f15943afa59d1f2b651355b1&seller_online=true&fiverr_choice=true&imp_id=1af4e1d2-2ba1-4365-be87-71ca94659bdd" },
    { title: "Service 3", image: service3, price: "From PKR 21,214", rating: 5.0, reviews: 34, link: "https://www.fiverr.com/shopify_manir/build-wordpress-website-development-redesign-wordpress-using-elementor-pro?context_referrer=search_gigs&source=top-bar&ref_ctx_id=c1512595f15943afa59d1f2b651355b1&pckg_id=1&pos=1&context_type=auto&funnel=c1512595f15943afa59d1f2b651355b1&seller_online=true&fiverr_choice=true&imp_id=1af4e1d2-2ba1-4365-be87-71ca94659bdd" },
    { title: "Service 4", image: service4, price: "From PKR 29,214", rating: 4.8, reviews: 126,link: "https://www.fiverr.com/shopify_manir/build-wordpress-website-development-redesign-wordpress-using-elementor-pro?context_referrer=search_gigs&source=top-bar&ref_ctx_id=c1512595f15943afa59d1f2b651355b1&pckg_id=1&pos=1&context_type=auto&funnel=c1512595f15943afa59d1f2b651355b1&seller_online=true&fiverr_choice=true&imp_id=1af4e1d2-2ba1-4365-be87-71ca94659bdd" },
  ];

  return (
    <>
      {/* Navbar */}
     <Navbar user={user} />

      {/* Fiverr Section */}
      <section className="py-10 px-4 text-center bg-white">
        <h2 className="text-3xl font-bold mb-2">Latest Services</h2>
        <p className="text-gray-600 mb-8">
          Explore the best services that suit you & Get a discount on Fiverr.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
 <div
  key={index}
  className="bg-white rounded-xl shadow border p-4 hover:shadow-lg transition duration-300 relative"
>
  {/* Discount Badge */}
 <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
  20% OFF
</div>


  {/* Fiverr Gig Link Wrapper */}
  <a
    href={service.link}
    target="_blank"
    rel="noopener noreferrer"
    className="block"
  >
    <img
      src={service.image}
      alt={service.title}
      className="w-full h-40 object-cover rounded"
    />
    <h3 className="mt-4 font-semibold text-md">{service.title}</h3>
    <div className="flex justify-center items-center text-sm text-gray-600 mt-2">
      <span className="mr-1">⭐</span>
      <span>
        {service.rating} ({service.reviews})
      </span>
    </div>
    <p className="text-green-700 font-semibold mt-2">{service.price}</p>
  </a>

  {/* Coupon Code Button (separate from link) */}
  <button
    onClick={sendCouponEmail}
    className="mt-4 bg-green-800 text-white py-2 px-4 rounded hover:bg-green-700 transition w-full"
  >
    Get a Coupon Code
  </button>
</div>


          ))}
        </div>
      </section>
    </>
  );
};

export default Buyer;
