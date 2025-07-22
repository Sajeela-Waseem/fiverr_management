import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import CategoryFilter from "../components/CategoryFilter";
import Navbar from "../components/Navbar";
import emailjs from "emailjs-com";
import Footer from "../components/footer";


const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  const query = new URLSearchParams(location.search);
  const category = query.get("category")?.toLowerCase().trim();
  const subcategory = query.get("subcategory")?.toLowerCase().trim();
  const tag = query.get("tag")?.toLowerCase().trim();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchGigs = async () => {
      const snapshot = await getDocs(collection(db, "promotedGigs"));
      const gigs = snapshot.docs.map((doc) => doc.data());

   const filtered = gigs.filter((gig) => {
  if (gig.status === "rejected") return false;

  const gigCat = gig.category?.toLowerCase().trim() || "";
  const gigSub = gig.subcategory?.toLowerCase().trim() || "";
  const gigTitle = gig.gigTitle?.toLowerCase() || "";

  const gigTags = Array.isArray(gig.tags)
    ? gig.tags.map((t) => t.toLowerCase().trim())
    : gig.tags
    ? gig.tags.toString().split(",").map((t) => t.toLowerCase().trim())
    : [];

  const matchCat = category ? gigCat.includes(category.toLowerCase()) : true;
  const matchSub = subcategory ? gigSub.includes(subcategory.toLowerCase()) : true;
  const matchTag = tag
    ? gigTitle.includes(tag.toLowerCase()) || gigTags.includes(tag.toLowerCase())
    : true;

  return matchCat && matchSub && matchTag;
});


      setFilteredGigs(filtered);
    };

    fetchGigs();
  }, [category, subcategory, tag]);

  const handleSearch = () => {
    const newTag = tagSearch.trim().toLowerCase();
    if (newTag) {
      navigate(`/search?tag=${newTag}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
        .then(() => {
          alert("🎉 Coupon sent to your email!");
        })
        .catch((error) => {
          console.error("Email send error:", error);
          alert("Failed to send coupon. Please try again.");
        });
    };

  return (
    <>
      <Navbar user={user} />

      <div className="">
      
      <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
    
      </div>

      <div className=" bg-white min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center text-white bg-green-700 p-4">
          Search Result: {category || "All"}
          {subcategory && ` / ${subcategory}`}
          {tag && ` / ${tag}`}
        </h1>

        {filteredGigs.length === 0 ? (
          <p className="text-gray-600 text-center">No gigs found for this filter.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {filteredGigs.map((gig, idx) => (
             <div
  key={idx}
  className="bg-white rounded-lg shadow-md border overflow-hidden flex flex-col"
>
 <a
  href={gig.affiliateLink || gig.gigLink}
  target="_blank"
  rel="noopener noreferrer"
>

    <img
      src={gig.gigImage}
      alt={gig.gigTitle}
      className="w-full h-48 object-cover"
    />
  </a>

  <div className="p-4 flex flex-col flex-grow justify-between">
    <div>
      <a
  href={gig.affiliateLink || gig.gigLink}
  target="_blank"
  rel="noopener noreferrer"
>
      <h3 className="font-bold text-lg text-gray-800 mb-2">
        {gig.gigTitle}
      </h3>
      </a>
      <p className="text-sm text-gray-500 mb-4">
        {gig.category} / {gig.subcategory || "N/A"}
      </p>
    </div>

    <button
      onClick={() => handleGetCoupon(gig)}
      className="w-full bg-green-700 hover:bg-green-800 text-white text-sm font-medium py-2 px-4 rounded transition-colors mt-auto"
    >
      Get a Coupon Code
    </button>
  </div>
</div>

            ))}
          </div>
        )}
      </div>
       <Footer />
    </>
  );
};

export default Search;
