import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { BuyerNavbar } from "../components/Navbar";
import CategoryFilter from "../components/CategoryFilter";

const SellerPreviewPage = () => {
  const { uid } = useParams();
  const [profileInfo, setProfileInfo] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (uid) {
      loadSellerProfile();
      fetchSellerGigs();
    }
  }, [uid]);

  const loadSellerProfile = async () => {
    try {
      const docRef = doc(db, "users", uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setProfileInfo(snap.data());
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchSellerGigs = async () => {
    try {
      const q = query(collection(db, "promotedGigs"), where("sellerUid", "==", uid));
      const snap = await getDocs(q);
      setGigs(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching gigs:", error);
    }
  };

  if (!profileInfo) return <div className="text-center mt-20">Loading seller profile...</div>;

  const handleShareProfile = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl).then(() => {
      alert("🔗 Profile link copied to clipboard!");
    });
  };

  return (
    <>
      <BuyerNavbar user={user} />
       <div className="">
        <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white p-6 rounded-lg shadow">
            <div className="flex gap-4 items-center">
              <img
                src={profileInfo.profileImage || `https://ui-avatars.com/api/?name=${profileInfo.name}`}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
              />
              <div>
                <h2 className="text-xl font-bold">{profileInfo.name} </h2>
             
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">About me</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">{profileInfo.about || "No description yet."}</p>
            </div>

            {profileInfo.skills && profileInfo.skills.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {profileInfo.skills.slice(0, 4).map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 text-sm bg-gray-100 rounded-full border">
                      {skill}
                    </span>
                  ))}
                  {profileInfo.skills.length > 4 && (
                    <span className="px-3 py-1 text-sm bg-gray-100 rounded-full border">
                      +{profileInfo.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="w-full md:w-72 bg-white p-6 rounded-lg shadow h-fit">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={profileInfo.profileImage || `https://ui-avatars.com/api/?name=${profileInfo.name}`}
                alt="Small"
                className="w-10 h-10 rounded-full border object-cover"
              />
              <div>
                <p className="text-sm font-semibold">{profileInfo.name}</p>
                
              </div>
            </div>
            <button
              onClick={handleShareProfile}
              className="w-full bg-black text-white py-2 text-sm rounded hover:bg-gray-800 transition"
            >
              🔗 Share Profile
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">Average response time: {profileInfo.responseTime || "1 hour"}</p>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4">Promoted Gigs</h3>
          {gigs.length === 0 ? (
            <p className="text-gray-500">No gigs promoted yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.map((gig) => (
                <div
                  key={gig.id}
                  className="relative bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 flex flex-col"
                >
                  <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    -{gig.discount}%
                  </div>
                  <a href={gig.gigLink} target="_blank" rel="noopener noreferrer">
                    <img
                      src={gig.gigImage}
                      alt={gig.gigTitle}
                      className="w-full h-40 object-cover"
                    />
                  </a>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={profileInfo.profileImage || `https://ui-avatars.com/api/?name=${profileInfo.name}`}
                        className="w-8 h-8 rounded-full"
                        alt="Seller"
                      />
                      <div>
                        <p className="text-sm font-medium">{profileInfo.name}</p>
                        <p className="text-xs text-gray-500">⭐ {profileInfo.rating || "4.9"}</p>
                      </div>
                    </div>
                    <a
                      href={gig.gigLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-md font-semibold text-gray-800 hover:underline mb-1"
                    >
                      {gig.gigTitle}
                    </a>
                    <p className="text-sm text-gray-500">
                      🔖 {gig.category} • {gig.subcategory}
                    </p>
                    <div className="mt-4">
                      <button
                        onClick={() => alert("🎉 Coupon feature to be implemented")}
                        className="w-full bg-green-700 hover:bg-green-800 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
                      >
                        Get a Coupon Code
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SellerPreviewPage;
