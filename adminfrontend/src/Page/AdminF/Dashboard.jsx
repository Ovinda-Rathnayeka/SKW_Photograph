import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const isSpamComment = (text) => {
  if (!text || text.length < 3) return false;

  const cleanedText = text.toLowerCase().replace(/\s/g, "");

  // Detect gibberish: mostly non-alphabetic or symbol-heavy
  const symbolPattern = /[^a-zA-Z0-9\s]{3,}/.test(text); // symbols like ;o/o;
  const gibberishPattern = /^[bcdfghjklmnpqrstvwxyz]{6,}$/i.test(cleanedText); // consonant-heavy

  // Detect profanity
  const badWords = [
    "fuck",
    "shit",
    "bitch",
    "asshole",
    "bastard",
    "damn",
    "crap",
    "dick",
    "piss",
    "slut",
    "idiot",
    "stupid",
    "moron",
    "retard",
    "suck",
    "nigger",
    "whore",
    "cunt",
  ];
  const containsBadWord = badWords.some((word) => cleanedText.includes(word));

  return symbolPattern || gibberishPattern || containsBadWord;
};

const COLORS = [
  "bg-purple-600",
  "bg-indigo-600",
  "bg-yellow-500",
  "bg-rose-500",
];
const CHART_COLORS = ["#8b5cf6", "#6366f1", "#f59e0b", "#f43f5e"];

function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ["Package", "Purchase", "Rental", "Service"];

  const categoryCount = (category) =>
    feedbacks.filter((fb) => fb.category === category).length;

  const averageRating = () => {
    if (!feedbacks.length) return 0;
    const total = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
    return (total / feedbacks.length).toFixed(2);
  };

  const mostCommonCategory = () => {
    const counts = categories.map((cat) => ({
      name: cat,
      value: categoryCount(cat),
    }));
    return counts.reduce(
      (max, curr) => (curr.value > max.value ? curr : max),
      counts[0]
    );
  };

  const positiveFeedbackPercent = () => {
    const positiveUserIds = new Set(
      feedbacks
        .filter((fb) => fb.rating >= 3)
        .map((fb) => fb.customerId?.toString())
    );
    if (!customers.length) return 0;
    return ((positiveUserIds.size / customers.length) * 100).toFixed(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedbackRes = await axios.get("http://localhost:5000/feedbacks");
        const customerRes = await axios.get("http://localhost:5000/customer");

        setFeedbacks(feedbackRes.data.feedbacks || feedbackRes.data || []);
        setCustomers(customerRes.data || []);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = categories.map((cat) => ({
    name: cat,
    value: categoryCount(cat),
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {categories.map((cat, i) => (
          <div
            key={cat}
            className={`text-white p-6 rounded-lg shadow-md ${
              COLORS[i % COLORS.length]
            }`}
          >
            <h3 className="text-lg font-semibold">{cat}</h3>
            <p className="text-3xl font-bold">{categoryCount(cat)}</p>
            <span className="text-sm">Feedbacks</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="text-white p-6 rounded-lg shadow-md bg-orange-500">
          <h3 className="text-lg font-semibold">Pending Approval</h3>
          <p className="text-3xl font-bold">
            {feedbacks.filter((fb) => !fb.isApproved).length}
          </p>
          <span className="text-sm">Feedbacks</span>
        </div>

        <div className="text-white p-6 rounded-lg shadow-md bg-green-500">
          <h3 className="text-lg font-semibold">Approved</h3>
          <p className="text-3xl font-bold">
            {feedbacks.filter((fb) => fb.isApproved).length}
          </p>
          <span className="text-sm">Feedbacks</span>
        </div>

        <div className="text-white p-6 rounded-lg shadow-md bg-red-500">
          <h3 className="text-lg font-semibold">Spam Detected</h3>
          <p className="text-3xl font-bold">
            {
              feedbacks.filter((fb) => {
                const cleanedTitle = fb.title?.toLowerCase() || "";
                const cleanedComment = fb.comment?.toLowerCase() || "";
                return (
                  isSpamComment(cleanedTitle) || isSpamComment(cleanedComment)
                );
              }).length
            }
          </p>
          <span className="text-sm">Feedbacks</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md mb-10">
        <h3 className="text-lg font-semibold mb-4">
          Positive Feedback by Users
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-4 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${positiveFeedbackPercent()}%`,
              background: `linear-gradient(to right, #fbbf24, #f59e0b)`,
            }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {positiveFeedbackPercent()}% of customers gave 3★ or higher
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4">
            Feedback Category Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4">Feedbacks Per Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Quick Feedback Insights</h3>
        <table className="w-full table-auto text-left text-sm text-gray-700">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="py-2">Metric</th>
              <th className="py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Total Feedbacks</td>
              <td className="py-2">{feedbacks.length}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Average Rating</td>
              <td className="py-2">{averageRating()}</td>
            </tr>
            <tr>
              <td className="py-2">Most Common Category</td>
              <td className="py-2">{mostCommonCategory().name}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
