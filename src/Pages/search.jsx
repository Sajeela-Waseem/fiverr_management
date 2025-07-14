import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import CategoryFilter from "../components/CategoryFilter";
import Navbar from "../components/Navbar";
import { Search as SearchIcon } from "lucide-react";

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
        const gigCat = gig.category?.toLowerCase().trim();
        const gigSub = gig.subcategory?.toLowerCase().trim();
        const gigTitle = gig.gigTitle?.toLowerCase() || "";
        const gigTags = gig.tags?.map((t) => t.toLowerCase().trim()) || [];

        const matchCat = category ? gigCat?.includes(category) : true;
        const matchSub = subcategory ? gigSub?.includes(subcategory) : true;
        const matchTag = tag
          ? gigTitle.includes(tag) || gigTags.includes(tag)
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

  return (
    <>
      <Navbar user={user} />

      <div className="px-4 py-2">
      
      <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
    
      </div>

      <div className=" bg-white min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center text-white bg-green-900 p-4">
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
                className="bg-white rounded-lg shadow-md border overflow-hidden"
              >
                <a
                  href={gig.gigLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={gig.gigImage}
                    alt={gig.gigTitle}
                    className="w-full h-48 object-cover"
                  />
                </a>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {gig.gigTitle}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {gig.category} / {gig.subcategory || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
