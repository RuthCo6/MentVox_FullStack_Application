import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRobot, FaUserCircle, FaRegClock, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type Conversation = {
  userId: string;
  userMessage: string;
  botResponse: string;
  responseTime: string;
};

const MyChatsPage: React.FC = () => {
  const [allChats, setAllChats] = useState<Conversation[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const currentUserId = "450289";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get<Conversation[]>("https://localhost:7059/api/conversation");
        const userConvos = res.data.filter(chat => chat.userId === currentUserId);
        const sorted = userConvos.sort((a, b) => new Date(b.responseTime).getTime() - new Date(a.responseTime).getTime());
        setAllChats(sorted);
      } catch (err) {
        console.error("שגיאה בטעינת שיחות", err);
      }
    };

    fetchChats();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  const visibleChats = allChats.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-4xl font-extrabold text-center text-indigo-800 mb-12"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🗂 השיחות הקודמות שלך
        </motion.h2>

        {visibleChats.length === 0 ? (
          <motion.p
            className="text-gray-600 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            אין שיחות להצגה כרגע 💬
          </motion.p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {visibleChats.map((chat, idx) => (
              <motion.div
                key={idx}
                className="bg-white bg-opacity-60 rounded-3xl p-6 shadow-2xl border border-white/50 backdrop-blur-xl hover:scale-[1.03] transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <FaRegClock />
                    {new Date(chat.responseTime).toLocaleString("he-IL")}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="font-bold flex items-center gap-2 text-blue-900">
                    <FaUserCircle className="text-blue-600" />
                    {chat.userMessage}
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-2 text-purple-800 font-medium">
                    <FaRobot className="text-purple-600" />
                    {chat.botResponse}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {visibleCount < allChats.length && (
          <div className="flex justify-center mt-10">
            <motion.button
              onClick={handleLoadMore}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full text-lg shadow-lg transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              טען עוד שיחות ⬇️
            </motion.button>
          </div>
        )}

        <div className="flex justify-center mt-12">
          <button
            className="flex items-center gap-2 text-indigo-700 hover:text-indigo-900 font-bold transition"
            onClick={() => navigate("/")}
          >
            <FaArrowRight /> חזרה לעמוד הראשי
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyChatsPage;
