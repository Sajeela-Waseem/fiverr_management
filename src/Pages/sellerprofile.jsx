import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { Pencil } from "lucide-react";
import Footer from "../components/footer";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [tempImage, setTempImage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [editingGigs, setEditingGigs] = useState({});
  const [profileInfo, setProfileInfo] = useState({
    name: "",
    about: "",
    rating: "4.9",
    responseTime: "1 hour",
    memberSince: "2024",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.profileImage) setProfileImage(data.profileImage);
          setProfileInfo((prev) => ({ ...prev, ...data }));
        }
      } else {
        navigate("/signup");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        setProfileInfo((prev) => ({ ...prev, name: u.displayName || "Seller" }));
        fetchGigs(u.email);
        await loadProfileData(u.uid);
      }
    });
    return unsub;
  }, []);

  const fetchGigs = async (email) => {
  const q = query(collection(db, "promotedGigs"), where("sellerEmail", "==", email));
  const snap = await getDocs(q);
  const allGigs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // ❌ Filter out rejected gigs
  const nonRejectedGigs = allGigs.filter((gig) => gig.status !== "rejected");

  setGigs(nonRejectedGigs);
};


  const loadProfileData = async (uid) => {
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.profileImage) setProfileImage(data.profileImage);
      setProfileInfo((prev) => ({ ...prev, ...data }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setTempImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleChange = (key, val) => setProfileInfo((prev) => ({ ...prev, [key]: val }));
  const toggleEdit = () => setEditMode((v) => !v);

  const saveChanges = async () => {
    const finalImage = tempImage || profileImage;
    setProfileImage(finalImage);
    setTempImage("");
    setEditMode(false);
    await setDoc(doc(db, "users", user.uid), { ...profileInfo, profileImage: finalImage }, { merge: true });
    alert("✅ Profile updated");
  };

  const toggleEditGig = (gigId, gig) => {
    setEditingGigs((prev) => ({
      ...prev,
      [gigId]: prev[gigId]
        ? undefined
        : { discount: gig.discount, duration: gig.duration },
    }));
  };

  const handleGigChange = (gigId, field, value) => {
    setEditingGigs((prev) => ({
      ...prev,
      [gigId]: {
        ...prev[gigId],
        [field]: value,
      },
    }));
  };

  const saveGigChanges = async (gigId) => {
    const changes = editingGigs[gigId];
    if (!changes) return;

    try {
      await setDoc(
        doc(db, "promotedGigs", gigId),
        {
          discount: changes.discount,
          duration: changes.duration,
        },
        { merge: true }
      );
      alert("✅ Gig updated!");
      setEditingGigs((prev) => {
        const copy = { ...prev };
        delete copy[gigId];
        return copy;
      });
      fetchGigs(user.email);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update gig");
    }
  };

  if (!user) return <div className="text-center mt-20">Loading...</div>;

  return (
    <>
      <Navbar user={user} />

      <div className="max-w-5xl mx-auto mt-10 mb-10 bg-white shadow-md rounded-lg p-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img
                src={tempImage || profileImage || `https://ui-avatars.com/api/?name=${profileInfo.name}`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>

            {editMode && (
              <label className="absolute -bottom-3 -right-3 bg-white z-50 rounded-full p-2 shadow cursor-pointer">
                <Pencil size={16} className="text-green-600" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          <div>
            {editMode ? (
              <input
                value={profileInfo.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="text-2xl font-bold border-b focus:outline-none"
              />
            ) : (
              <h2 className="text-2xl font-bold">{profileInfo.name}</h2>
            )}
            <p className="text-gray-600">{user.email}</p>
          </div>
          <div className="ml-auto">
            <button
              onClick={editMode ? saveChanges : toggleEdit}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              {editMode ? "Save" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* About */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">About</h3>
          {editMode ? (
            <textarea
              value={profileInfo.about}
              onChange={(e) => handleChange("about", e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-line">{profileInfo.about || "Tell buyers about yourself."}</p>
          )}
        </div>

        {/* Gigs */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4">Promoted Gigs</h3>
          {gigs.length === 0 ? (
            <p className="text-gray-500">No gigs promoted yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.map((gig) => {
                const isEditing = editingGigs[gig.id];
                return (
                  <div key={gig.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md">
                    <a href={gig.gigLink} target="_blank" rel="noopener noreferrer">
                      <img
                        src={gig.gigImage}
                        alt={gig.gigTitle}
                        className="w-full h-36 object-cover rounded"
                      />
                      <h4 className="mt-2 font-semibold text-gray-800 hover:underline">
                        {gig.gigTitle}
                      </h4>
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      🔖 {gig.category} • {gig.subcategory}
                    </p>

                    {isEditing ? (
                      <div className="mt-2 space-y-2">
                        <div>
                          <label className="text-sm font-medium">Discount (%)</label>
                          <input
                            type="number"
                            value={isEditing.discount}
                            onChange={(e) =>
                              handleGigChange(gig.id, "discount", e.target.value)
                            }
                            className="w-full border px-2 py-1 rounded mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Duration (days)</label>
                          <input
                            type="number"
                            value={isEditing.duration}
                            onChange={(e) =>
                              handleGigChange(gig.id, "duration", e.target.value)
                            }
                            className="w-full border px-2 py-1 rounded mt-1"
                          />
                        </div>
                        <div className="flex justify-between mt-2">
                          <button
                            onClick={() => toggleEditGig(gig.id)}
                            className="px-3 py-1 bg-gray-300 rounded text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveGigChanges(gig.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm mt-2">
                          💸 <span className="text-green-600 font-medium">{gig.discount}% off</span> | ⏳ {gig.duration} days
                        </p>
                        <button
                          onClick={() => toggleEditGig(gig.id, gig)}
                          className="mt-2 text-sm text-indigo-600 hover:underline"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
