import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  orderBy,
  serverTimestamp,
  getDocs,
  getDoc,
  doc
} from "firebase/firestore";
import { db, auth } from "../firebase";
import Navbar from "../components/Navbar";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [text, setText] = useState("");
  const [conversations, setConversations] = useState([]);
  const [userNames, setUserNames] = useState({});
  const messagesEndRef = useRef();
  const navigate = useNavigate();
  const initDone = useRef(false); // ✅ prevents double run

  const currentUser = auth.currentUser;

  if (!currentUser) {
    return <div className="p-4">Loading chat...</div>;
  }

  // 🔥 Create chat by looking up seller UID from name
  useEffect(() => {
    if (!currentUser) return;
    if (initDone.current) return; // ✅ stop duplicate runs
    initDone.current = true;

    const initChat = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const sellerName = params.get("seller");

        if (!sellerName) return;

        const usersQuery = query(
          collection(db, "users"),
          where("name", "==", sellerName)
        );
        const usersSnapshot = await getDocs(usersQuery);

        if (usersSnapshot.empty) {
          console.error("Seller not found:", sellerName);
          return;
        }

        const sellerUid = usersSnapshot.docs[0].id;

        // ✅ prevent creating convo with yourself
        if (sellerUid === currentUser.uid) return;

        const q = query(
          collection(db, "conversations"),
          where("members", "array-contains", currentUser.uid)
        );

        const snapshot = await getDocs(q);

        const existing = snapshot.docs.find(doc =>
          doc.data().members.includes(sellerUid)
        );

        if (existing) {
          setChatId(existing.id);
        } else {
          const newChat = await addDoc(collection(db, "conversations"), {
            members: [currentUser.uid, sellerUid],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          setChatId(newChat.id);
        }
      } catch (err) {
        console.error("Init chat error:", err);
      }
    };

    initChat();
  }, [currentUser]);

  // 🔥 Load conversations + fetch names
  useEffect(() => {
    const q = query(
      collection(db, "conversations"),
      where("members", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const convos = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      // ✅ Deduplicate by other member's UID
      const seen = new Set();
      const uniqueConvos = convos.filter(conv => {
        const otherUid = conv.members.find(id => id !== currentUser.uid);
        if (seen.has(otherUid)) return false;
        seen.add(otherUid);
        return true;
      });

      setConversations(uniqueConvos);

      if (!chatId && uniqueConvos.length > 0) {
        setChatId(prev => prev || uniqueConvos[0].id);
      }

      // ✅ Only fetch names we don't already have
      const uidsToFetch = uniqueConvos
        .map(conv => conv.members.find(id => id !== currentUser.uid))
        .filter(uid => uid && !userNames[uid]);

      if (uidsToFetch.length === 0) return;

     const names = {};
await Promise.all(
  uidsToFetch.map(async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        names[uid] = data.name || data.displayName || data.email || "Unknown";
      } else {
        names[uid] = uid.substring(0, 8) + "...";
      }
    } catch (err) {
      console.error("Error fetching user name:", err);
      names[uid] = "Unknown";
    }
  })
);

      setUserNames(prev => ({ ...prev, ...names }));
    });

    return () => unsubscribe();
  }, [currentUser, chatId]);

  // 🔥 Load messages
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "conversations", chatId, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })));
    });

    return () => unsubscribe();
  }, [chatId]);

  // 📤 Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await addDoc(
        collection(db, "conversations", chatId, "messages"),
        {
          text,
          senderId: currentUser.uid,
          createdAt: serverTimestamp()
        }
      );
      setText("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  // 🔽 Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* NAVBAR */}
      <Navbar user={currentUser} />

      {/* BACK BUTTON */}
      <div className="bg-white border-b px-4 py-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition"
        >
          ← Back
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <div className="w-1/4 bg-white border-r overflow-y-auto">
          <h2 className="p-4 font-bold text-lg border-b">Messages</h2>

          {conversations.map((conv) => {
            const otherUid = conv.members.find(id => id !== currentUser.uid);

            return (
              <div
                key={conv.id}
                onClick={() => setChatId(conv.id)}
                className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
                  chatId === conv.id ? "bg-gray-200" : ""
                }`}
              >
                <p className="font-medium">
                  {userNames[otherUid] || "Loading..."}
                </p>
              </div>
            );
          })}
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {chatId ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`my-2 flex ${
                    msg.senderId === currentUser.uid
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.senderId === currentUser.uid
                        ? "bg-green-600 text-white"
                        : "bg-white border"
                    }`}
                  >
                    <p>{msg.text}</p>

                    {msg.createdAt?.toDate && (
                      <span className="text-xs text-gray-400 block text-right mt-1">
                        {msg.createdAt
                          .toDate()
                          .toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-10">
                Select a conversation
              </p>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          {/* Input */}
          {chatId && (
            <div className="flex p-4 border-t bg-white">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-green-600 text-white px-6 py-2 rounded-full"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;