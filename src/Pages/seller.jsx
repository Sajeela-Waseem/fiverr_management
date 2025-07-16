import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import seller from "../Images/seller.mp4";
import form from "../Images/seller.jpg";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { collection, addDoc, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { getDoc } from "firebase/firestore";


const Seller = () => {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [gigLink, setGigLink] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [tags, setTags] = useState("");
  const [discount, setDiscount] = useState("");
  const [duration, setDuration] = useState("");
  const [gigTitle, setGigTitle] = useState("");
  const [gigImage, setGigImage] = useState("");
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

 useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
    if (currentUser) {
      setUser(currentUser);

      // 🔥 Fetch user profile data from Firestore (e.g., profile image, name)
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

  const normalizedLink = gigLink.startsWith("http")
    ? gigLink
    : `https://www.fiverr.com/${gigLink}`;

  try {
    // 🔍 Get user profile from Firestore
    const profileRef = doc(db, "users", user.uid);
    const profileSnap = await getDoc(profileRef);

    const profileData = profileSnap.exists() ? profileSnap.data() : {};

 const docRef = await addDoc(collection(db, "promotedGigs"), {
  gigLink: normalizedLink,
  gigTitle,
  gigImage,
  category,
  subcategory,
  tags: tags.split(",").map(tag => tag.trim().toLowerCase()),
  discount,
  duration,
  couponCode: generateCoupon(),
  sellerUid: user.uid,
  sellerEmail: user.email,
 sellerName: profileData?.name || "Seller",
sellerImage: profileData?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData?.name || "Seller")}`
,
  createdAt: serverTimestamp()
});



    await setDoc(doc(db, "promotedGigs", docRef.id), { id: docRef.id }, { merge: true });

    alert("Promotion submitted!");
    setGigLink("");
    setDiscount("");
    setDuration("");
    setGigTitle("");
    setGigImage("");
    setCategory("");
    setSubcategory("");
    setTags("");
    setShowForm(false);
  } catch (error) {
    console.error("❌ Firestore error:", error);
    alert("Failed to submit promotion.");
  }
};


  const generateCoupon = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const subcategoryOptions = {
    "Programming & Tech": ["Web Development", "App Development", "Automation"],
    "Marketing & Sales": ["Email Marketing", "Social Media", "SEO"],
    "Photography & Editing": ["Photo Editing", "Retouching", "Color Grading"],
    "Graphics & Design": ["Logo Design", "Branding", "Illustration"],
    "Virtual Assistant": ["Admin Tasks", "Data Entry", "Scheduling"],
    "Content Writing": ["Blogs", "Product Descriptions", "Proofreading"],
    "UI/UX Design": ["Wireframes", "Prototypes", "User Research"],
    "Customer Support": ["Live Chat", "Email Support", "CRM Management"]
  };

  return (
    <>
      <Navbar user={user} />

      <div className="relative h-[80vh] w-full overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src={seller}
          autoPlay
          loop
          muted
          playsInline
        />
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
          <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl flex overflow-hidden relative">
            <div className="hidden md:block w-1/2">
              <img
                src={form}
                alt="Seller"
                className="object-cover w-full h-full rounded-l-lg"
              />
            </div>

            <div className="w-full md:w-1/2 p-6 flex flex-col">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-3 text-gray-500 text-xl font-bold"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Promote Gig</h3>

              <form onSubmit={handlePromoteSubmit} className="flex flex-col h-full">
                <div className="flex-grow overflow-y-auto pr-1">

                  <label className="block mb-2 text-sm font-medium">Gig Title</label>
                  <input
                    type="text"
                    value={gigTitle}
                    onChange={(e) => setGigTitle(e.target.value)}
                    required
                    placeholder="e.g. I will design a modern logo"
                    className="w-full mb-4 px-4 py-2 border rounded"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium">Gig Image URL</label>
                      <input
                        type="url"
                        value={gigImage}
                        onChange={(e) => setGigImage(e.target.value)}
                        required
                        placeholder="https://example.com/image.jpg"
                        className="w-full mb-4 px-4 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium">Gig Link</label>
                      <input
                        type="url"
                        value={gigLink}
                        onChange={(e) => setGigLink(e.target.value)}
                        required
                        placeholder="https://your-gig-link.com"
                        className="w-full mb-4 px-4 py-2 border rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium">Category</label>
                      <select
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          setSubcategory("");
                        }}
                        required
                        className="w-full mb-4 px-4 py-2 border rounded"
                      >
                        <option value="">Select a category</option>
                        {Object.keys(subcategoryOptions).map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium">Subcategory</label>
                      <select
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        required
                        disabled={!category}
                        className="w-full mb-4 px-4 py-2 border rounded"
                      >
                        <option value="">Select a subcategory</option>
                        {category && subcategoryOptions[category].map((sub) => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        required
                        placeholder="e.g. logo, branding, business card"
                        className="w-full mb-4 px-4 py-2 border rounded"
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
                        className="w-full mb-4 px-4 py-2 border rounded"
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
                        className="w-full mb-4 px-4 py-2 border rounded"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-600"
                  >
                    Submit Promotion
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Seller;
