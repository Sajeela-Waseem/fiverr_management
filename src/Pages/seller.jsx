// Updated Seller.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import seller from "../Images/seller.mp4";
import form from "../Images/seller.jpg";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { collection, addDoc, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { getDoc } from "firebase/firestore";
import { query, where, getDocs } from "firebase/firestore";



const Seller = () => {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [gigLink, setGigLink] = useState("");
  const [discount, setDiscount] = useState("");
  const [duration, setDuration] = useState("");
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [profileIncomplete, setProfileIncomplete] = useState(false);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setProfileData(userDoc.data());
        }
      } else {
        navigate("/signup");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handlePromoteSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      alert("User not logged in.");
      return;
    }
  
    // 🔍 Check seller's existing promoted gigs
    const gigQuery = query(
      collection(db, "promotedGigs"),
      where("sellerUid", "==", user.uid),
      where("status", "in", ["pending", "approved"])
    );
    const existingGigsSnap = await getDocs(gigQuery);
    const gigCount = existingGigsSnap.size;
  
    if (gigCount >= 5) {
      alert("⚠️ You can only promote 5 active gigs. Delete or wait for rejection to add more.");
      return;
    }
  
    const profileRef = doc(db, "users", user.uid);
    const profileSnap = await getDoc(profileRef);
    const profileData = profileSnap.exists() ? profileSnap.data() : {};
  
    if (!profileData.name) {
      setProfileIncomplete(true);
      return;
    }
  
    const normalizedLink = gigLink.startsWith("http")
      ? gigLink
      : `https://www.fiverr.com/${gigLink}`;
  
    try {
      const docRef = await addDoc(collection(db, "promotedGigs"), {
        gigLink: normalizedLink,
        discount,
        duration,
        couponCode: generateCoupon(),
        sellerUid: user.uid,
        sellerEmail: user.email,
        sellerName: profileData?.name || "Seller",
        sellerImage:
          profileData?.profileImage ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profileData?.name || "Seller"
          )}`,
        createdAt: serverTimestamp(),
        status: "pending",
      });
  
      await setDoc(doc(db, "promotedGigs", docRef.id), { id: docRef.id }, { merge: true });
  
      alert("✅ Promotion submitted! Please wait up to 24 hours for admin review.");
      setGigLink("");
      setDiscount("");
      setDuration("");
      setShowForm(false);
    } catch (error) {
      console.error("❌ Firestore error:", error);
      alert("Failed to submit promotion.");
    }
  };
  

  const generateCoupon = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  return (
    <>
      <Navbar user={user} />
      <div className="relative h-[80vh] w-full overflow-hidden">
        <video className="absolute top-0 left-0 w-full h-full object-cover z-0" src={seller} autoPlay loop muted playsInline />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md">Promote Your Gig</h1>
          <p className="text-lg mb-6 max-w-xl drop-shadow-md font-medium">
            Share your best services with the world. Add discounts and set your promotion duration easily.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600 transition"
          >
            Promote Your Gig
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl flex overflow-hidden relative">
            <div className="hidden md:block w-1/2">
              <img src={form} alt="Seller" className="object-cover w-full h-full rounded-l-lg" />
            </div>

            <div className="w-full md:w-1/2 p-6 flex flex-col">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-3 text-gray-500 text-xl font-bold"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Promote Gig</h3>

              <form onSubmit={handlePromoteSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">Gig Link</label>
                  <input
                    type="url"
                    value={gigLink}
                    onChange={(e) => setGigLink(e.target.value)}
                    required
                    placeholder="https://your-gig-link.com"
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Discount (%)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    required
                    placeholder="10"
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Promotion Duration (days)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    placeholder="7"
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-600"
                >
                  Submit Promotion
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
{profileIncomplete && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">⚠️ Incomplete Profile</h2>
      <p className="text-sm text-gray-600 mb-5">
        Please complete your seller profile before submitting a promotion.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setProfileIncomplete(false)}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            setProfileIncomplete(false);
            navigate("/seller/profile");
          }}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Go to Profile
        </button>
      </div>
    </div>
  </div>
)}

      <Footer />
    </>
  );
};

export default Seller;
